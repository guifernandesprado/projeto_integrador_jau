const db = require('../config/database');

async function listarClientes() {
  const [rows] = await db.query('SELECT * FROM clientes ORDER BY id DESC');
  return rows;
}

async function buscarClientePorId(id) {
  const [rows] = await db.query('SELECT * FROM clientes WHERE id = ?', [id]);
  return rows[0];
}

async function criarCliente(cliente) {
  const { nome, cpf_cnpj, email, telefone, endereco } = cliente;

  const [result] = await db.query(
    `INSERT INTO clientes (nome, cpf_cnpj, email, telefone, endereco)
     VALUES (?, ?, ?, ?, ?)`,
    [nome, cpf_cnpj, email, telefone, endereco]
  );

  return result;
}

async function atualizarCliente(id, cliente) {
  const { nome, cpf_cnpj, email, telefone, endereco } = cliente;

  const [result] = await db.query(
    `UPDATE clientes
     SET nome = ?, cpf_cnpj = ?, email = ?, telefone = ?, endereco = ?
     WHERE id = ?`,
    [nome, cpf_cnpj, email, telefone, endereco, id]
  );

  return result;
}

async function deletarCliente(id) {
  const [result] = await db.query('DELETE FROM clientes WHERE id = ?', [id]);
  return result;
}

module.exports = {
  listarClientes,
  buscarClientePorId,
  criarCliente,
  atualizarCliente,
  deletarCliente
};