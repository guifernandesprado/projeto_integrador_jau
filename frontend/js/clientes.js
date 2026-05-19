/* ============================================================
   CobreJá - clientes.js
   
   Busca a lista de clientes via API (GET /api/clientes) e
   renderiza dinamicamente os cards no container #clientes-grid.
   
   Também fornece a função excluirCliente() (acessada pelo
   menu de 3 pontinhos de cada card), que envia uma requisição
   DELETE ao backend e remove o card da tela.
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('clientes-grid');
    if (!container) return;

    try {
        // Busca a lista de clientes na API
        const clientes = await apiGet('/clientes');

        // Limpa o container (remove o "Carregando...")
        container.innerHTML = '';

        // Caso não haja clientes cadastrados
        if (!clientes || clientes.length === 0) {
            container.innerHTML = '<p class="clientes-grid__vazio">Nenhum cliente cadastrado ainda. Clique em "+ Novo Cliente" para começar.</p>';
            return;
        }

        // Gera um card para cada cliente retornado pela API
        for (const cliente of clientes) {
            container.appendChild(criarCardCliente(cliente));
        }

        // Adiciona filtro de busca por nome/telefone/CPF
        configurarBusca();

    } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        container.innerHTML = `<p class="clientes-grid__erro">Erro ao carregar clientes: ${err.message}</p>`;
    }
});


/**
 * Cria o elemento HTML de um card de cliente com base nos dados
 * recebidos da API.
 *
 * @param {Object} cliente - Dados do cliente vindos do backend
 * @returns {HTMLElement} Elemento <div> com o card pronto
 */
function criarCardCliente(cliente) {
    const card = document.createElement('div');
    card.className = 'cliente-card';
    card.dataset.id = cliente.id;

    // Pega as iniciais do nome para o avatar (ex: "Maria Silva" → "MS")
    const iniciais = gerarIniciais(cliente.nome_cliente);

    // Trata campos que podem vir vazios da API
    const telefone = formatarTelefone(cliente.telefone_cliente);
    const endereco = cliente.endereco_cliente || 'Endereço não informado';
    const cpfCnpj = cliente.cpf_cnpj || '-';

    // Monta o HTML interno do card
    card.innerHTML = `
        <div class="cliente-card__avatar">${iniciais}</div>
        <div class="cliente-card__info">
            <h3 class="cliente-card__nome">${escapeHtml(cliente.nome_cliente)}</h3>
            <p class="cliente-card__detalhe">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/></svg>
                ${telefone}
            </p>
            <p class="cliente-card__detalhe">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${escapeHtml(endereco)}
            </p>
            <p class="cliente-card__detalhe">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h0M2 9.5h20"/></svg>
                ${escapeHtml(cpfCnpj)}
            </p>
        </div>
        <div class="cliente-card__valor">
            <span class="cliente-card__valor-label">Deve</span>
            <span class="cliente-card__valor-numero cliente-card__valor-numero--ok">R$ 0,00</span>
            <span class="cliente-card__valor-sub">0 débito(s)</span>
        </div>
        <div class="cliente-card__acoes">
            <a href="editar-cliente.html?id=${cliente.id}" class="btn-editar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Editar
            </a>
            <div class="menu-opcoes">
                <button class="menu-opcoes__btn" onclick="toggleMenuOpcoes(this)" aria-label="Mais opções">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                    </svg>
                </button>
                <div class="menu-opcoes__dropdown">
                    <button class="menu-opcoes__item menu-opcoes__item--excluir" onclick="excluirCliente(${cliente.id}, this)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        Excluir cliente
                    </button>
                </div>
            </div>
        </div>
    `;

    return card;
}


/**
 * Gera as iniciais do nome para o avatar.
 * Ex: "Maria Silva" → "MS"
 *     "Ana" → "A"
 */
function gerarIniciais(nome) {
    if (!nome) return '?';
    return nome
        .trim()
        .split(/\s+/)
        .map(parte => parte[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
}


/**
 * Formata o telefone para exibição: (XX) XXXXX-XXXX
 * Aceita números com ou sem formatação. Se não for possível
 * formatar, retorna o valor original ou um traço.
 */
function formatarTelefone(tel) {
    if (!tel) return '-';
    // Remove tudo que não é número
    const limpo = String(tel).replace(/\D/g, '');
    if (limpo.length === 11) {
        return `(${limpo.substring(0, 2)}) ${limpo.substring(2, 7)}-${limpo.substring(7)}`;
    }
    if (limpo.length === 10) {
        return `(${limpo.substring(0, 2)}) ${limpo.substring(2, 6)}-${limpo.substring(6)}`;
    }
    return tel;
}


/**
 * Escapa caracteres HTML para evitar problemas se o nome
 * do cliente vier com símbolos especiais (<, >, &, etc).
 */
function escapeHtml(texto) {
    if (texto === null || texto === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(texto);
    return div.innerHTML;
}


/**
 * Configura o filtro de busca: ao digitar no campo de busca,
 * mostra apenas os cards cujo nome, telefone ou CPF/CNPJ
 * contenham o texto digitado.
 */
function configurarBusca() {
    const inputBusca = document.getElementById('busca_cliente');
    if (!inputBusca) return;

    inputBusca.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.cliente-card');

        cards.forEach(card => {
            const texto = card.textContent.toLowerCase();
            card.style.display = texto.includes(termo) ? '' : 'none';
        });
    });
}


/**
 * Excluir cliente — chamada pelo menu de 3 pontinhos.
 *
 * Envia uma requisição DELETE ao backend para remover o
 * cliente e todos os débitos vinculados a ele. Em seguida,
 * remove o card da tela com uma animação de saída.
 *
 * NOTA: O backend ainda precisa implementar a rota
 *       DELETE /api/clientes/:id para que a exclusão
 *       persista no banco. Atualmente clienteRoutes.js
 *       só tem GET, POST e PUT.
 *
 * @param {number} clienteId - ID do cliente a excluir
 * @param {HTMLElement} botao - Botão que disparou a ação
 */
async function excluirCliente(clienteId, botao) {
    const card = botao.closest('.cliente-card');
    const nomeCliente = card.querySelector('.cliente-card__nome').textContent;

    const confirmacao = confirm(
        `Tem certeza que deseja excluir o cliente "${nomeCliente}"?\n\n` +
        'ATENÇÃO: Esta ação irá remover:\n' +
        '• Todos os dados cadastrais do cliente\n' +
        '• Todos os débitos vinculados\n' +
        '• Todo o histórico de cobranças\n\n' +
        'Esta ação não pode ser desfeita!'
    );

    if (!confirmacao) return;

    try {
        // Envia o DELETE para o backend
        await apiSend(`/clientes/${clienteId}`, 'DELETE', {});

        // Animação de saída
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateX(30px)';

        setTimeout(() => {
            card.remove();
            alert(`Cliente "${nomeCliente}" excluído com sucesso!`);
        }, 300);

    } catch (err) {
        console.error('Erro ao excluir cliente:', err);
        alert(`Erro ao excluir cliente: ${err.message}`);
    }
}
