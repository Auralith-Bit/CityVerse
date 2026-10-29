const express = require('express');
const {
  listPublic,
  getBySlug,
} = require('../controllers/placeController');

const router = express.Router();

router.get('/', listPublic);
router.get('/:slug', getBySlug);

module.exports = router;
