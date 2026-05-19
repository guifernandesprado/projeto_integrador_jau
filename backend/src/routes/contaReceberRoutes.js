const express = require('express');
const router = express.Router();
const contaReceberController = require('../controllers/contaReceberController');

router.get('/', contaReceberController.listar);
router.get('/:id', contaReceberController.buscarPorId);
router.post('/', contaReceberController.criar);
router.put('/:id', contaReceberController.atualizar);
router.delete('/:id', contaReceberController.remover);

module.exports = router;
