const express = require('express');
const { list } = require('../controllers/categoryController');

const router = express.Router();

router.get('/', list);

module.exports = router;
