const express = require('express');
const router = express.Router();
const controller = require('../controllers/watch');

router.get('/', controller.getAll);
router.get('/categories', controller.getByCategory);
router.get('/:id', controller.getById);
router.delete('/:title', controller.deleteOne);
router.post('/', controller.create);
router.put('/:id', controller.update);

module.exports = router;