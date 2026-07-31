
async function abrirCapitulo(abrev, numeroCapitulo, versiculoDestacado = null) {
    const pagina = document.getElementById("pagina");

    const livros = await carregarLivros();
    const livroInfo = livros.find(l => l.abrev === abrev);

    if (!livroInfo) {
        alert("Livro não encontrado.");
        return;
    }

    const versoesSelecionadas = typeof obterVersoesSelecionadasBiblia === "function"
        ? obterVersoesSelecionadasBiblia()
        : ["local"];

    window.__bethesdaAtualizadorVersoes = () => abrirCapitulo(abrev, numeroCapitulo, versiculoDestacado);

    const comparar = versoesSelecionadas.length > 1;

    let html = `
        <div class="capitulo">

            <button class="btn-voltar" onclick="abrirLivro(${livroInfo.id})">⬅ Voltar</button>

            <h1>${escaparHtml(livroInfo.nome)}</h1>
            <h2>Capítulo ${numeroCapitulo}</h2>

            <div class="card" style="margin-bottom:20px;">
                <h3>📚 Traduções selecionadas</h3>
                ${typeof renderizarControleVersoesBiblia === "function" ? renderizarControleVersoesBiblia("Escolha até 3 traduções") : ""}
            </div>
    `;

    if (versoesSelecionadas.length > 1 && typeof carregarCapituloComparado === "function" && typeof renderizarComparacaoBiblica === "function") {
        const comparacao = await carregarCapituloComparado(abrev, numeroCapitulo, versoesSelecionadas);
        html += renderizarComparacaoBiblica({
            titulo: `${livroInfo.nome} ${numeroCapitulo}`,
            subtitulo: "Comparação lado a lado entre versões selecionadas.",
            itens: comparacao.map(item => ({
                nomeVersao: item.nomeVersao,
                capitulo: item.capitulo,
                referencia: `${livroInfo.nome} ${numeroCapitulo}`,
                texto: item.texto
            }))
        });
    } else {
        const livroBiblia = await carregarLivroBiblia(abrev);

        if (!livroBiblia) {
            alert("Livro não encontrado.");
            return;
        }

        const capitulo = livroBiblia.chapters[numeroCapitulo - 1];

        if (!capitulo) {
            alert("Capítulo não encontrado.");
            return;
        }

        html += `
            <div class="chapter-nav">
        `;

        if (numeroCapitulo > 1) {
            html += `<button class="btn-voltar" onclick="abrirCapitulo('${abrev}', ${numeroCapitulo - 1})">⬅ Capítulo Anterior</button>`;
        }

        if (numeroCapitulo < livroBiblia.chapters.length) {
            html += `<button class="btn-voltar" onclick="abrirCapitulo('${abrev}', ${numeroCapitulo + 1})">Próximo Capítulo ➡</button>`;
        }

        html += `
            </div>

            <hr class="divider">
        `;

        capitulo.forEach((versiculo, indice) => {
            const numeroVersiculo = indice + 1;
            const referencia = `${livroInfo.nome} ${numeroCapitulo}:${numeroVersiculo}`;
            const destaque = versiculoDestacado === numeroVersiculo
                ? "background:#FFF5D6;border-left:6px solid #B58150;"
                : "";

            html += `
                <div class="card verse-card" style="margin-bottom:20px;${destaque}">

                    <div class="verse-top">
                        <strong class="numero-versiculo">${numeroVersiculo}</strong>

                        <div class="verse-actions">
                            <button onclick="copiarVersiculo('${referencia}', ${jsLiteralString(versiculo)})" class="btn-voltar" title="Copiar">📋</button>
                            <button onclick="adicionarFavorito('${referencia}', ${jsLiteralString(versiculo)})" class="btn-voltar" title="Favoritar">⭐</button>
                            <button onclick="adicionarAnotacao('${referencia}')" class="btn-voltar" title="Anotar">📝</button>
                        </div>
                    </div>

                    <p class="versiculo verse-text" onclick="abrirContextoVersiculo('${referencia}', ${jsLiteralString(versiculo)})">
                        ${escaparHtml(versiculo)}
                    </p>
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

function copiarVersiculo(referencia, texto) {
    navigator.clipboard.writeText(`${referencia}\n\n${texto}`);
    alert("Versículo copiado!");
}

window.abrirCapitulo = abrirCapitulo;
window.copiarVersiculo = copiarVersiculo;
