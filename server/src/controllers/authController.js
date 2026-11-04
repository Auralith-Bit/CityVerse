const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { createRemoteJWKSet, jwtVerify } = require('jose');
const prisma = require('../config/prisma');
const HttpError = require('../utils/HttpError');

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const googleSchema = z.object({
  credential: z.string().min(20),
});

const appleSchema = z.object({
  idToken: z.string().min(20),
  name: z.string().max(120).optional(),
});

const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
const APPLE_JWKS = createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'));

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl || null,
    createdAt: user.createdAt,
  };
}

async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });

    if (!user || !user.password) {
      throw new HttpError(401, 'Invalid email or password');
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      throw new HttpError(401, 'Invalid email or password');
    }

    return res.json({ user: publicUser(user), token: signToken(user) });
  } catch (error) {
    return next(error);
  }
}

async function findOrCreateOAuthUser({ provider, providerId, email, name, avatarUrl }) {
  const existingById = await prisma.user.findUnique({
    where: provider === 'google' ? { googleId: providerId } : { appleId: providerId },
  });
  if (existingById) {
    return existingById;
  }

  const existingByEmail = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existingByEmail) {
    // Only auto-link when the account has no password (pure OAuth account),
    // so a Google/Apple login can never take over an admin account.
    if (existingByEmail.password) {
      throw new HttpError(
        409,
        'This email is already registered with a password. Sign in with your password instead.'
      );
    }
    return prisma.user.update({
      where: { id: existingByEmail.id },
      data:
        provider === 'google'
          ? { googleId: providerId, avatarUrl: avatarUrl || existingByEmail.avatarUrl }
          : { appleId: providerId, avatarUrl: avatarUrl || existingByEmail.avatarUrl },
    });
  }

  return prisma.user.create({
    data: {
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      role: 'USER',
      avatarUrl: avatarUrl || null,
      ...(provider === 'google' ? { googleId: providerId } : { appleId: providerId }),
    },
  });
}

async function googleLogin(req, res, next) {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new HttpError(503, 'Google sign-in is not configured on this server');
    }

    const { credential } = googleSchema.parse(req.body);
    let claims;
    try {
      ({ payload: claims } = await jwtVerify(credential, GOOGLE_JWKS, {
        issuer: ['https://accounts.google.com', 'accounts.google.com'],
        audience: process.env.GOOGLE_CLIENT_ID,
      }));
    } catch {
      throw new HttpError(401, 'Invalid Google credential');
    }

    if (!claims.email || claims.email_verified === false) {
      throw new HttpError(401, 'Google account email is not verified');
    }

    const user = await findOrCreateOAuthUser({
      provider: 'google',
      providerId: claims.sub,
      email: claims.email,
      name: claims.name,
      avatarUrl: claims.picture,
    });

    return res.json({ user: publicUser(user), token: signToken(user) });
  } catch (error) {
    return next(error);
  }
}

async function appleLogin(req, res, next) {
  try {
    if (!process.env.APPLE_CLIENT_ID) {
      throw new HttpError(503, 'Apple sign-in is not configured on this server');
    }

    const { idToken, name } = appleSchema.parse(req.body);
    let claims;
    try {
      ({ payload: claims } = await jwtVerify(idToken, APPLE_JWKS, {
        issuer: 'https://appleid.apple.com',
        audience: process.env.APPLE_CLIENT_ID,
      }));
    } catch {
      throw new HttpError(401, 'Invalid Apple credential');
    }

    if (!claims.email || claims.email_verified === false) {
      throw new HttpError(401, 'Apple account email is not verified');
    }

    const user = await findOrCreateOAuthUser({
      provider: 'apple',
      providerId: claims.sub,
      email: claims.email,
      name: name || claims.name,
      avatarUrl: null,
    });

    return res.json({ user: publicUser(user), token: signToken(user) });
  } catch (error) {
    return next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      throw new HttpError(404, 'User not found');
    }
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

module.exports = { login, googleLogin, appleLogin, me };
