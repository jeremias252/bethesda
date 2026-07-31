let favoritos = JSON.parse(localStorage.getItem("favoritosBethesda")) || [];

function salvarFavoritos() {
    localStorage.setItem("favoritosBethesda", JSON.stringify(favoritos));
}

function carregarFavoritos() {
    favoritos = JSON.parse(localStorage.getItem("favoritosBethesda")) || [];
}

function adicionarFavorito(referencia, texto) {
    carregarFavoritos();

    if (favoritos.some(v => v.referencia === referencia)) {
        alert("Este versículo já está nos favoritos.");
        return;
    }

    const partes = referencia.split(" ");
    const livro = partes.slice(0, partes.length - 1).join(" ");
    const capVers = partes[partes.length - 1];
    const [capitulo, versiculo] = capVers.split(":").map(n => parseInt(n, 10));

    favoritos.push({
        referencia,
        texto,
        livro,
        capitulo,
        versiculo
    });

    salvarFavoritos();
    alert("Versículo salvo!");
}

async function abrirFavoritos() {
    const pagina = document.getElementById("pagina");
    carregarFavoritos();
    const livros = await carregarLivros();

    let html = `
        <div class="biblioteca">

            <button class="btn-voltar" onclick="voltarDashboard()">⬅ Dashboard</button>

            <h1>⭐ Favoritos</h1>

            <div class="page-actions">
                <button class="btn-voltar" onclick="limparFavoritos()">Limpar todos</button>
            </div>
    `;

    if (favoritos.length === 0) {
        html += `
            <div class="card">
                <p>Nenhum favorito salvo.</p>
            </div>
        `;
    } else {
        favoritos.forEach((item, indice) => {
            const livro = livros.find(l => normalizarTexto(l.nome) === normalizarTexto(item.livro));

            html += `
                <div class="card favorite-card" style="margin-bottom:20px;">
                    <h3><a href="#" onclick="abrirCapitulo('${livro ? livro.abrev : ''}', ${item.capitulo}, ${item.versiculo});return false;">${escaparHtml(item.referencia)}</a></h3>
                    <p>${escaparHtml(item.texto)}</p>
                    <button onclick="event.stopPropagation();removerFavorito(${indice})" class="btn-voltar">🗑 Remover</button>
                </div>
            `;
        });
    }

    html += `
        </div>
    `;

    mostrarPagina();
    pagina.innerHTML = html;
}

function removerFavorito(indice) {
    carregarFavoritos();
    favoritos.splice(indice, 1);
    salvarFavoritos();
    abrirFavoritos();
}

function limparFavoritos() {
    if (!confirm("Deseja remover todos os favoritos?")) return;
    favoritos = [];
    salvarFavoritos();
    abrirFavoritos();
}

window.adicionarFavorito = adicionarFavorito;
window.abrirFavoritos = abrirFavoritos;
window.removerFavorito = removerFavorito;
window.limparFavoritos = limparFavoritos;
