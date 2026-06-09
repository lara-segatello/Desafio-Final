
// let clientes = localStorage.getItem('clientes') ? JSON.parse(localStorage.getItem('clientes')) : [];
// let livroSelecionadoCache = null; // Armazena o livro clicado em tempo de execução


// function fazerLogin() {
//     const nomeInput = document.getElementById('NomeCompleto').value.trim();
//     const cpfInput = document.getElementById('CPF').value.trim();
//     const emailInput = document.getElementById('Email').value.trim();
    
//     if (!nomeInput || !emailInput) {
//         alert("Por favor, insira ao menos o Nome e o E-mail para prosseguir.");
//         return;
//     }

//     // Criação do novo objeto de leitura em conformidade com o briefing
//     const novoCliente = {
//         id: Date.now(),
//         nome: nomeInput,
//         cpf: cpfInput || "Não informado",
//         email: emailInput
//     };

//     // Insere e sincroniza com o banco local
//     clientes.push(novoCliente);
//     localStorage.setItem('clientes', JSON.stringify(clientes));

//     // Limpa os campos do formulário para o próximo input
//     document.getElementById('NomeCompleto').value = '';
//     document.getElementById('CPF').value = '';
//     document.getElementById('Email').value = '';

//     // Atualiza os componentes dependentes na tela instantaneamente
//     renderizarClientes();
//     atualizarSelectClientes();
//     alert(`Cliente "${novoCliente.nome}" cadastrado com sucesso!`);
// }

// function renderizarClientes() {
//     const listaUI = document.getElementById('lista-clientes');
//     if (!listaUI) return;

//     listaUI.innerHTML = '';
//     clientes.forEach(cliente => {
//         const li = document.createElement('li');
//         li.textContent = `${cliente.nome} (${cliente.cpf})`;
//         listaUI.appendChild(li);
//     });
// }

// //busca

// const btnBuscar = document.getElementById("btn-buscar");
// const inputBusca = document.getElementById('input-busca');
// const resultadoBusca = document.getElementById('resultado-busca');

// if (btnBuscar) {
//     btnBuscar.addEventListener('click', buscarLivro);
// }

// async function buscarLivro() {
//     const termoBusca = inputBusca.value.trim();

//     if (!termoBusca) {
//         alert("Por favor, digite o nome de um livro!");
//         return;
//     }

//     // Cria um elemento temporário de carregamento sem limpar o histórico de baixo
//     const itemCarregando = document.createElement('p');
//     itemCarregando.id = "feedback-carregando";
//     itemCarregando.style = "color: #718096; font-style: italic; font-size: 0.9rem;";
//     itemCarregando.textContent = "Buscando livro...";
//     resultadoBusca.prepend(itemCarregando);

//     try {
//         const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(termoBusca)}`;
//         const resposta = await fetch(url);
//         const dados = await resposta.json();

//         // Remove o elemento de feedback de carregamento
//         const loader = document.getElementById('feedback-carregando');
//         if (loader) loader.remove();

//         if (dados.docs && dados.docs.length > 0) {
//             const primeiroLivro = dados.docs[0];
//             adicionarLivroAoPainel(primeiroLivro);
//             inputBusca.value = ''; // Limpa a barra de pesquisa
//         } else {
//             alert("Nenhum livro encontrado com esse nome.");
//         }
//     } catch (erro) {
//         console.error("Erro ao buscar livro:", erro);
//         const loader = document.getElementById('feedback-carregando');
//         if (loader) loader.remove();
//         alert("Ocorreu um erro ao buscar o livro. Tente novamente.");
//     }
// }

// // Adiciona um card novo ao topo da lista, mantendo os anteriores na tela
// function adicionarLivroAoPainel(livro) {
//     const titulo = livro.title;
//     const autor = livro.author_name ? livro.author_name[0] : "Autor Desconhecido";
//     const urlCapa = livro.cover_i
//         ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg`
//         : 'https://via.placeholder.com/150x200?text=Sem+Capa';

//     const divCard = document.createElement('div');
//     divCard.className = 'card-livro';
    
//     // Escapa aspas simples das strings para evitar quebra de sintaxe no HTML
//     const tituloEscapado = titulo.replace(/'/g, "\\'");
//     const autorEscapado = autor.replace(/'/g, "\\'");

//     divCard.innerHTML = `
//         <img src="${urlCapa}" alt="Capa">
//         <div class="card-livro-info">
//             <h3>${titulo}</h3>
//             <p><strong>Autor:</strong> ${autor}</p>
//             <button type="button" class="btn-selecionar-livro" onclick="selecionarParaEmprestimo(this, '${tituloEscapado}', '${autorEscapado}', '${urlCapa}')">
//                 Selecionar para Empréstimo
//             </button>
//         </div>
//     `;

//     // Insere no topo da lista de exibição do Quadro 2
//     resultadoBusca.prepend(divCard);
// }

// function selecionarParaEmprestimo(botao, titulo, autor, urlCapa) {
//     // Remove o estado visual "selecionado" de qualquer outro botão do painel
//     const botoes = document.querySelectorAll('.btn-selecionar-livro');
//     botoes.forEach(b => {
//         b.classList.remove('selecionado');
//         b.textContent = "Selecionar para Empréstimo";
//     });

//     // Destaca visualmente o card atualmente ativo
//     botao.classList.add('selecionado');
//     botao.textContent = "✓ Selecionar para Empréstimo";

//     // Guarda os metadados do livro ativo em memória cache
//     livroSelecionadoCache = { titulo, autor, urlCapa };
    
//     // Atualiza a interface gráfica do Quadro 3
//     document.getElementById('texto-feedback-livro').innerHTML = `Livro selecionado: <strong>"${titulo}"</strong>`;
// }

// //emprestimo concluido 

// function atualizarSelectClientes() {
//     const select = document.getElementById('select-clientes');
//     if (!select) return;

//     select.innerHTML = '<option value="">-- Escolha um cliente --</option>';

//     clientes.forEach(cliente => {
//         const option = document.createElement('option');
//         option.value = cliente.nome;
//         option.textContent = cliente.nome;
//         select.appendChild(option);
//     });
// }

// const btnFinalizarSecao = document.querySelector('.btn-finalizarsecao');
// if (btnFinalizarSecao) {
//     btnFinalizarSecao.addEventListener('click', () => {
//         const selectClientes = document.getElementById('select-clientes');
//         const clienteSelecionado = selectClientes.value;

//         if (!clienteSelecionado) {
//             alert("Por favor, selecione um cliente antes de finalizar!");
//             return;
//         }

//         if (!livroSelecionadoCache) {
//             alert("Por favor, busque e selecione um livro no painel de acervo primeiro!");
//             return;
//         }

//         // Regra de negócios das diretrizes: calcula o vencimento do prazo para 7 dias corridos
//         let dataVencimento = new Date();
//         dataVencimento.setDate(dataVencimento.getDate() + 7);

//         const novoEmprestimo = {
//             id: Date.now(),
//             cliente: clienteSelecionado,
//             titulo: livroSelecionadoCache.titulo,
//             capa: livroSelecionadoCache.urlCapa,
//             devolucao: dataVencimento.toLocaleDateString('pt-BR')
//         };

//         let listaEmprestimos = localStorage.getItem('emprestimos') ? JSON.parse(localStorage.getItem('emprestimos')) : [];
//         listaEmprestimos.push(novoEmprestimo);
//         localStorage.setItem('emprestimos', JSON.stringify(listaEmprestimos));

//         alert(`Empréstimo de "${novoEmprestimo.titulo}" finalizado para ${clienteSelecionado}!`);
        
//         // Reseta o cache de seleção e atualiza a lista de visualização
//         livroSelecionadoCache = null;
//         document.getElementById('texto-feedback-livro').textContent = "Nenhum livro pré-selecionado para empréstimo.";
        
//         // Remove a marcação do botão selecionado no Quadro 2
//         const botoes = document.querySelectorAll('.btn-selecionar-livro');
//         botoes.forEach(b => {
//             b.classList.remove('selecionado');
//             b.textContent = "Selecionar para Empréstimo";
//         });

//         renderizarEmprestimosAtivos();
//         selectClientes.value = "";
//     });
// }

// function renderizarEmprestimosAtivos() {
//     const containerEmprestimos = document.getElementById('registro-emprestimos-ativos');
//     if (!containerEmprestimos) return;

//     let listaEmprestimos = localStorage.getItem('emprestimos') ? JSON.parse(localStorage.getItem('emprestimos')) : [];
//     containerEmprestimos.innerHTML = '';

//     if (listaEmprestimos.length === 0) {
//         containerEmprestimos.innerHTML = "<p style='color:#a0aec0; font-size:0.85rem; font-style:italic;'>Nenhum empréstimo ativo.</p>";
//         return;
//     }

//     listaEmprestimos.forEach(emp => {
//         const card = document.createElement('div');
//         card.className = 'card-emprestimo-ativo';
//         card.innerHTML = `
//             <img src="${emp.capa}" alt="Capa">
//             <div class="card-emprestimo-ativo-info">
//                 <h4>${emp.titulo}</h4>
//                 <p>Locatário: <strong>${emp.cliente}</strong></p>
//                 <p style="color: #2f855a; font-weight: bold;">Devolução: ${emp.devolucao}</p>
//             </div>
//         `;
//         containerEmprestimos.appendChild(card);
//     });
// }

// renderizarClientes();
// atualizarSelectClientes();
// renderizarEmprestimosAtivos();

let clientes = JSON.parse(localStorage.getItem('clientes')) || [];

let livroSelecionadoCache = JSON.parse(localStorage.getItem('livroSelecionado')) || null;

// LOGIN

const admin = {
    nome: "admin",
    senha: "123"
};

function fazerLoginSistema(){
    const nome = document.getElementById("nomeLogin").value.trim();
    const senha = document.getElementById("senhaLogin").value.trim();
      // ADMIN
    if(
        nome === admin.nome &&
        senha === admin.senha
    ){

        localStorage.setItem("usuarioLogado", "ADMIN");

        window.location.href = "admin.html";

        return;
    }

    // CLIENTE
    const cliente =
    clientes.find(cliente =>
        cliente.nome.toLowerCase() === nome.toLowerCase()
    );

    if(cliente){

        localStorage.setItem(
            "usuarioLogado",
            cliente.nome
        );

        window.location.href = "busca.html";
    }
    else{

        alert("Cliente não encontrado.");

        window.location.href = "index.html";
    }
}

// ================= CADASTRO =================

function fazerLogin(){

    const nomeInput =
    document.getElementById('NomeCompleto').value.trim();

    const cpfInput =
    document.getElementById('CPF').value.trim();

    const emailInput =
    document.getElementById('Email').value.trim();

    if(!nomeInput || !emailInput){

        alert("Preencha Nome e Email");

        return;
    }

    const novoCliente = {

        id: Date.now(),

        nome: nomeInput,

        cpf: cpfInput || "Não informado",

        email: emailInput
    };

    clientes.push(novoCliente);

    localStorage.setItem(
        'clientes',
        JSON.stringify(clientes)
    );

    renderizarClientes();

    alert("Cliente cadastrado!");
}

function renderizarClientes(){

    const listaUI =
    document.getElementById('lista-clientes');

    if(!listaUI) return;

    listaUI.innerHTML = '';

    clientes.forEach(cliente => {

        const li =
        document.createElement('li');

        li.textContent =
        `${cliente.nome} - ${cliente.email}`;

        listaUI.appendChild(li);
    });
}

renderizarClientes();

// ================= BUSCA =================

const btnBuscar =
document.getElementById("btn-buscar");

const inputBusca =
document.getElementById('input-busca');

const resultadoBusca =
document.getElementById('resultado-busca');

if(btnBuscar){

    btnBuscar.addEventListener(
        'click',
        buscarLivro
    );
}

async function buscarLivro(){

    const termoBusca =
    inputBusca.value.trim();

    if(!termoBusca){

        alert("Digite um livro");

        return;
    }

    try{

        const url =
        `https://openlibrary.org/search.json?title=${encodeURIComponent(termoBusca)}`;

        const resposta =
        await fetch(url);

        const dados =
        await resposta.json();

        if(
            dados.docs &&
            dados.docs.length > 0
        ){

            adicionarLivroAoPainel(
                dados.docs[0]
            );
        }
        else{

            alert("Livro não encontrado");
        }

    }catch(erro){

        console.log(erro);

        alert("Erro ao buscar livro");
    }
}

function adicionarLivroAoPainel(livro){

    const titulo = livro.title;

    const autor =
    livro.author_name
    ? livro.author_name[0]
    : "Autor desconhecido";

    const urlCapa =
    livro.cover_i
    ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg`
    : 'https://via.placeholder.com/150';

    const card =
    document.createElement('div');

    card.className = 'card-livro';

    card.innerHTML = `

        <img src="${urlCapa}">

        <div class="card-livro-info">

            <h3>${titulo}</h3>

            <p>${autor}</p>

            <button
            class="btn-selecionar-livro"
            onclick="selecionarLivro('${titulo}','${autor}','${urlCapa}', this)"
            >

                Selecionar

            </button>

        </div>
    `;

    resultadoBusca.prepend(card);
}

function selecionarLivro(
    titulo,
    autor,
    urlCapa,
    botao
){

    document
    .querySelectorAll('.btn-selecionar-livro')
    .forEach(btn => {

        btn.classList.remove('selecionado');

        btn.innerText = "Selecionar";
    });

    botao.classList.add('selecionado');

    botao.innerText = "Selecionado ✓";

    livroSelecionadoCache = {

        titulo,
        autor,
        urlCapa
    };

    localStorage.setItem(
        'livroSelecionado',
        JSON.stringify(livroSelecionadoCache)
    );
}

// ================= EMPRÉSTIMO =================

function atualizarSelectClientes(){

    const select =
    document.getElementById('select-clientes');

    if(!select) return;

    select.innerHTML = '';

    clientes.forEach(cliente => {

        const option =
        document.createElement('option');

        option.value = cliente.nome;

        option.textContent = cliente.nome;

        select.appendChild(option);
    });
}

atualizarSelectClientes();

const btnFinalizar =
document.querySelector('.btn-finalizarsecao');

if(btnFinalizar){

    btnFinalizar.addEventListener(
        'click',
        finalizarEmprestimo
    );
}

function finalizarEmprestimo(){

    const cliente =
    document.getElementById('select-clientes').value;

    if(!cliente){

        alert("Selecione um cliente");

        return;
    }

    if(!livroSelecionadoCache){

        alert("Selecione um livro");

        return;
    }

    let data =
    new Date();

    data.setDate(
        data.getDate() + 7
    );

    const emprestimo = {

        id: Date.now(),

        cliente,

        titulo:
        livroSelecionadoCache.titulo,

        capa:
        livroSelecionadoCache.urlCapa,

        devolucao:
        data.toLocaleDateString('pt-BR')
    };

    let emprestimos =
    JSON.parse(localStorage.getItem('emprestimos'))
    || [];

    emprestimos.push(emprestimo);

    localStorage.setItem(
        'emprestimos',
        JSON.stringify(emprestimos)
    );

    alert("Empréstimo concluído!");

    renderizarEmprestimosAtivos();
}

function renderizarEmprestimosAtivos(){

    const container =
    document.getElementById(
        'registro-emprestimos-ativos'
    );

    if(!container) return;

    const emprestimos =
    JSON.parse(localStorage.getItem('emprestimos'))
    || [];

    container.innerHTML = '';

    emprestimos.forEach(emp => {

        const card =
        document.createElement('div');

        card.className =
        'card-emprestimo-ativo';

        card.innerHTML = `

            <img src="${emp.capa}">

            <div>

                <h4>${emp.titulo}</h4>

                <p>${emp.cliente}</p>

                <p>
                Devolução:
                ${emp.devolucao}
                </p>

            </div>
        `;

        container.appendChild(card);
    });
}

renderizarEmprestimosAtivos();

// ADMIN

function carregarPainelAdmin(){
    carregarEmprestimosAdmin();
    carregarClientesAdmin();
}

function carregarEmprestimosAdmin(){
    const container =
    document.getElementById(
        'lista-emprestimos-admin'
    );

    if(!container) return;

    const emprestimos = JSON.parse( localStorage.getItem('emprestimos')) || [];

    container.innerHTML = '';

    if(emprestimos.length === 0){
        container.innerHTML = `
            <p style="
                color:#718096;
                font-style:italic;
            ">
                Nenhum empréstimo ativo.
            </p>
        `;

        return;
    }

    emprestimos.forEach(emp => {
        const card =document.createElement('div');

        card.className = 'card-admin';

        card.innerHTML = `

            <h3>${emp.titulo}</h3>
            <p>
                <strong>Cliente:</strong>
                ${emp.cliente}
            </p>

            <p>
                <strong>Devolução:</strong>
                ${emp.devolucao}
            </p>

            <button class="btn-remover" onclick="removerEmprestimo(${emp.id})"> Finalizar Empréstimo</button>
        `;

        container.appendChild(card);
    });
}

function removerEmprestimo(id){

    let emprestimos = JSON.parse(localStorage.getItem('emprestimos')) || [];

    emprestimos = emprestimos.filter(emp => emp.id !== id);
    
    localStorage.setItem(
        'emprestimos',
        JSON.stringify(emprestimos)
    );

    carregarEmprestimosAdmin();
    renderizarEmprestimosAtivos();
    alert("Empréstimo finalizado!");
}

function carregarClientesAdmin(){

    const container = document.getElementById('lista-clientes-admin');

    if(!container) return;

    container.innerHTML = '';

    if(clientes.length === 0){
        container.innerHTML = `
            <p style="
                color:#718096;
                font-style:italic;
            ">
                Nenhum cliente cadastrado.
            </p>
        `;

        return;
    }

    clientes.forEach(cliente => {

        const card = document.createElement('div');

        card.className = 'card-admin';

        card.innerHTML = `

            <h3>${cliente.nome}</h3>
            <p>
                <strong>Email:</strong>
                ${cliente.email}
            </p>

            <p>
                <strong>CPF:</strong>
                ${cliente.cpf}
            </p>
        `;

        container.appendChild(card);
    });
}

carregarPainelAdmin();