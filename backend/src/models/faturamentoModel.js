const db = require('../config/database');

async function listarFaturamentos() {
  const [rows] = await db.query(
    `SELECT f.*, c.nome AS cliente_nome
     FROM faturamentos f
     INNER JOIN clientes c ON c.id = f.cliente_id
     ORDER BY f.id DESC`
  );
  return rows;
}

async function buscarFaturamentoPorId(id) {
  const [rows] = await db.query('SELECT * FROM faturamentos WHERE id = ?', [id]);
  return rows[0];
}

async function criarFaturamento(dados) {
  const { cliente_id, descricao, valor, data_emissao, vencimento, status } = dados;
  const [result] = await db.query(
    `INSERT INTO faturamentos (cliente_id, descricao, valor, data_emissao, vencimento, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [cliente_id, descricao, valor, data_emissao, vencimento, status || 'PENDENTE']
  );
  return result;
}

async function atualizarFaturamento(id, dados) {
  const { cliente_id, descricao, valor, data_emissao, vencimento, status } = dados;
  const [result] = await db.query(
    `UPDATE faturamentos
        SET cliente_id = ?, descricao = ?, valor = ?, data_emissao = ?, vencimento = ?, status = ?
      WHERE id = ?`,
    [cliente_id, descricao, valor, data_emissao, vencimento, status, id]
  );
  return result;
}

async function deletarFaturamento(id) {
  const [result] = await db.query('DELETE FROM faturamentos WHERE id = ?', [id]);
  return result;
}

module.exports = {
  listarFaturamentos,
  buscarFaturamentoPorId,
  criarFaturamento,
  atualizarFaturamento,
  deletarFaturamento
};
