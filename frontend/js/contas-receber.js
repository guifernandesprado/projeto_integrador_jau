document.addEventListener('DOMContentLoaded', async () => {
  const tabela = document.querySelector('tbody');
  if (!tabela) return;
  try {
    const debitos = await apiGet('/debitos');
    tabela.innerHTML = '';
    for (const d of debitos) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${d.id}</td>
        <td>${d.nome_cliente}</td>
        <td>R$ ${Number(d.valor_debito).toFixed(2)}</td>
        <td>${String(d.vencimento_debito).slice(0,10)}</td>
        <td>${d.status_calculado}</td>
        <td>${d.descricao_debito}</td>
      `;
      tabela.appendChild(tr);
    }
  } catch (err) {
    console.error(err);
  }
});
