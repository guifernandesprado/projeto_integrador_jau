const router = require('express').Router();
const controller = require('../controllers/clienteController');
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
module.exports = router;
