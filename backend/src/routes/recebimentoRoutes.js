const express = require('express');
const router = express.Router();
const recebimentoController = require('../controllers/recebimentoController');

router.get('/', recebimentoController.listar);
router.get('/:id', recebimentoController.buscarPorId);
router.post('/', recebimentoController.criar);
router.delete('/:id', recebimentoController.remover);

module.exports = router;
