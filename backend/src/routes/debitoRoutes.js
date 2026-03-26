const router = require('express').Router();
const controller = require('../controllers/debitoController');
router.get('/', controller.listar);
router.post('/', controller.criar);
module.exports = router;
