const express = require('express');
const cors = require('cors');

//Aqui é a base de rotas dos clientes.
const clienteRoutes = require('./src/routes/clienteRoutes');
//Aqui comeca a base de rotas dos faturamentos.
const faturamentoRoutes = require('./src/routes/faturamentoRoutes');
//Aqui ficaram as contas a receber dos clientes.
const contaReceberRoutes = require('./src/routes/contaReceberRoutes');
//Aqui ficara as contas já pagas.
const recebimentoRoutes = require('./src/routes/recebimentoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API Projeto Integrador funcionando com sucesso'
  });
});

app.use('/clientes', clienteRoutes);
app.use('/faturamentos', faturamentoRoutes);
app.use('/contas-receber', contaReceberRoutes);
app.use('/recebimentos', recebimentoRoutes);

module.exports = app;