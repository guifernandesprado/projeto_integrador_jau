document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form-container');
  const nome = document.getElementById('nome_cliente');
  if (!form || !nome) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      nome_cliente: document.getElementById('nome_cliente').value.trim(),
      cpf_cnpj: document.getElementById('cpf_cnpj').value.trim(),
      telefone_cliente: document.getElementById('telefone_cliente').value.trim(),
      email_cliente: document.getElementById('email_cliente').value.trim(),
      endereco_cliente: document.getElementById('endereco_cliente').value.trim(),
      obs_cliente: document.getElementById('obs_cliente').value.trim()
    };
    try {
      await apiSend('/clientes', 'POST', payload);
      alert('Cliente cadastrado com sucesso.');
      window.location.href = 'clientes.html';
    } catch (err) {
      alert(err.message);
    }
  });
});
