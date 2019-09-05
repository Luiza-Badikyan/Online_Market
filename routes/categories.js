const express = require('express');
const router = express.Router();
const controller = require('../controllers/categories');
const upload = require('./../helpers/uploader');
const passport = require('passport');
const cartController = require('./../controllers/cart');



router.get('/', controller.getAll);
router.get('/categories', controller.getByCategory);

router.post('/cart', passport.authenticate('jwt', {session: false, failWithErrors: true}), cartController.store);
router.get('/cart', passport.authenticate('jwt', {session: false, failWithErrors: true}),cartController.getInfo);

router.delete('/:title', controller.deleteOne);
router.post('/', upload.single('file'), controller.create);
router.put('/:id', upload.single('file'), controller.update);
// router.get('/:id', controller.getById);


module.exports = router;
