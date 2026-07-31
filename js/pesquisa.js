async function pesquisarGlobal(texto) {
    const pagina = document.getElementById("pagina");
    const termoOriginal = String(texto || "").trim();
    const termo = normalizarTexto(termoOriginal);

    if (!termoOriginal) {
        alert("Digite algo para pesquisar.");
        return;
    }

    const [biblia, livros, personagens, dicionario, estudos] = await Promise.all([
        carregarBiblia(),
        carregarLivros(),
        typeof carregarPersonagens === "function" ? carregarPersonagens() : Promise.resolve([]),
        typeof carregarDicionario === "function" ? carregarDicionario() : Promise.resolve({}),
        typeof carregarEstudos === "function" ? carregarEstudos() : Promise.resolve([])
    ]);

    const resultadosVersiculos = [];
    const livrosEncontrados = [];
    const personagensEncontrados = [];
    const termosEncontrados = [];
    const estudosEncontrados = [];

    const referenciaMatch = termoOriginal.match(/^((?:[1-3]\s*)?[A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)*)\s+(\d+):(\d+)$/);

    for (const livro of biblia) {
        for (let i = 0; i < livro.chapters.length; i++) {
            for (let j = 0; j < livro.chapters[i].length; j++) {
                const versiculo = livro.chapters[i][j];
                if (normalizarTexto(versiculo).includes(termo)) {
                    resultadosVersiculos.push({
                        livro: livro.name,
                        abrev: livro.abbrev,
                        capitulo: i + 1,
                        versiculo: j + 1,
                        texto: versiculo
                    });
                }
            }
        }
    }

    livros.forEach(livro => {
        const campos = [livro.nome, livro.categoria, livro.autor, livro.testamento, livro.tema, livro.data];
        if (campos.some(campo => normalizarTexto(campo || "").includes(termo))) {
            livrosEncontrados.push(livro);
        }
    });

    personagens.forEach(personagem => {
        const campos = [personagem.nome, personagem.titulo, personagem.descricao, personagem.versiculo, ...(personagem.principaisEventos || [])];
        if (campos.some(campo => normalizarTexto(campo || "").includes(termo))) {
            personagensEncontrados.push(personagem);
        }
    });

    Object.entries(dicionario).forEach(([chave, item]) => {
        const campos = [chave, item.titulo, item.descricao, ...(item.referencias || [])];
        if (campos.some(campo => normalizarTexto(campo || "").includes(termo))) {
            termosEncontrados.push({ chave, ...item });
        }
    });

    estudos.forEach(estudo => {
        const campos = [estudo.titulo, estudo.categoria, estudo.referencia, estudo.resumo, estudo.contexto, ...(estudo.palavrasChave || []), ...(estudo.personagens || [])];
        if (campos.some(campo => normalizarTexto(campo || "").includes(termo))) {
            estudosEncontrados.push(estudo);
        }
    });

    let html = `
        <div class="biblioteca search-results">
            <button class="btn-voltar" onclick="voltarDashboard()">⬅ Dashboard</button>

            <div class="premium-hero" style="margin-top:18px;">
                <div>
                    <span class="premium-badge">Busca global</span>
                    <h1>🔍 ${escaparHtml(termoOriginal)}</h1>
                    <p>Resultados em versículos, livros, personagens, dicionário e estudos premium.</p>
                </div>
            </div>
    `;

    if (referenciaMatch) {
        const referencia = `${referenciaMatch[1].trim()} ${referenciaMatch[2]}:${referenciaMatch[3]}`;
        const refJs = jsLiteralString(referencia);
        html += `
            <div class="study-callout">
                <span class="premium-badge">Referência detectada</span>
                <h2>${escaparHtml(referencia)}</h2>
                <div class="page-actions page-actions-left">
                    <button class="btn-voltar" onclick="abrirReferenciaBiblica(${refJs})">Abrir na Bíblia</button>
                </div>
            </div>
        `;
    }

    function renderSection(titulo, itensHtml, vazioTexto) {
        return `
            <div class="result-section">
                <h2 style="margin-top:26px;">${escaparHtml(titulo)}</h2>
                ${itensHtml || `<div class="card"><p class="muted">${escaparHtml(vazioTexto)}</p></div>`}
            </div>
        `;
    }

    const versiculosHtml = resultadosVersiculos.length
        ? `<div class="result-list">${resultadosVersiculos.slice(0, 12).map(item => `
                <div class="card result-card" onclick="abrirCapitulo('${item.abrev}', ${item.capitulo}, ${item.versiculo})">
                    <h3>${escaparHtml(item.livro)} ${item.capitulo}:${item.versiculo}</h3>
                    <p>${escaparHtml(item.texto)}</p>
                </div>
            `).join("")}</div>`
        : "";

    const livrosHtml = livrosEncontrados.length
        ? `<div class="result-list">${livrosEncontrados.slice(0, 8).map(livro => `
                <div class="card result-card" onclick="abrirLivro(${livro.id})">
                    <h3>${escaparHtml(livro.nome)}</h3>
                    <small>${escaparHtml(livro.categoria || "")}</small>
                    <p>${escaparHtml(livro.autor || "")}</p>
                </div>
            `).join("")}</div>`
        : "";

    const personagensHtml = personagensEncontrados.length
        ? `<div class="result-list">${personagensEncontrados.slice(0, 8).map(personagem => `
                <div class="card result-card" onclick="abrirPersonagem(${personagem.id})">
                    <h3>${escaparHtml(personagem.nome)}</h3>
                    <small>${escaparHtml(personagem.titulo || "")}</small>
                    <p>${escaparHtml(personagem.descricao || "")}</p>
                </div>
            `).join("")}</div>`
        : "";

    const termosHtml = termosEncontrados.length
        ? `<div class="result-list">${termosEncontrados.slice(0, 8).map(item => {
                const chaveJs = jsLiteralString(item.chave);
                return `
                    <div class="card result-card" onclick="abrirDicionario(${chaveJs})">
                        <h3>${escaparHtml(item.titulo)}</h3>
                        <p>${escaparHtml(item.descricao)}</p>
                    </div>
                `;
            }).join("")}</div>`
        : "";

    const estudosHtml = estudosEncontrados.length
        ? `<div class="result-list">${estudosEncontrados.slice(0, 8).map(estudo => {
                const estudoJs = jsLiteralString(estudo.id);
                return `
                    <div class="card result-card" onclick="abrirEstudoCompleto(${estudoJs})">
                        <h3>${escaparHtml(estudo.titulo)}</h3>
                        <small>${escaparHtml(estudo.categoria)}</small>
                        <p>${escaparHtml(estudo.resumo || "")}</p>
                    </div>
                `;
            }).join("")}</div>`
        : "";

    html += renderSection("📖 Versículos encontrados", versiculosHtml, "Nenhum versículo encontrado.");
    html += renderSection("📚 Livros relacionados", livrosHtml, "Nenhum livro encontrado.");
    html += renderSection("👤 Personagens relacionados", personagensHtml, "Nenhum personagem encontrado.");
    html += renderSection("📜 Termos do dicionário", termosHtml, "Nenhum termo encontrado.");
    html += renderSection("📖 Estudos premium", estudosHtml, "Nenhum estudo encontrado.");

    html += `
            <div class="study-callout" style="margin-top:28px;">
                <span class="premium-badge">Próximos passos</span>
                <p>Use a busca para abrir capítulos, personagens, estudos e termos bíblicos com um clique.</p>
                <div class="study-chip-row">
                    <button class="ai-suggestion" onclick="abrirBiblioteca()">Biblioteca</button>
                    <button class="ai-suggestion" onclick="abrirPersonagens()">Personagens</button>
                    <button class="ai-suggestion" onclick="abrirEstudos()">Estudos</button>
                    <button class="ai-suggestion" onclick="abrirStrong()">Strong</button>
                </div>
            </div>
        </div>
    `;

    mostrarPagina();
    pagina.innerHTML = html;
}

window.pesquisarGlobal = pesquisarGlobal;
window.pesquisarBiblia = pesquisarGlobal;
