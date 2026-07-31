let personagens = [];

async function carregarPersonagens() {
    if (personagens.length > 0) {
        return personagens;
    }

    if (Array.isArray(window.BETHESDA_DATA?.personagens) && window.BETHESDA_DATA.personagens.length > 0) {
        personagens = window.BETHESDA_DATA.personagens;
        return personagens;
    }

    try {
        const resposta = await fetch("data/personagens/personagens.json");
        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os personagens.");
        }
        personagens = await resposta.json();
        return personagens;
    } catch (erro) {
        console.error("Erro ao carregar personagens:", erro);
        return [];
    }
}

function buscarPersonagemPorNome(nome) {
    return personagens.find(personagem => normalizarTexto(personagem.nome) === normalizarTexto(nome));
}

function criarLinkPersonagem(nome) {
    const personagem = buscarPersonagemPorNome(nome);
    if (!personagem) {
        return `<span class="text-muted">${escaparHtml(nome)}</span>`;
    }
    return `<a href="#" onclick="abrirPersonagem(${personagem.id});return false;">${escaparHtml(nome)}</a>`;
}

function renderFamilia(familia = {}) {
    const linhas = [];
    for (const [chave, valor] of Object.entries(familia || {})) {
        if (Array.isArray(valor)) {
            linhas.push(`<p><strong>${escaparHtml(chave)}:</strong> ${valor.map(criarLinkPersonagem).join(", ")}</p>`);
        } else if (valor) {
            linhas.push(`<p><strong>${escaparHtml(chave)}:</strong> ${criarLinkPersonagem(valor)}</p>`);
        }
    }
    return linhas.join("");
}

async function abrirPersonagens(filtro = "") {
    const pagina = document.getElementById("pagina");
    const lista = await carregarPersonagens();
    const termo = normalizarTexto(filtro);

    const filtrados = termo
        ? lista.filter(personagem =>
            normalizarTexto(personagem.nome).includes(termo) ||
            normalizarTexto(personagem.titulo).includes(termo) ||
            normalizarTexto(personagem.versiculo || "").includes(termo) ||
            normalizarTexto(personagem.descricao || "").includes(termo)
        )
        : lista;

    let html = `
        <div class="biblioteca">

            <button class="btn-voltar" onclick="voltarDashboard()">⬅ Dashboard</button>

            <h1>👤 Personagens Bíblicos</h1>

            <p>Escolha um personagem para estudar.</p>

            <div class="page-actions">
                <input
                    id="buscaPersonagem"
                    class="search-box"
                    type="text"
                    placeholder="Pesquisar personagem..."
                    value="${escaparHtml(filtro)}">
                <button class="btn-voltar" onclick="abrirPersonagens(document.getElementById('buscaPersonagem').value)">Pesquisar</button>
            </div>

            <p class="muted">${filtrados.length} personagem(ns) encontrado(s)</p>

            <div class="lista-livros">
    `;

    filtrados.forEach(personagem => {
        html += `
            <div class="livro" onclick="abrirPersonagem(${personagem.id})">
                <h3>${escaparHtml(personagem.nome)}</h3>
                <small>${escaparHtml(personagem.titulo || "")}</small>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    mostrarPagina();
    pagina.innerHTML = html;

    const campo = document.getElementById("buscaPersonagem");
    if (campo) {
        campo.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter") {
                abrirPersonagens(campo.value);
            }
        });
    }
}

async function abrirPersonagem(id) {
    const pagina = document.getElementById("pagina");
    const lista = await carregarPersonagens();
    const p = lista.find(x => x.id === id);

    if (!p) {
        alert("Personagem não encontrado.");
        return;
    }

    let html = `
        <div class="capitulo">

            <button class="btn-voltar" onclick="abrirPersonagens()">⬅ Voltar</button>

            <h1>${escaparHtml(p.nome)}</h1>
            <h2>${escaparHtml(p.titulo || "")}</h2>

            <div class="card">
                <h3>📌 Informações Gerais</h3>
                <p><strong>Nascimento:</strong> ${escaparHtml(p.nascimento || "")}</p>
                <p><strong>Época:</strong> ${escaparHtml(p.epoca || "")}</p>
                <p><strong>Idade:</strong> ${escaparHtml(p.idade || "")}</p>
                <p><strong>Versículo-chave:</strong> ${escaparHtml(p.versiculo || "")}</p>
            </div>

            <div class="card" style="margin-top:20px;">
                <h3>📖 Biografia</h3>
                <p>${escaparHtml(p.descricao || "")}</p>
            </div>

            <div class="card" style="margin-top:20px;">
                <h3>🌳 Genealogia</h3>
                ${renderFamilia(p.familia || { pai: p.pai, mae: p.mae, esposa: p.esposa, filhos: p.filhos })}
            </div>

            <div class="card" style="margin-top:20px;">
                <h3>⭐ Principais Eventos</h3>
                <ul>${(p.principaisEventos || []).map(evento => `<li>${escaparHtml(evento)}</li>`).join("")}</ul>
            </div>
        </div>
    `;

    mostrarPagina();
    pagina.innerHTML = html;
}

window.carregarPersonagens = carregarPersonagens;
window.abrirPersonagens = abrirPersonagens;
window.abrirPersonagem = abrirPersonagem;
window.criarLinkPersonagem = criarLinkPersonagem;
