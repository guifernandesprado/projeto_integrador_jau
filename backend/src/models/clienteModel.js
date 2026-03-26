const { pool } = require('../config/database');

async function listar() {
  const [rows] = await pool.query('SELECT * FROM clientes ORDER BY id DESC');
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
  return rows[0] || null;
}

async function criar(dados) {
  const { nome_cliente, cpf_cnpj, telefone_cliente, email_cliente, endereco_cliente, obs_cliente } = dados;
  const [result] = await pool.query(
    `INSERT INTO clientes (nome_cliente, cpf_cnpj, telefone_cliente, email_cliente, endereco_cliente, obs_cliente)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nome_cliente, cpf_cnpj, telefone_cliente || null, email_cliente || null, endereco_cliente || null, obs_cliente || null]
  );
  return result.insertId;
}

async function atualizar(id, dados) {
  const { nome_cliente, cpf_cnpj, telefone_cliente, email_cliente, endereco_cliente, obs_cliente } = dados;
  await pool.query(
    `UPDATE clientes
        SET nome_cliente = ?, cpf_cnpj = ?, telefone_cliente = ?, email_cliente = ?, endereco_cliente = ?, obs_cliente = ?
      WHERE id = ?`,
    [nome_cliente, cpf_cnpj, telefone_cliente || null, email_cliente || null, endereco_cliente || null, obs_cliente || null, id]
  );
}

module.exports = { listar, buscarPorId, criar, atualizar };
