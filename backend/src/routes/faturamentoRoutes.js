const express = require('express');
const router = express.Router();
const faturamentoController = require('../controllers/faturamentoController');

router.get('/', faturamentoController.listar);
router.get('/:id', faturamentoController.buscarPorId);
router.post('/', faturamentoController.criar);
router.put('/:id', faturamentoController.atualizar);
router.delete('/:id', faturamentoController.remover);

module.exports = router;
