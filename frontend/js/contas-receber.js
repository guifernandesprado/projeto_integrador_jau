/* ============================================================
   CobreJá - contas-receber.js
   
   Lista todos os débitos do sistema com:
   - Tabela completa de débitos com badges de status
   - Botão de cobrança via WhatsApp para cada débito não pago
   - Filtros por status (todos, pendentes, vencidos, pagos)
   - Contadores nos botões de filtro
   - Resumo financeiro no rodapé
   
   Endpoints utilizados:
   - GET /api/debitos
   - GET /api/clientes
   ============================================================ */

// Variável global para armazenar todos os débitos carregados
let debitosCarregados = [];
let mapaClientesCarregado = {};

document.addEventListener('DOMContentLoaded', async () => {
    const tbody = document.getElementById('contas-receber-tbody');
    if (!tbody) return;

    try {
        // Busca débitos e clientes em paralelo
        const [debitos, clientes] = await Promise.all([
            apiGet('/debitos'),
            apiGet('/clientes')
        ]);

        debitosCarregados = debitos;
        mapaClientesCarregado = {};
        for (const c of clientes) mapaClientesCarregado[c.id] = c;

        // Renderiza inicialmente com todos os débitos
        renderizarTabela(debitosCarregados);
        atualizarContadores(debitosCarregados);
        atualizarResumoFinanceiro(debitosCarregados);

        // Configura os filtros
        configurarFiltros();

    } catch (err) {
        console.error('Erro ao carregar contas a receber:', err);
        tbody.innerHTML = `<tr><td colspan="7" class="tabela__vazio">Erro ao carregar débitos: ${err.message}</td></tr>`;
    }
});


/**
 * Renderiza as linhas da tabela com base na lista fornecida.
 * @param {Array} debitos - Lista de débitos a exibir
 */
function renderizarTabela(debitos) {
    const tbody = document.getElementById('contas-receber-tbody');
    if (!tbody) return;

    if (!debitos || debitos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="tabela__vazio">Nenhum débito encontrado.</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    for (const d of debitos) {
        const cliente = mapaClientesCarregado[d.cliente_id] || {};
        const tr = criarLinhaDebito(d, cliente);
        tbody.appendChild(tr);
    }
}


/**
 * Cria uma <tr> para um débito, com badge de status e ações.
 */
function criarLinhaDebito(debito, cliente) {
    const tr = document.createElement('tr');
    tr.dataset.status = debito.status_calculado;

    // Define a classe e o texto do badge conforme o status
    let badgeClass, badgeText, valorClass;
    switch (debito.status_calculado) {
        case 'PAGO':
            badgeClass = 'badge--pago';
            badgeText = 'Pago';
            valorClass = 'tabela__valor--normal';
            break;
        case 'ATRASADO':
            badgeClass = 'badge--vencido';
            badgeText = 'Vencido';
            valorClass = 'tabela__valor--perigo';
            break;
        default:
            badgeClass = 'badge--pendente';
            badgeText = 'Pendente';
            valorClass = 'tabela__valor--normal';
    }

    // Coluna de ações: WhatsApp para não pagos, "Quitado" para pagos
    let acoes;
    if (debito.status_calculado === 'PAGO') {
        acoes = '<span class="texto-quitado">✓ Quitado</span>';
    } else {
        acoes = gerarBotaoWhatsApp(debito, cliente.telefone_cliente);
    }

    tr.innerHTML = `
        <td><strong>${escapeHtml(debito.nome_cliente)}</strong></td>
        <td>${escapeHtml(debito.descricao_debito)}</td>
        <td class="tabela__valor ${valorClass}">${formatarMoeda(debito.valor_debito)}</td>
        <td>${formatarData(debito.criacao_debito)}</td>
        <td>${formatarData(debito.vencimento_debito)}</td>
        <td><span class="badge ${badgeClass}">${badgeText}</span></td>
        <td><div class="tabela__acoes">${acoes}</div></td>
    `;

    return tr;
}


/**
 * Atualiza os contadores nos botões de filtro.
 */
function atualizarContadores(debitos) {
    const total = debitos.length;
    const pendentes = debitos.filter(d => d.status_calculado === 'PENDENTE').length;
    const vencidos = debitos.filter(d => d.status_calculado === 'ATRASADO').length;
    const pagos = debitos.filter(d => d.status_calculado === 'PAGO').length;

    setText('contador-todos', total);
    setText('contador-pendentes', pendentes);
    setText('contador-vencidos', vencidos);
    setText('contador-pagos', pagos);
}


/**
 * Calcula e exibe os totais no resumo financeiro do rodapé.
 */
function atualizarResumoFinanceiro(debitos) {
    let totalPendente = 0;
    let totalVencido = 0;
    let totalPago = 0;

    for (const d of debitos) {
        const valor = Number(d.valor_debito || 0);
        if (d.status_calculado === 'PAGO') totalPago += valor;
        else if (d.status_calculado === 'ATRASADO') totalVencido += valor;
        else totalPendente += valor;
    }

    const totalGeral = totalPendente + totalVencido + totalPago;

    setText('resumo-pendente', formatarMoeda(totalPendente));
    setText('resumo-vencido', formatarMoeda(totalVencido));
    setText('resumo-pago', formatarMoeda(totalPago));
    setText('resumo-total', formatarMoeda(totalGeral));
}


/**
 * Configura os botões de filtro para mostrar débitos por status.
 */
function configurarFiltros() {
    const botoes = document.querySelectorAll('.filtro-btn');

    botoes.forEach(btn => {
        btn.addEventListener('click', () => {
            const filtro = btn.dataset.filtro;

            // Filtra os débitos conforme o botão clicado
            let lista;
            switch (filtro) {
                case 'pendente':
                    lista = debitosCarregados.filter(d => d.status_calculado === 'PENDENTE');
                    break;
                case 'vencido':
                    lista = debitosCarregados.filter(d => d.status_calculado === 'ATRASADO');
                    break;
                case 'pago':
                    lista = debitosCarregados.filter(d => d.status_calculado === 'PAGO');
                    break;
                default:
                    lista = debitosCarregados;
            }

            renderizarTabela(lista);

            // Marca o botão ativo visualmente
            botoes.forEach(b => b.style.outline = '');
            btn.style.outline = '2px solid var(--cor-primaria)';
        });
    });
}


/* ============================================================
   UTILITÁRIOS
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
    const str = String(data).slice(0, 10);
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

function gerarBotaoWhatsApp(debito, telefone) {
    const tel = String(telefone || '').replace(/\D/g, '');
    if (!tel) {
        return '<span style="color: #9ca3af; font-size: 12px;">Sem telefone</span>';
    }
    const numWhats = tel.length === 13 ? tel : `55${tel}`;

    const mensagem = encodeURIComponent(
        `Olá ${debito.nome_cliente}! 😊\n\n` +
        `Passando para lembrar sobre o débito:\n` +
        `📋 ${debito.descricao_debito}\n` +
        `💰 Valor: ${formatarMoeda(debito.valor_debito)}\n` +
        `📅 Vencimento: ${formatarData(debito.vencimento_debito)}\n\n` +
        `Por favor, entre em contato para regularização.\n` +
        `Obrigado! — JPisa Distribuidora`
    );

    return `
        <a href="https://wa.me/${numWhats}?text=${mensagem}" 
           target="_blank" 
           class="btn-whatsapp"
           rel="noopener noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Cobrar
        </a>
    `;
}
