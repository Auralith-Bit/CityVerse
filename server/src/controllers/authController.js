const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const prisma = require('../config/prisma');
const HttpError = require('../utils/HttpError');

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

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
    createdAt: user.createdAt,
  };
}

async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });

    if (!user) {
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

module.exports = { login, me };
