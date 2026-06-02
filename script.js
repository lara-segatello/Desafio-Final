// =========================================================================
// 1. GESTÃO DE PERSISTÊNCIA (localStorage)
// =========================================================================
const dadosSalvos = localStorage.getItem('clientes');
let clientes = dadosSalvos ? JSON.parse(dadosSalvos) : [];

// =========================================================================
// 2. SISTEMA DE LOGIN E DIRECIONAMENTO INTELIGENTE
// =========================================================================
function fazerLogin() {
    const nomeInput = document.getElementById('NomeCompleto').value.trim();
    const cpfInput = document.getElementById('CPF').value.trim();
    const emailInput = document.getElementById('Email').value.trim();
    
    if (!nomeInput || !emailInput) {
        alert("Por favor, insira ao menos o Nome e o E-mail para prosseguir.");
        return;
    }

    // Se digitado 'admin' (independente de maiúsculas/minúsculas) redireciona para empréstimos
    if (nomeInput.toLowerCase() === 'admin') {
        window.location.href = "emprestimo.html";
    } 
    // Qualquer outro nome salva no banco local e redireciona para a busca de livros
    else {
        const novoCliente = {
            id: Date.now(),
            nome: nomeInput,
            cpf: cpfInput || "Não informado",
            email: emailInput
        };

        clientes.push(novoCliente);
        localStorage.setItem('clientes', JSON.stringify(clientes));

        window.location.href = "busca.html";
    }
}

// Renderiza a lista se o elemento correspondente existir na página atual
function renderizarClientes() {
    const listaUI = document.getElementById('lista-clientes');
    if (!listaUI) return; 

    listaUI.innerHTML = '';
    clientes.forEach(cliente => {
        const li = document.createElement('li');
        li.textContent = `${cliente.nome} (${cliente.cpf}) (${cliente.email})`;
        listaUI.appendChild(li);
    });
}

// =========================================================================
// 3. BUSCA INTELIGENTE DE LIVROS (Async & API para busca.html)
// =========================================================================
const inputBusca = document.getElementById('input-busca');
const btnBuscar = document.getElementById("btn-buscar");
const resultadoBusca = document.getElementById('resultado-busca');

// Ativa o evento apenas se estiver na página correta (busca.html)
if (btnBuscar) {
    btnBuscar.addEventListener('click', buscarLivro);
}

async function buscarLivro() {
    // Correção: capturando o valor através do atributo '.value'
    const termoBusca = inputBusca.value.trim();

    if (!termoBusca) {
        alert("Por favor, digite o nome de um livro!");
        return;
    }

    resultadoBusca.innerHTML = "<p>Buscando livro...</p>";

    try {
        const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(termoBusca)}`;
        const resposta = await fetch(url);
        // Correção: alterado de 'reply' para 'resposta'
        const dados = await resposta.json();

        // Correção: corrigido erro de digitação de 'leght' para 'length'
        if (dados.docs && dados.docs.length > 0) {
            const primeiroLivro = dados.docs[0];
            mostrarLivroNaTela(primeiroLivro);
        } else {
            resultadoBusca.innerHTML = "<p>Nenhum livro encontrado com esse nome.</p>";
        }
    } catch (erro) {
        console.error("Erro ao buscar livro:", erro);
        resultadoBusca.innerHTML = "<p>Ocorreu um erro ao buscar o livro. Tente novamente.</p>";
    }
}

function mostrarLivroNaTela(livro) {
    const titulo = livro.title;
    const autor = livro.author_name ? livro.author_name[0] : "Autor Desconhecido";
    const urlCapa = livro.cover_i
        ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg`
        : 'https://via.placeholder.com/150x200?text=Sem+Capa';

    // Armazena em cache o livro pesquisado para ser recuperado na aba de empréstimo posterior
    localStorage.setItem('livro_selecionado', JSON.stringify({ titulo, autor, urlCapa }));

    resultadoBusca.innerHTML = `
        <div class="card-livro">
            <img src="${urlCapa}" alt="Capa do livro ${titulo}" style="max-width: 150px;">
            <div>
                <h3>${titulo}</h3>
                <p><strong>Autor:</strong> ${autor}</p>
                <br>
                <button type="button" class="btn-buscar" style="padding: 8px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;" onclick="selecionarParaEmprestimo('${titulo.replace(/'/g, "\\'")}', '${autor.replace(/'/g, "\\'")}')">
                    Selecionar para Empréstimo
                </button>
            </div>
        </div>
    `;
}

function selecionarParaEmprestimo(titulo, autor) {
    alert(`Livro "${titulo}" de ${autor} selecionado com sucesso!`);
}

// =========================================================================
// 4. CONTROLE DE EMPRÉSTIMOS E PERSISTÊNCIA (emprestimo.html)
// =========================================================================
function atualizarSelectClientes() {
    const select = document.getElementById('select-clientes');
    if (!select) return; // Proteção de escopo para evitar quebra de página

    select.innerHTML = '<option value="">-- Escolha um cliente --</option>';

    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.nome;
        option.textContent = cliente.nome;
        select.appendChild(option);
    });
}

// Lógica de encerramento de empréstimo disparada por clique de evento isolado
const btnFinalizarSecao = document.querySelector('.btn-finalizarsecao');
if (btnFinalizarSecao) {
    btnFinalizarSecao.addEventListener('click', () => {
        const selectClientes = document.getElementById('select-clientes');
        const clienteSelecionado = selectClientes.value;

        if (!clienteSelecionado) {
            alert("Por favor, selecione um cliente antes de finalizar!");
            return;
        }

        const livroDaAPI = JSON.parse(localStorage.getItem('livro_selecionado'));
        if (!livroDaAPI) {
            alert("Por favor, busque e selecione um livro na aba de pesquisas primeiro!");
            return;
        }

        // Regra de negócios das diretrizes: calcula o vencimento do prazo para 7 dias
        let dataVencimento = new Date();
        dataVencimento.setDate(dataVencimento.getDate() + 7);

        const novoEmprestimo = {
            cliente: clienteSelecionado,
            titulo: livroDaAPI.title || livroDaAPI.titulo,
            capa: livroDaAPI.urlCapa,
            devolucao: dataVencimento.toLocaleDateString('pt-BR')
        };

        let listaEmprestimos = localStorage.getItem('emprestimos') ? JSON.parse(localStorage.getItem('emprestimos')) : [];
        listaEmprestimos.push(novoEmprestimo);
        localStorage.setItem('emprestimos', JSON.stringify(listaEmprestimos));

        alert(`Empréstimo de "${novoEmprestimo.titulo}" finalizado para ${clienteSelecionado}! Devolução em: ${novoEmprestimo.devolucao}`);
    });
}

// Inicializações automáticas e seguras
renderizarClientes();
atualizarSelectClientes();