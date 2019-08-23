const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controllers/auth');
const cartController = require('./../controllers/cart');

// register
router.post('/register', controller.register);

// login
router.post('/login', controller.login);
router.get('', controller.getUsers);
// router.put('/:id', constructor.add);


module.exports = router;