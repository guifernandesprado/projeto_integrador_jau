document.addEventListener('DOMContentLoaded', async () => {
  const tabela = document.querySelector('tbody');
  if (!tabela) return;
  try {
    const clientes = await apiGet('/clientes');
    tabela.innerHTML = '';
    for (const c of clientes) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c.id}</td>
        <td>${c.nome_cliente}</td>
        <td>${c.cpf_cnpj}</td>
        <td>${c.telefone_cliente || '-'}</td>
        <td>${c.email_cliente || '-'}</td>
        <td><a href="editar-cliente.html?id=${c.id}" class="btn-editar">Editar</a></td>
      `;
      tabela.appendChild(tr);
    }
  } catch (err) {
    console.error(err);
  }
});
