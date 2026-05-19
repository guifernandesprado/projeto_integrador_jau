const recebimentoModel = require('../models/recebimentoModel');
const contaReceberModel = require('../models/contaReceberModel');
const faturamentoModel = require('../models/faturamentoModel');

async function listar() {
  return recebimentoModel.listarRecebimentos();
}

async function buscarPorId(id) {
  const recebimento = await recebimentoModel.buscarRecebimentoPorId(id);
  if (!recebimento) throw new Error('Recebimento não encontrado');
  return recebimento;
}

async function criar(dados) {
  if (!dados.conta_receber_id || !dados.data_recebimento || !dados.valor_pago || !dados.forma_pagamento) {
    throw new Error('conta_receber_id, data_recebimento, valor_pago e forma_pagamento são obrigatórios');
  }

  const conta = await contaReceberModel.buscarContaReceberPorId(dados.conta_receber_id);
  if (!conta) throw new Error('Conta a receber não encontrada');

  const valorPago = Number(dados.valor_pago);
  if (valorPago <= 0) throw new Error('valor_pago deve ser maior que zero');
  if (valorPago > Number(conta.saldo)) throw new Error('valor_pago não pode ser maior que o saldo da conta');

  const result = await recebimentoModel.criarRecebimento({
    ...dados,
    valor_pago: valorPago
  });

  const novoValorRecebido = Number(conta.valor_recebido) + valorPago;
  const novoSaldo = Number(conta.valor_original) - novoValorRecebido;
  const novoStatus = novoSaldo <= 0 ? 'QUITADO' : 'PARCIAL';

  await contaReceberModel.atualizarContaReceber(conta.id, {
    valor_original: Number(conta.valor_original),
    valor_recebido: novoValorRecebido,
    saldo: novoSaldo,
    vencimento: conta.vencimento,
    status: novoStatus
  });

  const faturamentoStatus = novoSaldo <= 0 ? 'PAGO' : 'PENDENTE';
  const faturamento = await faturamentoModel.buscarFaturamentoPorId(conta.faturamento_id);
  if (faturamento) {
    await faturamentoModel.atualizarFaturamento(faturamento.id, {
      cliente_id: faturamento.cliente_id,
      descricao: faturamento.descricao,
      valor: faturamento.valor,
      data_emissao: faturamento.data_emissao,
      vencimento: faturamento.vencimento,
      status: faturamentoStatus
    });
  }

  return { id: result.insertId, ...dados, valor_pago: valorPago };
}

async function remover(id) {
  const recebimento = await recebimentoModel.buscarRecebimentoPorId(id);
  if (!recebimento) throw new Error('Recebimento não encontrado');
  await recebimentoModel.deletarRecebimento(id);
  return { mensagem: 'Recebimento removido com sucesso' };
}

module.exports = { listar, buscarPorId, criar, remover };
