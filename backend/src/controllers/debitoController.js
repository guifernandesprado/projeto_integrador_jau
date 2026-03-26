const clienteModel = require('../models/clienteModel');
const model = require('../models/debitoModel');

async function listar(req, res) {
  try {
    const rows = await model.listar();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao listar débitos.', detalhe: error.message });
  }
}

async function criar(req, res) {
  try {
    const { cliente_debito, valor_debito, vencimento_debito, descricao_debito } = req.body;
    if (!cliente_debito || !valor_debito || !vencimento_debito || !descricao_debito) {
      return res.status(400).json({ erro: 'Cliente, valor, vencimento e descrição são obrigatórios.' });
    }

    const cliente = await clienteModel.buscarPorId(cliente_debito);
    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente informado não foi encontrado.' });
    }

    const id = await model.criar(req.body);
    const item = await model.buscarPorId(id);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao registrar débito.', detalhe: error.message });
  }
}

module.exports = { listar, criar };
