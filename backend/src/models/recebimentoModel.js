const db = require('../config/database');

async function listarRecebimentos() {
  const [rows] = await db.query(
    `SELECT r.*, c.nome AS cliente_nome, f.descricao
       FROM recebimentos r
       INNER JOIN contas_receber cr ON cr.id = r.conta_receber_id
       INNER JOIN faturamentos f ON f.id = cr.faturamento_id
       INNER JOIN clientes c ON c.id = f.cliente_id
      ORDER BY r.id DESC`
  );
  return rows;
}

async function buscarRecebimentoPorId(id) {
  const [rows] = await db.query('SELECT * FROM recebimentos WHERE id = ?', [id]);
  return rows[0];
}

async function criarRecebimento(dados) {
  const { conta_receber_id, data_recebimento, valor_pago, forma_pagamento, observacao } = dados;
  const [result] = await db.query(
    `INSERT INTO recebimentos (conta_receber_id, data_recebimento, valor_pago, forma_pagamento, observacao)
     VALUES (?, ?, ?, ?, ?)`,
    [conta_receber_id, data_recebimento, valor_pago, forma_pagamento, observacao || null]
  );
  return result;
}

async function deletarRecebimento(id) {
  const [result] = await db.query('DELETE FROM recebimentos WHERE id = ?', [id]);
  return result;
}

module.exports = {
  listarRecebimentos,
  buscarRecebimentoPorId,
  criarRecebimento,
  deletarRecebimento
};
