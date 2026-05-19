const db = require('../config/database');

async function listarContasReceber() {
  const [rows] = await db.query(
    `SELECT cr.*, f.descricao, c.nome AS cliente_nome
       FROM contas_receber cr
       INNER JOIN faturamentos f ON f.id = cr.faturamento_id
       INNER JOIN clientes c ON c.id = f.cliente_id
      ORDER BY cr.id DESC`
  );
  return rows;
}

async function buscarContaReceberPorId(id) {
  const [rows] = await db.query('SELECT * FROM contas_receber WHERE id = ?', [id]);
  return rows[0];
}

async function buscarContaPorFaturamentoId(faturamentoId) {
  const [rows] = await db.query('SELECT * FROM contas_receber WHERE faturamento_id = ?', [faturamentoId]);
  return rows[0];
}

async function criarContaReceber(dados) {
  const { faturamento_id, valor_original, valor_recebido, saldo, vencimento, status } = dados;
  const [result] = await db.query(
    `INSERT INTO contas_receber (faturamento_id, valor_original, valor_recebido, saldo, vencimento, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [faturamento_id, valor_original, valor_recebido ?? 0, saldo, vencimento, status || 'ABERTO']
  );
  return result;
}

async function atualizarContaReceber(id, dados) {
  const { valor_original, valor_recebido, saldo, vencimento, status } = dados;
  const [result] = await db.query(
    `UPDATE contas_receber
        SET valor_original = ?, valor_recebido = ?, saldo = ?, vencimento = ?, status = ?
      WHERE id = ?`,
    [valor_original, valor_recebido, saldo, vencimento, status, id]
  );
  return result;
}

async function deletarContaReceber(id) {
  const [result] = await db.query('DELETE FROM contas_receber WHERE id = ?', [id]);
  return result;
}

module.exports = {
  listarContasReceber,
  buscarContaReceberPorId,
  buscarContaPorFaturamentoId,
  criarContaReceber,
  atualizarContaReceber,
  deletarContaReceber
};
