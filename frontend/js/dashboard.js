document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await apiGet('/dashboard/resumo');
    const ids = {
      total_clientes: ['total-clientes','clientes-total'],
      total_pendentes: ['total-pendentes','pendentes-total'],
      valor_pendente: ['valor-pendente','pendente-valor'],
      valor_pago: ['valor-pago','recebido-valor'],
      total_atrasados: ['total-atrasados','atrasados-total'],
      valor_atrasado: ['valor-atrasado','atrasado-valor']
    };
    for (const [chave, arr] of Object.entries(ids)) {
      for (const id of arr) {
        const el = document.getElementById(id);
        if (el) el.textContent = chave.includes('valor') ? `R$ ${Number(data[chave] || 0).toFixed(2)}` : data[chave] || 0;
      }
    }
  } catch (err) {
    console.error(err);
  }
});
