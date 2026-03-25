CREATE DATABASE IF NOT EXISTS projeto_integrador;
USE projeto_integrador;

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf_cnpj VARCHAR(20) UNIQUE,
    email VARCHAR(150),
    telefone VARCHAR(20),
    endereco VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE faturamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_emissao DATE NOT NULL,
    vencimento DATE NOT NULL,
    status ENUM('PENDENTE', 'PAGO', 'ATRASADO') DEFAULT 'PENDENTE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_faturamentos_cliente
        FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        ON DELETE CASCADE
);

CREATE TABLE contas_receber (
    id INT AUTO_INCREMENT PRIMARY KEY,
    faturamento_id INT NOT NULL,
    valor_original DECIMAL(10,2) NOT NULL,
    valor_recebido DECIMAL(10,2) DEFAULT 0.00,
    saldo DECIMAL(10,2) NOT NULL,
    vencimento DATE NOT NULL,
    status ENUM('ABERTO', 'PARCIAL', 'QUITADO', 'ATRASADO') DEFAULT 'ABERTO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contas_faturamento
        FOREIGN KEY (faturamento_id) REFERENCES faturamentos(id)
        ON DELETE CASCADE
);

CREATE TABLE recebimentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conta_receber_id INT NOT NULL,
    data_recebimento DATE NOT NULL,
    valor_pago DECIMAL(10,2) NOT NULL,
    forma_pagamento ENUM('DINHEIRO', 'PIX', 'CARTAO', 'BOLETO', 'TRANSFERENCIA') NOT NULL,
    observacao VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recebimentos_conta
        FOREIGN KEY (conta_receber_id) REFERENCES contas_receber(id)
        ON DELETE CASCADE
);