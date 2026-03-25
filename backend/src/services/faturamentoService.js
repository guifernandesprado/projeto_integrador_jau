const faturamentoModel = require('../models/faturamentoModel');
const clienteModel = require('../models/clienteModel');
const contaReceberModel = require('../models/contaReceberModel');

async function listar() {
  return faturamentoModel.listarFaturamentos();
}

async function buscarPorId(id) {
  const faturamento = await faturamentoModel.buscarFaturamentoPorId(id);
  if (!faturamento) throw new Error('Faturamento não encontrado');
  return faturamento;
}

async function criar(dados) {
  if (!dados.cliente_id || !dados.descricao || !dados.valor || !dados.data_emissao || !dados.vencimento) {
    throw new Error('cliente_id, descricao, valor, data_emissao e vencimento são obrigatórios');
  }

  const cliente = await clienteModel.buscarClientePorId(dados.cliente_id);
  if (!cliente) throw new Error('Cliente não encontrado para o faturamento');

  const result = await faturamentoModel.criarFaturamento(dados);
  const faturamentoId = result.insertId;

  await contaReceberModel.criarContaReceber({
    faturamento_id: faturamentoId,
    valor_original: dados.valor,
    valor_recebido: 0,
    saldo: dados.valor,
    vencimento: dados.vencimento,
    status: 'ABERTO'
  });

  return { id: faturamentoId, ...dados, status: dados.status || 'PENDENTE' };
}

async function atualizar(id, dados) {
  const existente = await faturamentoModel.buscarFaturamentoPorId(id);
  if (!existente) throw new Error('Faturamento não encontrado');

  const payload = {
    cliente_id: dados.cliente_id ?? existente.cliente_id,
    descricao: dados.descricao ?? existente.descricao,
    valor: dados.valor ?? existente.valor,
    data_emissao: dados.data_emissao ?? existente.data_emissao,
    vencimento: dados.vencimento ?? existente.vencimento,
    status: dados.status ?? existente.status
  };

  await faturamentoModel.atualizarFaturamento(id, payload);
  return { id: Number(id), ...payload };
}

async function remover(id) {
  const existente = await faturamentoModel.buscarFaturamentoPorId(id);
  if (!existente) throw new Error('Faturamento não encontrado');
  await faturamentoModel.deletarFaturamento(id);
  return { mensagem: 'Faturamento removido com sucesso' };
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
