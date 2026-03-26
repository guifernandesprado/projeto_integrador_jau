const { pool } = require('../config/database');

async function listar() {
  const [rows] = await pool.query(`
    SELECT d.*, c.nome_cliente,
           CASE
             WHEN d.status = 'PAGO' THEN 'PAGO'
             WHEN d.vencimento_debito < CURDATE() THEN 'ATRASADO'
             ELSE 'PENDENTE'
           END AS status_calculado
      FROM debitos d
      JOIN clientes c ON c.id = d.cliente_id
     ORDER BY d.id DESC
  `);
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query(`
    SELECT d.*, c.nome_cliente,
           CASE
             WHEN d.status = 'PAGO' THEN 'PAGO'
             WHEN d.vencimento_debito < CURDATE() THEN 'ATRASADO'
             ELSE 'PENDENTE'
           END AS status_calculado
      FROM debitos d
      JOIN clientes c ON c.id = d.cliente_id
     WHERE d.id = ?
     LIMIT 1
  `, [id]);
  return rows[0] || null;
}

function formatDateOnly(value) {
  if (!value) return null;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Date(value).toISOString().slice(0, 10);
}

async function criar(dados) {
  const { cliente_debito, valor_debito, vencimento_debito, criacao_debito, descricao_debito } = dados;
  const [result] = await pool.query(
    `INSERT INTO debitos (cliente_id, valor_debito, vencimento_debito, criacao_debito, descricao_debito, status)
     VALUES (?, ?, ?, ?, ?, 'PENDENTE')`,
    [
      Number(cliente_debito),
      Number(valor_debito),
      formatDateOnly(vencimento_debito),
      formatDateOnly(criacao_debito) || new Date().toISOString().slice(0, 10),
      descricao_debito
    ]
  );
  return result.insertId;
}

module.exports = { listar, buscarPorId, criar };
