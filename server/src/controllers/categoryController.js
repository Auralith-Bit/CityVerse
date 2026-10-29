const { z } = require('zod');
const prisma = require('../config/prisma');
const HttpError = require('../utils/HttpError');
const slugify = require('../utils/slugify');

const categorySchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(90).optional(),
  description: z.string().max(500).optional().nullable(),
});

async function list(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { places: true } } },
    });
    return res.json({ categories });
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = categorySchema.parse(req.body);
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug ? slugify(data.slug) : slugify(data.name),
        description: data.description || null,
      },
    });
    return res.status(201).json({ category });
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = categorySchema.partial().parse(req.body);
    const payload = { ...data };
    if (data.name && !data.slug) payload.slug = slugify(data.name);
    if (data.slug) payload.slug = slugify(data.slug);

    const category = await prisma.category.update({ where: { id }, data: payload });
    return res.json({ category });
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    const count = await prisma.place.count({ where: { categoryId: id } });
    if (count > 0) {
      throw new HttpError(409, 'Cannot delete a category that still has places');
    }
    await prisma.category.delete({ where: { id } });
    return res.json({ message: 'Category deleted' });
  } catch (error) {
    return next(error);
  }
}

module.exports = { list, create, update, remove };
