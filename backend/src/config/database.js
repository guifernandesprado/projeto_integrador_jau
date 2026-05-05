const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'projeto_integrador';

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true
});

async function ensureDatabase() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`USE \`${DB_NAME}\``);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(120) NOT NULL,
        usuario VARCHAR(80) NOT NULL UNIQUE,
        senha_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome_cliente VARCHAR(150) NOT NULL,
        cpf_cnpj VARCHAR(20) NOT NULL UNIQUE,
        telefone_cliente VARCHAR(25) NULL,
        email_cliente VARCHAR(150) NULL,
        endereco_cliente VARCHAR(255) NULL,
        obs_cliente TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS debitos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cliente_id INT NOT NULL,
        valor_debito DECIMAL(10,2) NOT NULL,
        vencimento_debito DATE NOT NULL,
        criacao_debito DATE NOT NULL,
        descricao_debito TEXT NOT NULL,
        status ENUM('PENDENTE','PAGO') NOT NULL DEFAULT 'PENDENTE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_debitos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      INSERT INTO usuarios (nome, usuario, senha_hash)
      VALUES ('Administrador', 'admin', '$2a$10$T46vz5Oa0wmtJ/GkmMEUPe3HfF.AaZm1p4QJ8mzeCh7lAs69tCGze')
      ON DUPLICATE KEY UPDATE nome = VALUES(nome), senha_hash = VALUES(senha_hash);
    `);
  } finally {
    await connection.end();
  }
}

module.exports = { pool, ensureDatabase, DB_NAME };
