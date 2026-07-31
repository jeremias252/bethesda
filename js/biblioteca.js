async function abrirBiblioteca(filtro = "") {
    const pagina = document.getElementById("pagina");
    const livros = await carregarLivros();
    const termo = normalizarTexto(filtro);

    const filtrados = termo
        ? livros.filter(livro =>
            normalizarTexto(livro.nome).includes(termo) ||
            normalizarTexto(livro.categoria || "").includes(termo) ||
            normalizarTexto(livro.testamento || "").includes(termo) ||
            normalizarTexto(livro.autor || "").includes(termo)
        )
        : livros;

    let html = `
        <div class="biblioteca">

            <button class="btn-voltar" onclick="voltarDashboard()">⬅ Dashboard</button>

            <h1>📚 Biblioteca Bíblica</h1>

            <p>Escolha um livro da Bíblia ou pesquise por nome, categoria ou testamento.</p>

            <div class="page-actions">
                <input
                    id="buscaLivro"
                    class="search-box"
                    type="text"
                    placeholder="Pesquisar livro..."
                    value="${escaparHtml(filtro)}">
                <button class="btn-voltar" onclick="abrirBiblioteca(document.getElementById('buscaLivro').value)">Pesquisar</button>
            </div>

            <p class="muted">${filtrados.length} livro(s) encontrado(s)</p>

            <div class="lista-livros">
    `;

    filtrados.forEach(livro => {
        html += `
            <div class="livro" onclick="abrirLivro(${livro.id})">
                <h3>${escaparHtml(livro.nome)}</h3>
                <small>${escaparHtml(livro.categoria || "")}</small>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    mostrarPagina();
    pagina.innerHTML = html;

    const campo = document.getElementById("buscaLivro");
    if (campo) {
        campo.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter") {
                abrirBiblioteca(campo.value);
            }
        });
    }
}

async function abrirLivro(id) {
    const pagina = document.getElementById("pagina");
    const livros = await carregarLivros();
    const livroInfo = livros.find(l => l.id === id);

    if (!livroInfo) {
        alert("Livro não encontrado.");
        return;
    }

    const livroBiblia = await carregarLivroBiblia(livroInfo.abrev);

    if (!livroBiblia) {
        alert("Livro não encontrado na Bíblia.");
        return;
    }

    let html = `
        <div class="livro-detalhe">

            <button class="btn-voltar" onclick="abrirBiblioteca()">⬅ Voltar</button>

            <h1>${escaparHtml(livroInfo.nome)}</h1>

            <div class="livro-info">
                <p><strong>Autor:</strong> ${escaparHtml(livroInfo.autor || "-")}</p>
                <p><strong>Tema:</strong> ${escaparHtml(livroInfo.tema || "-")}</p>
                <p><strong>Categoria:</strong> ${escaparHtml(livroInfo.categoria || "-")}</p>
                <p><strong>Testamento:</strong> ${escaparHtml(livroInfo.testamento || "-")}</p>
                <p><strong>Capítulos:</strong> ${livroBiblia.chapters.length}</p>
                <p><strong>Data:</strong> ${escaparHtml(livroInfo.data || "-")}</p>
            </div>

            <h2>📖 Capítulos</h2>

            <div class="lista-capitulos">
    `;

    for (let i = 1; i <= livroBiblia.chapters.length; i++) {
        html += `
            <button class="capitulo-btn" onclick="abrirCapitulo('${livroInfo.abrev}', ${i})">${i}</button>
        `;
    }

    html += `
            </div>
        </div>
    `;

    mostrarPagina();
    pagina.innerHTML = html;
}
