const express = require('express');
const { list } = require('../controllers/cityController');

const router = express.Router();

router.get('/', list);

module.exports = router;
