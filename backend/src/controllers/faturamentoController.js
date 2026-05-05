const faturamentoService = require('../services/faturamentoService');

async function listar(req, res) {
  try {
    res.json(await faturamentoService.listar());
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function buscarPorId(req, res) {
  try {
    res.json(await faturamentoService.buscarPorId(req.params.id));
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

async function criar(req, res) {
  try {
    res.status(201).json(await faturamentoService.criar(req.body));
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
}

async function atualizar(req, res) {
  try {
    res.json(await faturamentoService.atualizar(req.params.id, req.body));
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
}

async function remover(req, res) {
  try {
    res.json(await faturamentoService.remover(req.params.id));
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
