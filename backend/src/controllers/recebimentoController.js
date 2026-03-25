const recebimentoService = require('../services/recebimentoService');

async function listar(req, res) {
  try {
    res.json(await recebimentoService.listar());
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function buscarPorId(req, res) {
  try {
    res.json(await recebimentoService.buscarPorId(req.params.id));
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

async function criar(req, res) {
  try {
    res.status(201).json(await recebimentoService.criar(req.body));
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
}

async function remover(req, res) {
  try {
    res.json(await recebimentoService.remover(req.params.id));
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

module.exports = { listar, buscarPorId, criar, remover };
