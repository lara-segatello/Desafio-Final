
let clientes = localStorage.getItem('clientes') ? JSON.parse(localStorage.getItem('clientes')) : [];
let livroSelecionadoCache = null; // Armazena o livro clicado em tempo de execução


function fazerLogin() {
    const nomeInput = document.getElementById('NomeCompleto').value.trim();
    const cpfInput = document.getElementById('CPF').value.trim();
    const emailInput = document.getElementById('Email').value.trim();
    
    if (!nomeInput || !emailInput) {
        alert("Por favor, insira ao menos o Nome e o E-mail para prosseguir.");
        return;
    }

    // Criação do novo objeto de leitura em conformidade com o briefing
    const novoCliente = {
        id: Date.now(),
        nome: nomeInput,
        cpf: cpfInput || "Não informado",
        email: emailInput
    };

    // Insere e sincroniza com o banco local
    clientes.push(novoCliente);
    localStorage.setItem('clientes', JSON.stringify(clientes));

    // Limpa os campos do formulário para o próximo input
    document.getElementById('NomeCompleto').value = '';
    document.getElementById('CPF').value = '';
    document.getElementById('Email').value = '';

    // Atualiza os componentes dependentes na tela instantaneamente
    renderizarClientes();
    atualizarSelectClientes();
    alert(`Cliente "${novoCliente.nome}" cadastrado com sucesso!`);
}

function renderizarClientes() {
    const listaUI = document.getElementById('lista-clientes');
    if (!listaUI) return;

    listaUI.innerHTML = '';
    clientes.forEach(cliente => {
        const li = document.createElement('li');
        li.textContent = `${cliente.nome} (${cliente.cpf})`;
        listaUI.appendChild(li);
    });
}


const btnBuscar = document.getElementById("btn-buscar");
const inputBusca = document.getElementById('input-busca');
const resultadoBusca = document.getElementById('resultado-busca');

if (btnBuscar) {
    btnBuscar.addEventListener('click', buscarLivro);
}

async function buscarLivro() {
    const termoBusca = inputBusca.value.trim();

    if (!termoBusca) {
        alert("Por favor, digite o nome de um livro!");
        return;
    }

    // Cria um elemento temporário de carregamento sem limpar o histórico de baixo
    const itemCarregando = document.createElement('p');
    itemCarregando.id = "feedback-carregando";
    itemCarregando.style = "color: #718096; font-style: italic; font-size: 0.9rem;";
    itemCarregando.textContent = "Buscando livro...";
    resultadoBusca.prepend(itemCarregando);

    try {
        const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(termoBusca)}`;
        const resposta = await fetch(url);
        const dados = await resposta.json();

        // Remove o elemento de feedback de carregamento
        const loader = document.getElementById('feedback-carregando');
        if (loader) loader.remove();

        if (dados.docs && dados.docs.length > 0) {
            const primeiroLivro = dados.docs[0];
            adicionarLivroAoPainel(primeiroLivro);
            inputBusca.value = ''; // Limpa a barra de pesquisa
        } else {
            alert("Nenhum livro encontrado com esse nome.");
        }
    } catch (erro) {
        console.error("Erro ao buscar livro:", erro);
        const loader = document.getElementById('feedback-carregando');
        if (loader) loader.remove();
        alert("Ocorreu um erro ao buscar o livro. Tente novamente.");
    }
}

// Adiciona um card novo ao topo da lista, mantendo os anteriores na tela
function adicionarLivroAoPainel(livro) {
    const titulo = livro.title;
    const autor = livro.author_name ? livro.author_name[0] : "Autor Desconhecido";
    const urlCapa = livro.cover_i
        ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg`
        : 'https://via.placeholder.com/150x200?text=Sem+Capa';

    const divCard = document.createElement('div');
    divCard.className = 'card-livro';
    
    // Escapa aspas simples das strings para evitar quebra de sintaxe no HTML
    const tituloEscapado = titulo.replace(/'/g, "\\'");
    const autorEscapado = autor.replace(/'/g, "\\'");

    divCard.innerHTML = `
        <img src="${urlCapa}" alt="Capa">
        <div class="card-livro-info">
            <h3>${titulo}</h3>
            <p><strong>Autor:</strong> ${autor}</p>
            <button type="button" class="btn-selecionar-livro" onclick="selecionarParaEmprestimo(this, '${tituloEscapado}', '${autorEscapado}', '${urlCapa}')">
                Selecionar para Empréstimo
            </button>
        </div>
    `;

    // Insere no topo da lista de exibição do Quadro 2
    resultadoBusca.prepend(divCard);
}

function selecionarParaEmprestimo(botao, titulo, autor, urlCapa) {
    // Remove o estado visual "selecionado" de qualquer outro botão do painel
    const botoes = document.querySelectorAll('.btn-selecionar-livro');
    botoes.forEach(b => {
        b.classList.remove('selecionado');
        b.textContent = "Selecionar para Empréstimo";
    });

    // Destaca visualmente o card atualmente ativo
    botao.classList.add('selecionado');
    botao.textContent = "✓ Selecionar para Empréstimo";

    // Guarda os metadados do livro ativo em memória cache
    livroSelecionadoCache = { titulo, autor, urlCapa };
    
    // Atualiza a interface gráfica do Quadro 3
    document.getElementById('texto-feedback-livro').innerHTML = `Livro selecionado: <strong>"${titulo}"</strong>`;
}

function atualizarSelectClientes() {
    const select = document.getElementById('select-clientes');
    if (!select) return;

    select.innerHTML = '<option value="">-- Escolha um cliente --</option>';

    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.nome;
        option.textContent = cliente.nome;
        select.appendChild(option);
    });
}

const btnFinalizarSecao = document.querySelector('.btn-finalizarsecao');
if (btnFinalizarSecao) {
    btnFinalizarSecao.addEventListener('click', () => {
        const selectClientes = document.getElementById('select-clientes');
        const clienteSelecionado = selectClientes.value;

        if (!clienteSelecionado) {
            alert("Por favor, selecione um cliente antes de finalizar!");
            return;
        }

        if (!livroSelecionadoCache) {
            alert("Por favor, busque e selecione um livro no painel de acervo primeiro!");
            return;
        }

        // Regra de negócios das diretrizes: calcula o vencimento do prazo para 7 dias corridos
        let dataVencimento = new Date();
        dataVencimento.setDate(dataVencimento.getDate() + 7);

        const novoEmprestimo = {
            id: Date.now(),
            cliente: clienteSelecionado,
            titulo: livroSelecionadoCache.titulo,
            capa: livroSelecionadoCache.urlCapa,
            devolucao: dataVencimento.toLocaleDateString('pt-BR')
        };

        let listaEmprestimos = localStorage.getItem('emprestimos') ? JSON.parse(localStorage.getItem('emprestimos')) : [];
        listaEmprestimos.push(novoEmprestimo);
        localStorage.setItem('emprestimos', JSON.stringify(listaEmprestimos));

        alert(`Empréstimo de "${novoEmprestimo.titulo}" finalizado para ${clienteSelecionado}!`);
        
        // Reseta o cache de seleção e atualiza a lista de visualização
        livroSelecionadoCache = null;
        document.getElementById('texto-feedback-livro').textContent = "Nenhum livro pré-selecionado para empréstimo.";
        
        // Remove a marcação do botão selecionado no Quadro 2
        const botoes = document.querySelectorAll('.btn-selecionar-livro');
        botoes.forEach(b => {
            b.classList.remove('selecionado');
            b.textContent = "Selecionar para Empréstimo";
        });

        renderizarEmprestimosAtivos();
        selectClientes.value = "";
    });
}

function renderizarEmprestimosAtivos() {
    const containerEmprestimos = document.getElementById('registro-emprestimos-ativos');
    if (!containerEmprestimos) return;

    let listaEmprestimos = localStorage.getItem('emprestimos') ? JSON.parse(localStorage.getItem('emprestimos')) : [];
    containerEmprestimos.innerHTML = '';

    if (listaEmprestimos.length === 0) {
        containerEmprestimos.innerHTML = "<p style='color:#a0aec0; font-size:0.85rem; font-style:italic;'>Nenhum empréstimo ativo.</p>";
        return;
    }

    listaEmprestimos.forEach(emp => {
        const card = document.createElement('div');
        card.className = 'card-emprestimo-ativo';
        card.innerHTML = `
            <img src="${emp.capa}" alt="Capa">
            <div class="card-emprestimo-ativo-info">
                <h4>${emp.titulo}</h4>
                <p>Locatário: <strong>${emp.cliente}</strong></p>
                <p style="color: #2f855a; font-weight: bold;">Devolução: ${emp.devolucao}</p>
            </div>
        `;
        containerEmprestimos.appendChild(card);
    });
}

renderizarClientes();
atualizarSelectClientes();
renderizarEmprestimosAtivos();