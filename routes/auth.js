const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');

// register
router.post('/register', controller.register);

// login
router.post('/login', controller.login);
router.get('', controller.getUsers);

module.exports = router;