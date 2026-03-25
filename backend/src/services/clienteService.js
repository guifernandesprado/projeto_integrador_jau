const clienteModel = require('../models/clienteModel');

async function listar() {
  return await clienteModel.listarClientes();
}

async function buscarPorId(id) {
  const cliente = await clienteModel.buscarClientePorId(id);

  if (!cliente) {
    throw new Error('Cliente não encontrado');
  }

  return cliente;
}

async function criar(dados) {
  if (!dados.nome) {
    throw new Error('O nome do cliente é obrigatório');
  }

  const result = await clienteModel.criarCliente(dados);
  return { id: result.insertId, ...dados };
}

async function atualizar(id, dados) {
  const cliente = await clienteModel.buscarClientePorId(id);

  if (!cliente) {
    throw new Error('Cliente não encontrado');
  }

  await clienteModel.atualizarCliente(id, dados);
  return { id, ...dados };
}

async function remover(id) {
  const cliente = await clienteModel.buscarClientePorId(id);

  if (!cliente) {
    throw new Error('Cliente não encontrado');
  }

  await clienteModel.deletarCliente(id);
  return { mensagem: 'Cliente removido com sucesso' };
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
};