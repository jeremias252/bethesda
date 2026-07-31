let estudosPremium = [];

async function carregarEstudos() {
    if (estudosPremium.length > 0) {
        return estudosPremium;
    }

    if (Array.isArray(window.BETHESDA_DATA?.estudos) && window.BETHESDA_DATA.estudos.length > 0) {
        estudosPremium = window.BETHESDA_DATA.estudos;
        return estudosPremium;
    }

    try {
        const resposta = await fetch("data/estudos.json");
        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os estudos.");
        }

        estudosPremium = await resposta.json();
        return estudosPremium;
    } catch (erro) {
        console.error(erro);
        return [];
    }
}

function extrairCategoriasEstudos(estudos) {
    return ["Todos", ...new Set(estudos.map(estudo => estudo.categoria).filter(Boolean))];
}

function filtroEstudo(estudo, termo, categoria) {
    const campos = [
        estudo.titulo,
        estudo.categoria,
        estudo.referencia,
        estudo.resumo,
        estudo.contexto,
        estudo.objetivo,
        ...(estudo.palavrasChave || []),
        ...(estudo.personagens || [])
    ];

    const passaTermo = !termo || campos.some(campo => normalizarTexto(campo || "").includes(termo));
    const passaCategoria = categoria === "Todos" || estudo.categoria === categoria;

    return passaTermo && passaCategoria;
}

function renderizarChipsCategorias(categorias, categoriaAtiva, filtroAtual) {
    return categorias.map(categoria => {
        const ativo = categoria === categoriaAtiva ? "active" : "";
        const categoriaJs = jsLiteralString(categoria);
        const filtroJs = jsLiteralString(filtroAtual || "");

        return `<button class="filter-tab ${ativo}" onclick="abrirEstudos(${filtroJs}, ${categoriaJs})">${escaparHtml(categoria)}</button>`;
    }).join("");
}

function renderizarCartaoEstudo(estudo, destaque = false) {
    const estudoJs = jsLiteralString(estudo.id);
    const versos = (estudo.versiculosChave || []).slice(0, 2).join(" · ");

    return `
        <div class="card study-card-premium ${destaque ? 'featured' : ''}" onclick="abrirEstudoCompleto(${estudoJs})">
            <div class="study-meta">
                <span class="badge-pill">${escaparHtml(estudo.categoria)}</span>
                <span class="badge-pill">${escaparHtml(estudo.referencia)}</span>
            </div>
            <h3>${escaparHtml(estudo.titulo)}</h3>
            <p class="study-summary">${escaparHtml(estudo.resumo)}</p>
            <p class="muted">${escaparHtml(estudo.destaque || versos)}</p>
        </div>
    `;
}

function renderizarListaPontos(pontos = []) {
    if (!pontos.length) return "<p class='muted'>Sem tópicos definidos.</p>";

    return `
        <ol class="study-outline">
            ${pontos.map((ponto, indice) => `
                <li>
                    <strong>${indice + 1}. ${escaparHtml(ponto.titulo || `Ponto ${indice + 1}`)}</strong>
                    <p>${escaparHtml(ponto.texto || "")}</p>
                </li>
            `).join("")}
        </ol>
    `;
}

function renderizarListaLinksReferencias(referencias = []) {
    return referencias.map(ref => {
        const refJs = jsLiteralString(ref);
        return `<a href="#" class="tag tag-link" onclick="abrirReferenciaBiblica(${refJs});return false;">${escaparHtml(ref)}</a>`;
    }).join("");
}

function renderizarListaPersonagens(personagens = []) {
    if (!personagens.length) return "<p class='muted'>Sem personagens relacionados.</p>";

    return personagens.map(nome => {
        if (typeof criarLinkPersonagem === "function") {
            return `<span class="tag">${criarLinkPersonagem(nome)}</span>`;
        }
        return `<span class="tag">${escaparHtml(nome)}</span>`;
    }).join(" ");
}

async function abrirEstudos(filtro = "", categoriaAtiva = "Todos") {
    const pagina = document.getElementById("pagina");
    const estudos = await carregarEstudos();
    const termo = normalizarTexto(filtro);
    const categorias = extrairCategoriasEstudos(estudos);
    const filtrados = estudos.filter(estudo => filtroEstudo(estudo, termo, categoriaAtiva));
    const destaque = filtrados[0] || estudos[0];
    const quantidadeVersiculos = estudos.reduce((total, estudo) => total + (estudo.versiculosChave || []).length, 0);

    let html = `
        <div class="biblioteca study-dossier">

            <button class="btn-voltar" onclick="voltarDashboard()">⬅ Dashboard</button>

            <div class="premium-hero">
                <div>
                    <span class="premium-badge">Bethesda Premium</span>
                    <h1>📖 Estudos Bíblicos Profundos</h1>
                    <p>Exposições completas, sermões, devocionais e aplicações práticas com Bíblia aberta em cada passo.</p>
                </div>

                <div class="study-metrics">
                    <div class="card metric-card">
                        <strong>${estudos.length}</strong>
                        <span>Estudos prontos</span>
                    </div>
                    <div class="card metric-card">
                        <strong>${categorias.length - 1}</strong>
                        <span>Categorias</span>
                    </div>
                    <div class="card metric-card">
                        <strong>${quantidadeVersiculos}</strong>
                        <span>Versículos-chave</span>
                    </div>
                </div>
            </div>

            <div class="page-actions">
                <input
                    id="buscaEstudos"
                    class="search-box"
                    type="text"
                    placeholder="Pesquisar estudos, temas, versículos ou personagens..."
                    value="${escaparHtml(filtro)}">
                <button class="btn-voltar" onclick="abrirEstudos(document.getElementById('buscaEstudos').value, '${escaparHtml(categoriaAtiva)}')">Pesquisar</button>
            </div>

            <div class="filter-tabs">
                ${renderizarChipsCategorias(categorias, categoriaAtiva, filtro)}
            </div>

            ${destaque ? `
                <div class="study-callout">
                    <span class="premium-badge">Estudo em destaque</span>
                    <h2>${escaparHtml(destaque.titulo)}</h2>
                    <p>${escaparHtml(destaque.destaque || destaque.resumo)}</p>
                    <div class="study-chip-row">
                        ${(destaque.palavrasChave || []).slice(0, 4).map(chave => `<span class="study-chip">${escaparHtml(chave)}</span>`).join("")}
                    </div>
                </div>
            ` : ""}

            <h2 style="margin-top:26px;">Biblioteca de estudos</h2>

            <div class="study-grid">
                ${filtrados.map((estudo, indice) => renderizarCartaoEstudo(estudo, indice === 0)).join("")}
            </div>
        </div>
    `;

    mostrarPagina();
    pagina.innerHTML = html;

    const campo = document.getElementById("buscaEstudos");
    if (campo) {
        campo.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter") {
                abrirEstudos(campo.value, categoriaAtiva);
            }
        });
    }
}

async function abrirEstudoCompleto(id) {
    const pagina = document.getElementById("pagina");
    const estudos = await carregarEstudos();
    const estudo = estudos.find(item => item.id === id);

    if (!estudo) {
        alert("Estudo não encontrado.");
        return;
    }

    const primeiraReferencia = (estudo.versiculosChave || [])[0] || estudo.referencia;
    const primeiraReferenciaJs = jsLiteralString(primeiraReferencia);
    const perguntaAI = jsLiteralString(`Faça um estudo completo sobre ${estudo.titulo}`);

    let html = `
        <div class="study-dossier">
            <button class="btn-voltar" onclick="abrirEstudos()">⬅ Voltar aos estudos</button>

            <div class="study-header card">
                <div class="study-meta">
                    <span class="badge-pill">${escaparHtml(estudo.categoria)}</span>
                    <span class="badge-pill">${escaparHtml(estudo.referencia)}</span>
                </div>
                <h1>${escaparHtml(estudo.titulo)}</h1>
                <p class="study-summary">${escaparHtml(estudo.resumo)}</p>
                <div class="study-quote">${escaparHtml(estudo.destaque || estudo.contexto || "")}</div>

                <div class="study-nav">
                    <button class="btn-voltar" onclick="abrirReferenciaBiblica(${primeiraReferenciaJs})">📖 Abrir na Bíblia</button>
                    <button class="btn-voltar" onclick="abrirBethesdaAI(${perguntaAI})">🤖 Abrir na Bethesda AI</button>
                </div>
            </div>

            <div class="study-grid-detail">
                <div class="study-section">
                    <h3>🎯 Objetivo</h3>
                    <p>${escaparHtml(estudo.objetivo || "")}</p>
                </div>

                <div class="study-section">
                    <h3>📚 Contexto</h3>
                    <p>${escaparHtml(estudo.contexto || "")}</p>
                </div>
            </div>

            <div class="study-grid-detail">
                <div class="study-section">
                    <h3>📖 Versículos-chave</h3>
                    <div class="study-chip-row">
                        ${renderizarListaLinksReferencias(estudo.versiculosChave || [])}
                    </div>
                </div>

                <div class="study-section">
                    <h3>👥 Personagens</h3>
                    <div class="study-chip-row">
                        ${renderizarListaPersonagens(estudo.personagens || [])}
                    </div>
                </div>
            </div>

            <div class="study-section">
                <h3>🧭 Tópicos principais</h3>
                ${renderizarListaPontos(estudo.pontos || [])}
            </div>

            <div class="study-grid-detail">
                <div class="study-section">
                    <h3>🪄 Aplicações práticas</h3>
                    <ul>
                        ${(estudo.aplicacoes || []).map(item => `<li>${escaparHtml(item)}</li>`).join("")}
                    </ul>
                </div>

                <div class="study-section">
                    <h3>❓ Perguntas para reflexão</h3>
                    <ul>
                        ${(estudo.perguntas || []).map(item => `<li>${escaparHtml(item)}</li>`).join("")}
                    </ul>
                </div>
            </div>

            <div class="study-grid-detail">
                <div class="study-section">
                    <h3>🙏 Oração</h3>
                    <p>${escaparHtml(estudo.oracao || "")}</p>
                </div>

                <div class="study-section">
                    <h3>📌 Palavras-chave</h3>
                    <div class="study-chip-row">
                        ${(estudo.palavrasChave || []).map(chave => `<span class="study-chip">${escaparHtml(chave)}</span>`).join("")}
                    </div>
                </div>
            </div>

            <div class="study-section">
                <h3>📘 Leitura complementar</h3>
                <div class="study-chip-row">
                    ${renderizarListaLinksReferencias(estudo.leituraComplementar || [])}
                </div>
            </div>
        </div>
    `;

    mostrarPagina();
    pagina.innerHTML = html;
}

window.carregarEstudos = carregarEstudos;
window.abrirEstudos = abrirEstudos;
window.abrirEstudoCompleto = abrirEstudoCompleto;
