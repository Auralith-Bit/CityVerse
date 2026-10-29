const { z } = require('zod');
const prisma = require('../config/prisma');
const HttpError = require('../utils/HttpError');
const slugify = require('../utils/slugify');

const cityEnum = z.enum(['BUTWAL', 'BHAIRAHWA']);

const placeSchema = z.object({
  title: z.string().min(2).max(160),
  slug: z.string().min(2).max(180).optional(),
  description: z.string().min(10),
  highlights: z.array(z.string().max(200)).optional(),
  bestTime: z.string().max(120).optional().nullable(),
  gettingThere: z.string().max(2000).optional().nullable(),
  travelTips: z.string().max(2000).optional().nullable(),
  city: cityEnum,
  address: z.string().max(255).optional().nullable(),
  distanceKm: z.coerce.number().min(0).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewCount: z.coerce.number().int().min(0).optional(),
  coverImage: z.string().max(500).optional().nullable(),
  images: z.array(z.string().max(500)).optional(),
  isFeatured: z.coerce.boolean().optional(),
  isPublished: z.coerce.boolean().optional(),
  categoryId: z.coerce.number().int().positive(),
});

const updatePlaceSchema = placeSchema.partial();

async function uniqueSlug(base, ignoreId) {
  let slug = base;
  let counter = 1;
  while (true) {
    const existing = await prisma.place.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    counter += 1;
    slug = `${base}-${counter}`;
  }
}

function buildWhere(query, includeUnpublished) {
  const where = {};
  if (!includeUnpublished) where.isPublished = true;

  if (query.city) {
    const city = String(query.city).toUpperCase();
    if (['BUTWAL', 'BHAIRAHWA'].includes(city)) where.city = city;
  }

  if (query.category) {
    where.category = { slug: String(query.category).toLowerCase() };
  }

  if (query.featured === 'true') {
    where.isFeatured = true;
  }

  if (query.search) {
    const search = String(query.search).trim();
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { address: { contains: search } },
    ];
  }

  return where;
}

async function listPublic(req, res, next) {
  try {
    const places = await prisma.place.findMany({
      where: buildWhere(req.query, false),
      include: { category: true, images: true },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });
    return res.json({ places });
  } catch (error) {
    return next(error);
  }
}

async function getBySlug(req, res, next) {
  try {
    const place = await prisma.place.findFirst({
      where: { slug: req.params.slug, isPublished: true },
      include: { category: true, images: true },
    });
    if (!place) {
      throw new HttpError(404, 'Place not found');
    }
    return res.json({ place });
  } catch (error) {
    return next(error);
  }
}

async function listAdmin(req, res, next) {
  try {
    const places = await prisma.place.findMany({
      where: buildWhere(req.query, true),
      include: { category: true, images: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ places });
  } catch (error) {
    return next(error);
  }
}

async function getAdminById(req, res, next) {
  try {
    const place = await prisma.place.findUnique({
      where: { id: Number(req.params.id) },
      include: { category: true, images: true },
    });
    if (!place) {
      throw new HttpError(404, 'Place not found');
    }
    return res.json({ place });
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const { images = [], ...data } = placeSchema.parse(req.body);
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) {
      throw new HttpError(422, 'Selected category does not exist');
    }

    const slug = await uniqueSlug(data.slug ? slugify(data.slug) : slugify(data.title));
    const place = await prisma.place.create({
      data: {
        ...data,
        slug,
        images: images.length
          ? { create: images.map((url) => ({ url, alt: data.title })) }
          : undefined,
      },
      include: { category: true, images: true },
    });
    return res.status(201).json({ place });
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.place.findUnique({ where: { id } });
    if (!existing) {
      throw new HttpError(404, 'Place not found');
    }

    const { images, ...data } = updatePlaceSchema.parse(req.body);
    if (data.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
      if (!category) {
        throw new HttpError(422, 'Selected category does not exist');
      }
    }

    const slugSource = data.slug || data.title;
    const slug = slugSource
      ? await uniqueSlug(slugify(slugSource), id)
      : existing.slug;

    if (images) {
      await prisma.placeImage.deleteMany({ where: { placeId: id } });
    }

    const place = await prisma.place.update({
      where: { id },
      data: {
        ...data,
        slug,
        images: images
          ? { create: images.map((url) => ({ url, alt: data.title || existing.title })) }
          : undefined,
      },
      include: { category: true, images: true },
    });
    return res.json({ place });
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.place.findUnique({ where: { id } });
    if (!existing) {
      throw new HttpError(404, 'Place not found');
    }
    await prisma.place.delete({ where: { id } });
    return res.json({ message: 'Place deleted' });
  } catch (error) {
    return next(error);
  }
}

async function uploadCover(req, res, next) {
  try {
    if (!req.file) {
      throw new HttpError(400, 'No file uploaded');
    }
    return res.status(201).json({ url: `/uploads/${req.file.filename}` });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listPublic,
  getBySlug,
  listAdmin,
  getAdminById,
  create,
  update,
  remove,
  uploadCover,
};
