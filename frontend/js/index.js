document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.login__form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const usuario = document.getElementById('usuario').value.trim();
      const senha = document.getElementById('senha').value.trim();
      const data = await apiSend('/auth/login', 'POST', { usuario, senha });
      localStorage.setItem('usuario_logado', JSON.stringify(data.usuario));
      alert('Login realizado com sucesso.');
      window.location.href = 'dashboard.html';
    } catch (err) {
      alert(err.message);
    }
  });
});
