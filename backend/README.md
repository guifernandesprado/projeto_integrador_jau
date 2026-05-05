# Projeto Integrador - versão funcional

## Visão geral
Este pacote foi reorganizado para ficar utilizável com o **front-end já pronto** e um **backend compatível**.

## Estrutura
- `index.html` → tela de login
- `dashboard.html` → painel resumido
- `clientes.html` → listagem de clientes
- `cadastro-cliente.html` → cadastro de clientes
- `editar-cliente.html` → edição de clientes
- `registro-debito.html` → cadastro de débitos
- `contas-receber.html` → listagem de débitos
- `js/` → scripts do front-end
- `backend/` → API Node.js + Express + MySQL

## O que foi corrigido
- ajuste da configuração do banco
- criação de `.env` válido
- seed do usuário administrador
- bootstrap automático do banco e das tabelas
- correção do hash da senha padrão
- validação básica de cadastro e débito
- README técnico do backend com instruções operacionais
- remoção de arquivos problemáticos e duplicados desnecessários

## Passo a passo para rodar

### 1. Banco de dados
Inicie seu MySQL no XAMPP ou equivalente.

### 2. Backend
Abra o terminal na pasta `backend` e execute:

```bash
npm install
npm run dev
```

Se tudo estiver correto, o terminal mostrará o backend ativo em `http://localhost:3000`.

### 3. Front-end
Abra a pasta do projeto no VS Code e rode o front-end com **Live Server**.

Uma forma simples:
- abrir `index.html`
- clicar em **Open with Live Server**

## Login padrão
- usuário: `admin`
- senha: `123456`

## Fluxo do sistema
1. fazer login
2. entrar no dashboard
3. cadastrar cliente
4. editar cliente, se necessário
5. registrar débito para um cliente
6. acompanhar débitos em contas a receber
7. visualizar os indicadores no dashboard

## Observações
- Se seu MySQL tiver senha, ajuste `backend/.env`.
- O front-end já aponta para `http://localhost:3000/api`.
- O arquivo `backend/database.sql` foi mantido para importação manual, embora o backend já crie a base automaticamente no startup.
