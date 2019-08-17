const express = require('express');
const router = express.Router();
const controller = require('../controllers/categories');
const upload = require('./../helpers/uploader');

router.get('/', controller.getAll);
router.get('/categories', controller.getByCategory);
router.get('/:id', controller.getById);
router.delete('/:title', controller.deleteOne);
router.post('/', upload.single('file'), controller.create);
router.put('/:id', controller.update);

module.exports = router;



// router.post('/upload', upload.single('photo'), function (req, res, next) {
//
// })