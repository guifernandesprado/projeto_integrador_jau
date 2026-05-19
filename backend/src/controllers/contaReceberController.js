const contaReceberService = require('../services/contaReceberService');

async function listar(req, res) {
  try {
    res.json(await contaReceberService.listar());
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function buscarPorId(req, res) {
  try {
    res.json(await contaReceberService.buscarPorId(req.params.id));
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

async function criar(req, res) {
  try {
    res.status(201).json(await contaReceberService.criar(req.body));
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
}

async function atualizar(req, res) {
  try {
    res.json(await contaReceberService.atualizar(req.params.id, req.body));
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
}

async function remover(req, res) {
  try {
    res.json(await contaReceberService.remover(req.params.id));
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
