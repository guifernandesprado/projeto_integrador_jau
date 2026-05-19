const { pool } = require('../config/database');

async function buscarPorUsuario(usuario) {
  const [rows] = await pool.query('SELECT id, nome, usuario, senha_hash FROM usuarios WHERE usuario = ? LIMIT 1', [usuario]);
  return rows[0] || null;
}

module.exports = { buscarPorUsuario };
