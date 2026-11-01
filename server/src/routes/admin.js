const express = require('express');
const { authenticate, requireRole } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const placeController = require('../controllers/placeController');
const categoryController = require('../controllers/categoryController');
const cityController = require('../controllers/cityController');
const prisma = require('../config/prisma');

const router = express.Router();

router.use(authenticate, requireRole('ADMIN'));

router.get('/stats', async (req, res, next) => {
  try {
    const [places, published, featured, categories, cities] = await Promise.all([
      prisma.place.count(),
      prisma.place.count({ where: { isPublished: true } }),
      prisma.place.count({ where: { isFeatured: true } }),
      prisma.category.count(),
      prisma.city.count(),
    ]);
    return res.json({ stats: { places, published, featured, categories, cities } });
  } catch (error) {
    return next(error);
  }
});

router.post('/upload', upload.single('image'), placeController.uploadCover);

router.get('/places', placeController.listAdmin);
router.get('/places/:id', placeController.getAdminById);
router.post('/places', placeController.create);
router.put('/places/:id', placeController.update);
router.delete('/places/:id', placeController.remove);

router.post('/categories', categoryController.create);
router.put('/categories/:id', categoryController.update);
router.delete('/categories/:id', categoryController.remove);

router.post('/cities', cityController.create);
router.put('/cities/:id', cityController.update);
router.delete('/cities/:id', cityController.remove);

module.exports = router;
