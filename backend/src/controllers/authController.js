const bcrypt = require('bcryptjs');
const authModel = require('../models/authModel');

async function login(req, res) {
  try {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) {
      return res.status(400).json({ erro: 'Usuário e senha são obrigatórios.' });
    }

    const user = await authModel.buscarPorUsuario(usuario);
    if (!user) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const ok = await bcrypt.compare(senha, user.senha_hash);
    if (!ok) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    return res.json({
      mensagem: 'Login realizado com sucesso.',
      usuario: { id: user.id, nome: user.nome, usuario: user.usuario }
    });
  } catch (error) {
    return res.status(500).json({ erro: 'Falha ao autenticar.', detalhe: error.message });
  }
}

module.exports = { login };
