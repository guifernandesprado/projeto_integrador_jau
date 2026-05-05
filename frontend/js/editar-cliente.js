document.addEventListener('DOMContentLoaded', async () => {
  const form = document.querySelector('.form-container');
  if (!form || !document.getElementById('cliente_id')) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || document.getElementById('cliente_id').value;

  try {
    const c = await apiGet(`/clientes/${id}`);
    document.getElementById('cliente_id').value = c.id;
    document.getElementById('nome_cliente').value = c.nome_cliente || '';
    document.getElementById('cpf_cnpj').value = c.cpf_cnpj || '';
    document.getElementById('telefone_cliente').value = c.telefone_cliente || '';
    document.getElementById('email_cliente').value = c.email_cliente || '';
    document.getElementById('endereco_cliente').value = c.endereco_cliente || '';
    document.getElementById('obs_cliente').value = c.obs_cliente || '';
  } catch (err) {
    alert(err.message);
  }

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
      await apiSend(`/clientes/${id}`, 'PUT', payload);
      alert('Cliente atualizado com sucesso.');
      window.location.href = 'clientes.html';
    } catch (err) {
      alert(err.message);
    }
  });
});
