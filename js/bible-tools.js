
const BETHESDA_BIBLE_VERSIONS = [
    { id: "local", nome: "Bethesda Local", descricao: "Texto local carregado do projeto." },
    { id: "acf", nome: "Almeida Corrigida Fiel", descricao: "Português clássico e bem literal." },
    { id: "ra", nome: "Almeida Revista e Atualizada", descricao: "Equilíbrio entre precisão e fluidez." },
    { id: "nvi", nome: "Nova Versão Internacional", descricao: "Português claro e contemporâneo." },
    { id: "apee", nome: "Almeida Pontifícia e Edição Ecumênica", descricao: "Texto devocional e tradicional em português." }
];

const BETHESDA_VERSOES_KEY = "bethesdaBibleVersions";
const BETHESDA_API_BASE = "https://www.abibliadigital.com.br/api";
let capitulosVersaoCache = new Map();

function obterVersoesDisponiveisBiblia() {
    return BETHESDA_BIBLE_VERSIONS.slice();
}

function obterVersoesSelecionadasBiblia() {
    try {
        const salvo = JSON.parse(localStorage.getItem(BETHESDA_VERSOES_KEY) || "null");
        if (Array.isArray(salvo) && salvo.length > 0) {
            return [...new Set(salvo.filter(id => BETHESDA_BIBLE_VERSIONS.some(v => v.id === id)))].slice(0, 3);
        }
    } catch {
        // ignore
    }

    return ["local", "acf", "ra"];
}

function definirVersoesSelecionadasBiblia(lista = []) {
    const validas = [...new Set(lista.filter(id => BETHESDA_BIBLE_VERSIONS.some(v => v.id === id)))].slice(0, 3);
    localStorage.setItem(BETHESDA_VERSOES_KEY, JSON.stringify(validas.length ? validas : ["local"]));
}

function nomeVersaoBiblia(id) {
    return BETHESDA_BIBLE_VERSIONS.find(v => v.id === id)?.nome || id;
}

function descricaoVersaoBiblia(id) {
    return BETHESDA_BIBLE_VERSIONS.find(v => v.id === id)?.descricao || "";
}

function renderizarControleVersoesBiblia(titulo = "Traduções selecionadas") {
    const selecionadas = new Set(obterVersoesSelecionadasBiblia());

    return `
        <div class="translation-picker">
            <div class="section-heading">
                <span class="premium-badge">Bíblias</span>
                <h3>${escaparHtml(titulo)}</h3>
            </div>

            <p class="muted">Escolha até 3 versões para comparar no leitor e na Bethesda AI.</p>

            <div class="translation-grid">
                ${BETHESDA_BIBLE_VERSIONS.map(versao => {
                    const checked = selecionadas.has(versao.id) ? "checked" : "";
                    return `
                        <label class="translation-option">
                            <input type="checkbox" data-bethesda-version="${escaparHtml(versao.id)}" value="${escaparHtml(versao.id)}" ${checked}>
                            <span class="translation-option-box">
                                <strong>${escaparHtml(versao.nome)}</strong>
                                <small>${escaparHtml(versao.descricao)}</small>
                            </span>
                        </label>
                    `;
                }).join("")}
            </div>

            <div class="page-actions page-actions-left">
                <button class="btn-voltar" onclick="salvarVersoesSelecionadasBibliaUI()">Salvar versões</button>
            </div>
        </div>
    `;
}

function salvarVersoesSelecionadasBibliaUI() {
    const selecionadas = [...document.querySelectorAll("[data-bethesda-version]")]
        .filter(input => input.checked)
        .map(input => input.value)
        .slice(0, 3);

    definirVersoesSelecionadasBiblia(selecionadas);
    alert("Versões bíblicas salvas!");

    if (typeof window.__bethesdaAtualizadorVersoes === "function") {
        window.__bethesdaAtualizadorVersoes();
    }
}

function normalizarVersiculoApi(item, indicePadrao = 1) {
    if (typeof item === "string") {
        return { number: indicePadrao, text: item };
    }

    return {
        number: item?.number || item?.verse || item?.numero || indicePadrao,
        text: item?.text || item?.content || item?.verse || item?.texto || ""
    };
}

function extrairVersiculosRespostaApi(payload) {
    if (!payload) return [];

    const candidatos = [
        payload.verses,
        payload.data?.verses,
        payload.chapter?.verses,
        payload.data?.chapter?.verses,
        payload.data,
        payload.result?.verses
    ];

    for (const candidato of candidatos) {
        if (Array.isArray(candidato) && candidato.length > 0) {
            return candidato.map((item, indice) => normalizarVersiculoApi(item, indice + 1));
        }
    }

    if (typeof payload === "object") {
        if (payload.text || payload.content) {
            return [normalizarVersiculoApi(payload, 1)];
        }

        if (payload.verse || payload.numero) {
            return [normalizarVersiculoApi(payload, 1)];
        }
    }

    return [];
}

async function carregarCapituloVersao(versaoId, livroAbrev, capitulo) {
    const chave = `${versaoId}:${livroAbrev}:${capitulo}`;
    if (capitulosVersaoCache.has(chave)) {
        return capitulosVersaoCache.get(chave);
    }

    const versaoLabel = nomeVersaoBiblia(versaoId);

    try {
        if (versaoId === "local") {
            const biblia = await carregarBiblia();
            const livro = biblia.find(item => normalizarTexto(item.abbrev || item.abrev || "") === normalizarTexto(livroAbrev));

            if (!livro || !Array.isArray(livro.chapters)) {
                throw new Error("Livro não encontrado na Bíblia local.");
            }

            const cap = livro.chapters[capitulo - 1] || [];
            const resultadoLocal = {
                versao: versaoId,
                nomeVersao: versaoLabel,
                livroAbrev,
                capitulo,
                versiculos: cap.map(texto => String(texto || ""))
            };

            capitulosVersaoCache.set(chave, resultadoLocal);
            return resultadoLocal;
        }

        const resposta = await fetch(`${BETHESDA_API_BASE}/verses/${versaoId}/${livroAbrev}/${capitulo}`);
        if (!resposta.ok) {
            throw new Error(`Falha ao carregar ${versaoLabel}.`);
        }

        const payload = await resposta.json();
        const versiculos = extrairVersiculosRespostaApi(payload).map(item => item.text || "").filter(Boolean);

        if (!versiculos.length) {
            throw new Error(`A API não retornou versículos para ${versaoLabel}.`);
        }

        const resultadoApi = {
            versao: versaoId,
            nomeVersao: versaoLabel,
            livroAbrev,
            capitulo,
            versiculos
        };

        capitulosVersaoCache.set(chave, resultadoApi);
        return resultadoApi;
    } catch (erro) {
        console.warn(erro);
        return null;
    }
}

async function carregarReferenciaVersoesBiblica(referenciaInfo, versoes = obterVersoesSelecionadasBiblia()) {
    if (!referenciaInfo?.livroAbrev || !referenciaInfo?.capitulo || !referenciaInfo?.versiculo) {
        return [];
    }

    const versoesValidas = (versoes.length ? versoes : obterVersoesSelecionadasBiblia()).slice(0, 3);
    const carregadas = await Promise.all(versoesValidas.map(async versao => {
        const capitulo = await carregarCapituloVersao(versao, referenciaInfo.livroAbrev, referenciaInfo.capitulo);
        if (!capitulo || !Array.isArray(capitulo.versiculos)) {
            return null;
        }

        const texto = capitulo.versiculos[referenciaInfo.versiculo - 1] || "";
        return {
            id: versao,
            versao,
            nomeVersao: capitulo.nomeVersao || nomeVersaoBiblia(versao),
            referencia: referenciaInfo.referencia,
            capitulo: referenciaInfo.capitulo,
            versiculo: referenciaInfo.versiculo,
            texto
        };
    }));

    return carregadas.filter(Boolean);
}

async function carregarCapituloComparado(livroAbrev, capitulo, versoes = obterVersoesSelecionadasBiblia()) {
    const versoesValidas = (versoes.length ? versoes : obterVersoesSelecionadasBiblia()).slice(0, 3);
    const carregadas = await Promise.all(versoesValidas.map(async versao => {
        const cap = await carregarCapituloVersao(versao, livroAbrev, capitulo);
        if (!cap) return null;

        return {
            id: versao,
            versao,
            nomeVersao: cap.nomeVersao || nomeVersaoBiblia(versao),
            livroAbrev,
            capitulo,
            texto: cap.versiculos.map((texto, indice) => `${indice + 1}. ${texto}`).join("\n\n")
        };
    }));

    return carregadas.filter(Boolean);
}

function renderizarComparacaoBiblica({ titulo = "Comparação de traduções", subtitulo = "", itens = [] } = {}) {
    if (!Array.isArray(itens) || !itens.length) {
        return "";
    }

    return `
        <section class="report-card report-card-wide comparison-card">
            <div class="section-heading">
                <span class="premium-badge">Comparação</span>
                <h3>${escaparHtml(titulo)}</h3>
            </div>

            ${subtitulo ? `<p class="muted">${escaparHtml(subtitulo)}</p>` : ""}

            <div class="compare-grid">
                ${itens.map(item => `
                    <article class="translation-card">
                        <div class="card-topline">
                            <span class="badge-pill">${escaparHtml(item.nomeVersao || item.versao || "Versão")}</span>
                            ${item.capitulo ? `<span class="badge-pill">Cap. ${escaparHtml(String(item.capitulo))}</span>` : ""}
                        </div>
                        ${item.referencia ? `<h4>${escaparHtml(item.referencia)}</h4>` : ""}
                        <p>${escaparHtml(item.texto || "")}</p>
                    </article>
                `).join("")}
            </div>
        </section>
    `;
}

async function resolverReferenciaBiblica(referencia = "") {
    const texto = String(referencia || "").trim();
    const match = texto.match(/^(.+?)\s+(\d+):(\d+)$/);

    if (!match) {
        return null;
    }

    const nomeLivro = match[1].trim();
    const capitulo = parseInt(match[2], 10);
    const versiculo = parseInt(match[3], 10);
    const livros = await carregarLivros();
    const livroInfo = livros.find(item =>
        normalizarTexto(item.nome || "") === normalizarTexto(nomeLivro) ||
        normalizarTexto(item.abrev || "") === normalizarTexto(nomeLivro)
    );

    if (!livroInfo) {
        return null;
    }

    return {
        livroInfo,
        livroAbrev: livroInfo.abrev,
        capitulo,
        versiculo,
        referencia: `${livroInfo.nome} ${capitulo}:${versiculo}`
    };
}

window.BETHESDA_BIBLE_VERSIONS = BETHESDA_BIBLE_VERSIONS;
window.obterVersoesDisponiveisBiblia = obterVersoesDisponiveisBiblia;
window.obterVersoesSelecionadasBiblia = obterVersoesSelecionadasBiblia;
window.definirVersoesSelecionadasBiblia = definirVersoesSelecionadasBiblia;
window.nomeVersaoBiblia = nomeVersaoBiblia;
window.descricaoVersaoBiblia = descricaoVersaoBiblia;
window.renderizarControleVersoesBiblia = renderizarControleVersoesBiblia;
window.salvarVersoesSelecionadasBibliaUI = salvarVersoesSelecionadasBibliaUI;
window.carregarCapituloVersao = carregarCapituloVersao;
window.carregarReferenciaVersoesBiblica = carregarReferenciaVersoesBiblica;
window.carregarCapituloComparado = carregarCapituloComparado;
window.renderizarComparacaoBiblica = renderizarComparacaoBiblica;
window.resolverReferenciaBiblica = resolverReferenciaBiblica;
