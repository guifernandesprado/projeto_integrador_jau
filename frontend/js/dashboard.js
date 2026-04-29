/* ============================================================
   CobreJá - dashboard.js
   
   Preenche o dashboard com dados reais da API:
   - Cards de métricas: GET /api/dashboard/resumo
   - Tabela "Cobranças Vencidas": GET /api/debitos (filtrando por ATRASADO)
   - Tabela "Próximos Vencimentos": GET /api/debitos (filtrando por PENDENTE)
   - Telefones para WhatsApp: GET /api/clientes
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
    // Carrega cards e tabelas em paralelo
    carregarMetricas();
    carregarTabelas();
});


/**
 * Carrega os 4 cards de métricas no topo da página.
 * Endpoint: GET /api/dashboard/resumo
 */
async function carregarMetricas() {
    try {
        const data = await apiGet('/dashboard/resumo');

        // Atualiza cada card pelo seu ID
        setText('total-clientes', data.total_clientes || 0);
        setText('total-pendentes', data.total_pendentes || 0);
        setText('total-atrasados', data.total_atrasados || 0);
        setText('valor-pendente', formatarMoeda(data.valor_pendente));
        setText('valor-atrasado', formatarMoeda(data.valor_atrasado));
        setText('valor-pago', formatarMoeda(data.valor_pago));
    } catch (err) {
        console.error('Erro ao carregar métricas:', err);
    }
}


/**
 * Carrega as duas tabelas (Vencidas + Próximos Vencimentos).
 * Endpoint: GET /api/debitos e GET /api/clientes
 */
async function carregarTabelas() {
    const tbodyVencidos = document.getElementById('dashboard-vencidos-tbody');
    const tbodyProximos = document.getElementById('dashboard-proximos-tbody');
    if (!tbodyVencidos || !tbodyProximos) return;

    try {
        // Busca débitos e clientes em paralelo
        const [debitos, clientes] = await Promise.all([
            apiGet('/debitos'),
            apiGet('/clientes')
        ]);

        // Cria um mapa de clientes para encontrar o telefone rapidamente
        const mapaClientes = {};
        for (const c of clientes) mapaClientes[c.id] = c;

        // Filtra os débitos por status
        const vencidos = debitos.filter(d => d.status_calculado === 'ATRASADO');
        const proximos = debitos.filter(d => d.status_calculado === 'PENDENTE');

        // Renderiza tabela de vencidos
        renderizarTabelaVencidos(tbodyVencidos, vencidos, mapaClientes);
        // Renderiza tabela de próximos vencimentos
        renderizarTabelaProximos(tbodyProximos, proximos);

    } catch (err) {
        console.error('Erro ao carregar tabelas:', err);
        tbodyVencidos.innerHTML = `<tr><td colspan="5" class="tabela__vazio">Erro ao carregar dados: ${err.message}</td></tr>`;
        tbodyProximos.innerHTML = `<tr><td colspan="5" class="tabela__vazio">Erro ao carregar dados: ${err.message}</td></tr>`;
    }
}


/**
 * Renderiza a tabela de cobranças vencidas (com botão WhatsApp).
 */
function renderizarTabelaVencidos(tbody, debitos, mapaClientes) {
    if (!debitos || debitos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="tabela__vazio">Nenhuma cobrança vencida. Tudo em dia!</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    for (const d of debitos) {
        const cliente = mapaClientes[d.cliente_id] || {};
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(d.nome_cliente)}</td>
            <td>${escapeHtml(d.descricao_debito)}</td>
            <td class="tabela__valor tabela__valor--perigo">${formatarMoeda(d.valor_debito)}</td>
            <td>${formatarData(d.vencimento_debito)}</td>
            <td>${gerarBotaoWhatsApp(d, cliente.telefone_cliente)}</td>
        `;
        tbody.appendChild(tr);
    }
}


/**
 * Renderiza a tabela de próximos vencimentos (somente status badge).
 */
function renderizarTabelaProximos(tbody, debitos) {
    if (!debitos || debitos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="tabela__vazio">Nenhum débito pendente.</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    // Ordena por data de vencimento mais próxima
    debitos.sort((a, b) => new Date(a.vencimento_debito) - new Date(b.vencimento_debito));

    for (const d of debitos) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(d.nome_cliente)}</td>
            <td>${escapeHtml(d.descricao_debito)}</td>
            <td class="tabela__valor tabela__valor--normal">${formatarMoeda(d.valor_debito)}</td>
            <td>${formatarData(d.vencimento_debito)}</td>
            <td><span class="badge badge--pendente">Pendente</span></td>
        `;
        tbody.appendChild(tr);
    }
}


/* ============================================================
   FUNÇÕES UTILITÁRIAS (compartilhadas entre páginas)
   ============================================================ */

function setText(id, valor) {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
}

function formatarMoeda(valor) {
    const num = Number(valor || 0);
    return 'R$ ' + num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatarData(data) {
    if (!data) return '-';
    const str = String(data).slice(0, 10); // YYYY-MM-DD
    const partes = str.split('-');
    if (partes.length !== 3) return str;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function escapeHtml(texto) {
    if (texto === null || texto === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(texto);
    return div.innerHTML;
}


/**
 * Gera o botão "Cobrar" com link do WhatsApp e mensagem
 * pré-preenchida com os dados do débito.
 */
function gerarBotaoWhatsApp(debito, telefone) {
    const tel = String(telefone || '').replace(/\D/g, '');
    if (!tel) {
        return '<span style="color: #9ca3af; font-size: 12px;">Sem telefone</span>';
    }

    // Se o telefone já tem 13 dígitos (com 55), usa direto. Senão, adiciona 55.
    const numWhats = tel.length === 13 ? tel : `55${tel}`;

    const mensagem = encodeURIComponent(
        `Olá ${debito.nome_cliente}! 😊\n\n` +
        `Passando para lembrar sobre o débito referente a: ${debito.descricao_debito}\n` +
        `Valor: ${formatarMoeda(debito.valor_debito)}\n` +
        `Vencimento: ${formatarData(debito.vencimento_debito)}\n\n` +
        `Por favor, entre em contato para regularização.\n` +
        `Obrigado! — JPisa Distribuidora`
    );

    return `
        <a href="https://wa.me/${numWhats}?text=${mensagem}" 
           target="_blank" 
           class="btn-whatsapp"
           rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Cobrar
        </a>
    `;
}
