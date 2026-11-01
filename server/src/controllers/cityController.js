const { z } = require('zod');
const prisma = require('../config/prisma');
const HttpError = require('../utils/HttpError');
const slugify = require('../utils/slugify');

const citySchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(90).optional(),
  description: z.string().max(500).optional().nullable(),
});

async function list(req, res, next) {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { places: true } } },
    });
    return res.json({ cities });
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = citySchema.parse(req.body);
    const city = await prisma.city.create({
      data: {
        name: data.name,
        slug: data.slug ? slugify(data.slug) : slugify(data.name),
        description: data.description || null,
      },
    });
    return res.status(201).json({ city });
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = citySchema.partial().parse(req.body);
    const payload = { ...data };
    if (data.name && !data.slug) payload.slug = slugify(data.name);
    if (data.slug) payload.slug = slugify(data.slug);

    const city = await prisma.city.update({ where: { id }, data: payload });
    return res.json({ city });
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    const count = await prisma.place.count({ where: { cityId: id } });
    if (count > 0) {
      throw new HttpError(409, 'Cannot delete a city that still has places');
    }
    await prisma.city.delete({ where: { id } });
    return res.json({ message: 'City deleted' });
  } catch (error) {
    return next(error);
  }
}

module.exports = { list, create, update, remove };
