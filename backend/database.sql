CREATE DATABASE IF NOT EXISTS projeto_integrador CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE projeto_integrador;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  usuario VARCHAR(80) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

INSERT INTO usuarios (nome, usuario, senha_hash)
VALUES ('Administrador', 'admin', '$2a$10$T46vz5Oa0wmtJ/GkmMEUPe3HfF.AaZm1p4QJ8mzeCh7lAs69tCGze')
ON DUPLICATE KEY UPDATE nome = VALUES(nome), senha_hash = VALUES(senha_hash);

-- usuário padrão: admin
-- senha padrão: 123456
