const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./src/routes/authRoutes');
const clienteRoutes = require('./src/routes/clienteRoutes');
const debitoRoutes = require('./src/routes/debitoRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    mensagem: 'API Projeto Integrador funcionando com sucesso',
    frontend: 'Abra o arquivo index.html da pasta raiz do projeto ou sirva os arquivos front-end em um servidor estático.'
  });
});

app.get('/api/health', (req, res) => res.json({ ok: true, mensagem: 'API operacional' }));
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/debitos', debitoRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use('/front', express.static(path.join(__dirname, '..')));

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

module.exports = app;
