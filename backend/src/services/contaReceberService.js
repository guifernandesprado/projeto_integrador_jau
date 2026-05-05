const contaReceberModel = require('../models/contaReceberModel');

async function listar() {
  return contaReceberModel.listarContasReceber();
}

async function buscarPorId(id) {
  const conta = await contaReceberModel.buscarContaReceberPorId(id);
  if (!conta) throw new Error('Conta a receber não encontrada');
  return conta;
}

async function criar(dados) {
  if (!dados.faturamento_id || !dados.valor_original || !dados.vencimento) {
    throw new Error('faturamento_id, valor_original e vencimento são obrigatórios');
  }
  const payload = {
    faturamento_id: dados.faturamento_id,
    valor_original: Number(dados.valor_original),
    valor_recebido: Number(dados.valor_recebido || 0),
    saldo: Number(dados.saldo ?? dados.valor_original),
    vencimento: dados.vencimento,
    status: dados.status || 'ABERTO'
  };
  const result = await contaReceberModel.criarContaReceber(payload);
  return { id: result.insertId, ...payload };
}

async function atualizar(id, dados) {
  const conta = await contaReceberModel.buscarContaReceberPorId(id);
  if (!conta) throw new Error('Conta a receber não encontrada');

  const payload = {
    valor_original: Number(dados.valor_original ?? conta.valor_original),
    valor_recebido: Number(dados.valor_recebido ?? conta.valor_recebido),
    saldo: Number(dados.saldo ?? conta.saldo),
    vencimento: dados.vencimento ?? conta.vencimento,
    status: dados.status ?? conta.status
  };

  await contaReceberModel.atualizarContaReceber(id, payload);
  return { id: Number(id), faturamento_id: conta.faturamento_id, ...payload };
}

async function remover(id) {
  const conta = await contaReceberModel.buscarContaReceberPorId(id);
  if (!conta) throw new Error('Conta a receber não encontrada');
  await contaReceberModel.deletarContaReceber(id);
  return { mensagem: 'Conta a receber removida com sucesso' };
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
