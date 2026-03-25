const clienteService = require('../services/clienteService');

async function listar(req, res) {
  try {
    const clientes = await clienteService.listar();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const cliente = await clienteService.buscarPorId(req.params.id);
    res.json(cliente);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

async function criar(req, res) {
  try {
    const novoCliente = await clienteService.criar(req.body);
    res.status(201).json(novoCliente);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
}

async function atualizar(req, res) {
  try {
    const clienteAtualizado = await clienteService.atualizar(req.params.id, req.body);
    res.json(clienteAtualizado);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
}

async function remover(req, res) {
  try {
    const resultado = await clienteService.remover(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
};