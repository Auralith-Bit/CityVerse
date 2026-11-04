const express = require('express');
const { login, googleLogin, appleLogin, me } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.post('/login', login);
router.post('/google', googleLogin);
router.post('/apple', appleLogin);
router.get('/me', authenticate, me);

module.exports = router;
