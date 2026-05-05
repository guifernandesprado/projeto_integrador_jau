require('dotenv').config();
const app = require('./app');
const { ensureDatabase, DB_NAME } = require('./src/config/database');

const port = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await ensureDatabase();
    app.listen(port, () => {
      console.log(`Servidor backend rodando em http://localhost:${port}`);
      console.log(`Banco de dados validado: ${DB_NAME}`);
    });
  } catch (error) {
    console.error('Erro Real', error);
    process.exit(1);
  }
}

bootstrap();
