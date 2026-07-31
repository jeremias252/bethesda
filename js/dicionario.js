let dicionario = {};
let lexicoStrong = [];

async function carregarDicionario() {
    if (Object.keys(dicionario).length > 0) {
        return dicionario;
    }

    if (window.BETHESDA_DATA?.dicionario) {
        dicionario = window.BETHESDA_DATA.dicionario;
        return dicionario;
    }

    try {
        const resposta = await fetch("data/dicionario/dicionario.json");
        if (!resposta.ok) {
            throw new Error("Erro ao carregar o dicionário.");
        }
        dicionario = await resposta.json();
        return dicionario;
    } catch (erro) {
        console.error(erro);
        return {};
    }
}

async function carregarLexicoStrong() {
    if (lexicoStrong.length > 0) {
        return lexicoStrong;
    }

    if (Array.isArray(window.BETHESDA_DATA?.strongLexicon) && window.BETHESDA_DATA.strongLexicon.length > 0) {
        lexicoStrong = window.BETHESDA_DATA.strongLexicon;
        return lexicoStrong;
    }

    return [];
}

async function pesquisarDicionario(termo) {
    const dados = await carregarDicionario();
    termo = normalizarTexto(termo);

    const resultados = [];

    for (const chave in dados) {
        const item = dados[chave];
        if (
            normalizarTexto(chave).includes(termo) ||
            normalizarTexto(item.titulo || "").includes(termo) ||
            normalizarTexto(item.descricao || "").includes(termo)
        ) {
            resultados.push({ chave, ...item });
        }
    }

    return resultados;
}

async function pesquisarLexicoStrong(termo) {
    const itens = await carregarLexicoStrong();
    const normalizado = normalizarTexto(termo);

    return itens.filter(item => {
        const campos = [
            item.termo,
            item.tema,
            item.significado,
            item.grego,
            item.hebraico,
            item.transliteracao,
            ...(item.referencias || [])
        ];
        return campos.some(campo => normalizarTexto(campo || "").includes(normalizado));
    });
}

async function abrirStrong(termoInicial = "") {
    const pagina = document.getElementById("pagina");
    const termos = Object.keys(await carregarDicionario());
    const lexicon = await carregarLexicoStrong();

    let html = `
        <div class="biblioteca">

            <button class="btn-voltar" onclick="voltarDashboard()">⬅ Dashboard</button>

            <h1>📜 Dicionário Bíblico & Léxico</h1>

            <p>Pesquise termos, referências e palavras do hebraico/grego com aplicações práticas.</p>

            <div class="page-actions">
                <input
                    id="campoStrong"
                    class="search-box"
                    type="text"
                    placeholder="Ex.: fé, graça, pistis, charis..."
                    value="${escaparHtml(termoInicial)}">
                <button class="btn-voltar" onclick="abrirDicionario(document.getElementById('campoStrong').value)">Pesquisar</button>
            </div>

            <div class="card" style="margin-top:20px;">
                <h3>📚 Léxico rápido</h3>
                <div class="tag-row">
                    ${lexicon.slice(0, 12).map(item => {
                        const termoJs = jsLiteralString(item.termo);
                        return `<a href="#" class="tag tag-link" onclick="abrirDicionario(${termoJs});return false;">${escaparHtml(item.termo)}</a>`;
                    }).join("")}
                </div>
            </div>

            <div class="card" style="margin-top:20px;">
                <h3>🔤 Termos do dicionário</h3>
                <div class="tag-row">
                    ${termos.map(termo => {
                        const termoJs = jsLiteralString(termo);
                        return `<a href="#" class="tag tag-link" onclick="abrirDicionario(${termoJs});return false;">${escaparHtml(termo)}</a>`;
                    }).join("")}
                </div>
            </div>
        </div>
    `;

    mostrarPagina();
    pagina.innerHTML = html;

    const campo = document.getElementById("campoStrong");
    if (campo) {
        campo.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter") {
                abrirDicionario(campo.value);
            }
        });
    }
}

async function abrirDicionario(termo) {
    const pagina = document.getElementById("pagina");
    const resultados = await pesquisarDicionario(termo);
    const strong = await pesquisarLexicoStrong(termo);

    let html = `
        <div class="biblioteca">

            <button class="btn-voltar" onclick="abrirStrong()">⬅ Voltar</button>

            <h1>📜 Dicionário Bíblico</h1>

            <p>${resultados.length ? `Encontramos ${resultados.length} termo(s) bíblico(s).` : "Nenhum termo encontrado."}</p>
    `;

    if (resultados.length === 0 && strong.length === 0) {
        html += `
            <div class="card">
                <p>Nenhum termo encontrado.</p>
            </div>
        `;
    } else {
        if (resultados.length > 0) {
            resultados.forEach(item => {
                html += `
                    <div class="card dictionary-card" style="margin-bottom:20px;">
                        <h2>${escaparHtml(item.titulo)}</h2>
                        <p>${escaparHtml(item.descricao)}</p>

                        <h3>📖 Referências Bíblicas</h3>
                        <ul>
                            ${(item.referencias || []).map(ref => {
                                const refJs = jsLiteralString(ref);
                                return `<li><a href="#" onclick="abrirReferencia(${refJs});return false;">${escaparHtml(ref)}</a></li>`;
                            }).join("")}
                        </ul>
                    </div>
                `;
            });
        }

        if (strong.length > 0) {
            html += `
                <div class="card" style="margin-top:20px;">
                    <h2>🔠 Léxico Strong</h2>
                    <div class="study-grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr));">
                        ${strong.map(item => `
                            <div class="card strong-card">
                                <span class="badge-pill">${escaparHtml(item.tema || item.termo)}</span>
                                <h3>${escaparHtml(item.termo)}</h3>
                                <p><strong>Grego:</strong> ${escaparHtml(item.grego || "—")} (${escaparHtml(item.transliteracao || "—")})</p>
                                <p><strong>Hebraico:</strong> ${escaparHtml(item.hebraico || "—")}</p>
                                <p>${escaparHtml(item.significado || "")}</p>
                                <div class="tag-row">
                                    ${(item.referencias || []).map(ref => {
                                        const refJs = jsLiteralString(ref);
                                        return `<a href="#" class="tag tag-link" onclick="abrirReferencia(${refJs});return false;">${escaparHtml(ref)}</a>`;
                                    }).join("")}
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;
        }
    }

    html += `
        </div>
    `;

    mostrarPagina();
    pagina.innerHTML = html;
}

async function abrirReferencia(referencia) {
    await abrirReferenciaBiblica(referencia);
}

window.abrirStrong = abrirStrong;
window.abrirDicionario = abrirDicionario;
window.abrirReferencia = abrirReferencia;
window.pesquisarDicionario = pesquisarDicionario;
window.carregarDicionario = carregarDicionario;
window.carregarLexicoStrong = carregarLexicoStrong;
