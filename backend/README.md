# Projeto Integrador

API em Node.js + Express + MySQL para cadastro de clientes, faturamento, contas a receber e recebimentos.

## Como rodar

1. Instale as dependências:
   npm install
2. Copie `.env.example` para `.env` e ajuste os dados do banco.
3. Importe o arquivo `database.sql` no MySQL.
4. Execute:
   npm run dev

## Rotas

- GET /clientes
- POST /clientes
- GET /faturamentos
- POST /faturamentos
- GET /contas-receber
- POST /contas-receber
- GET /recebimentos
- POST /recebimentos
