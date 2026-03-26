document.addEventListener('DOMContentLoaded', async () => {
  const form = document.querySelector('.form-container');
  const select = document.getElementById('cliente_debito');
  if (!form || !select) return;
  try {
    const clientes = await apiGet('/clientes');
    select.innerHTML = '<option value="">Selecione</option>' + clientes.map(c => `<option value="${c.id}">${c.nome_cliente}</option>`).join('');
  } catch (err) {
    alert(err.message);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      cliente_debito: document.getElementById('cliente_debito').value,
      valor_debito: document.getElementById('valor_debito').value,
      vencimento_debito: document.getElementById('vencimento_debito').value,
      criacao_debito: document.getElementById('criacao_debito').value,
      descricao_debito: document.getElementById('descricao_debito').value.trim()
    };
    try {
      await apiSend('/debitos', 'POST', payload);
      alert('Débito registrado com sucesso.');
      window.location.href = 'contas-receber.html';
    } catch (err) {
      alert(err.message);
    }
  });
});
