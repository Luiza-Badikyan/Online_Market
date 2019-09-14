const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controllers/auth');
const cartController = require('./../controllers/cart');
const upload = require('./../helpers/uploader');


// register
router.post('/register', controller.register);

// login
router.post('/login', controller.login);

// // // //
router.get('', controller.getUsers);
router.put('/update_password', controller.updatePassword);
router.post('/reset_password_link', controller.resetPassword);
router.get('/reset_password/:email/:token', controller.checkToken);
router.put('/change_token/:email/:token', controller.changePasswordToken);
router.put('/:id', upload.single('file'), controller.addInformation);




module.exports = router;


