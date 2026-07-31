
async function abrirContextoVersiculo(referencia, texto) {
    const pagina = document.getElementById("pagina");
    const comentario = await buscarComentario(referencia);
    const referenciaInfo = typeof resolverReferenciaBiblica === "function"
        ? await resolverReferenciaBiblica(referencia)
        : null;
    const comparacao = referenciaInfo && typeof carregarReferenciaVersoesBiblica === "function"
        ? await carregarReferenciaVersoesBiblica(referenciaInfo, typeof obterVersoesSelecionadasBiblia === "function" ? obterVersoesSelecionadasBiblia() : ["local"])
        : [];

    const refJs = jsLiteralString(referencia);
    const textoJs = jsLiteralString(texto);

    let html = `
        <div class="capitulo">

            <button class="btn-voltar" onclick="abrirReferenciaBiblica(${refJs})">⬅ Voltar ao capítulo</button>

            <h1>${escaparHtml(referencia)}</h1>

            <div class="card">
                <div class="page-actions page-actions-left">
                    <button class="btn-voltar" onclick="copiarTextoContexto(${refJs}, ${textoJs})">📋 Copiar</button>
                    <button class="btn-voltar" onclick="abrirReferenciaBiblica(${refJs})">📖 Abrir no capítulo</button>
                </div>

                <h3>📖 Versículo</h3>
                <p class="versiculo">${escaparHtml(texto)}</p>
            </div>
    `;

    if (comparacao.length > 0 && typeof renderizarComparacaoBiblica === "function") {
        html += renderizarComparacaoBiblica({
            titulo: `Comparação de traduções — ${referencia}`,
            subtitulo: "Veja o mesmo versículo em até 3 traduções selecionadas.",
            itens: comparacao.map(item => ({
                nomeVersao: item.nomeVersao,
                capitulo: item.capitulo,
                referencia: item.referencia,
                texto: item.texto
            }))
        });
    }

    if (comentario) {
        html += `
            <div class="card" style="margin-top:20px;">
                <h3>📚 Comentário Bíblico</h3>
                <p>${escaparHtml(comentario.comentario)}</p>
            </div>

            <div class="card" style="margin-top:20px;">
                <h3>💡 Aplicação</h3>
                <p>${escaparHtml(comentario.aplicacao)}</p>
            </div>

            <div class="card" style="margin-top:20px;">
                <h3>🔗 Referências Cruzadas</h3>
                <ul>
                    ${(comentario.referencias || []).map(ref => {
                        const linkJs = jsLiteralString(ref);
                        return `<li><a href="#" onclick="abrirReferencia(${linkJs});return false;">${escaparHtml(ref)}</a></li>`;
                    }).join("")}
                </ul>
            </div>
        `;
    } else {
        html += `
            <div class="card" style="margin-top:20px;">
                <h3>📚 Comentário Bíblico</h3>
                <p>Ainda não existe comentário para este versículo.</p>
            </div>
        `;
    }

    html += `
        </div>
    `;

    mostrarPagina();
    pagina.innerHTML = html;
}

function copiarTextoContexto(referencia, texto) {
    navigator.clipboard.writeText(`${referencia}\n\n${texto}`);
    alert("Versículo copiado!");
}

window.abrirContextoVersiculo = abrirContextoVersiculo;
window.copiarTextoContexto = copiarTextoContexto;
