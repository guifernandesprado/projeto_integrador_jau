const model = require('../models/clienteModel');

function isDuplicateError(error) {
  return error && (error.code === 'ER_DUP_ENTRY' || String(error.message || '').includes('Duplicate'));
}

async function listar(req, res) {
  try {
    const rows = await model.listar();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao listar clientes.', detalhe: error.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const row = await model.buscarPorId(req.params.id);
    if (!row) return res.status(404).json({ erro: 'Cliente não encontrado.' });
    res.json(row);
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao buscar cliente.', detalhe: error.message });
  }
}

async function criar(req, res) {
  try {
    if (!req.body.nome_cliente || !req.body.cpf_cnpj) {
      return res.status(400).json({ erro: 'Nome e CPF/CNPJ são obrigatórios.' });
    }
    const id = await model.criar(req.body);
    const cliente = await model.buscarPorId(id);
    res.status(201).json(cliente);
  } catch (error) {
    const status = isDuplicateError(error) ? 409 : 500;
    const detalhe = isDuplicateError(error)
      ? 'Já existe cliente cadastrado com este CPF/CNPJ.'
      : error.message;
    res.status(status).json({ erro: 'Falha ao criar cliente.', detalhe });
  }
}

async function atualizar(req, res) {
  try {
    const atual = await model.buscarPorId(req.params.id);
    if (!atual) return res.status(404).json({ erro: 'Cliente não encontrado.' });
    await model.atualizar(req.params.id, req.body);
    const cliente = await model.buscarPorId(req.params.id);
    res.json(cliente);
  } catch (error) {
    const status = isDuplicateError(error) ? 409 : 500;
    const detalhe = isDuplicateError(error)
      ? 'Já existe outro cliente cadastrado com este CPF/CNPJ.'
      : error.message;
    res.status(status).json({ erro: 'Falha ao atualizar cliente.', detalhe });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar };
