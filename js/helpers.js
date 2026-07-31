function normalizarTexto(texto = "") {
    return String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function escaparHtml(texto = "") {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function jsLiteralString(valor = "") {
    return `'${String(valor)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/\r?\n/g, "\\n")}'`;
}

function mostrarDashboard() {
    const dashboard = document.querySelector(".dashboard");
    const pagina = document.getElementById("pagina");

    if (dashboard) dashboard.style.display = "flex";
    if (pagina) pagina.style.display = "none";
}

function mostrarPagina() {
    const dashboard = document.querySelector(".dashboard");
    const pagina = document.getElementById("pagina");

    if (dashboard) dashboard.style.display = "none";
    if (pagina) pagina.style.display = "block";
}

function voltarDashboard() {
    mostrarDashboard();
}

function abrirPaginaHTML(html) {
    const pagina = document.getElementById("pagina");
    if (!pagina) return;

    mostrarPagina();
    pagina.innerHTML = html;
}

function obterSlugLivro(nome) {
    return normalizarTexto(nome);
}

function extrairTemaPergunta(pergunta = "") {
    const texto = normalizarTexto(pergunta);

    const mapa = [
        { tema: "fé", termos: ["fe", "crer", "confiar", "confianca", "confianca em deus", "impossivel"] },
        { tema: "graça", termos: ["graca", "favor imerecido", "salvos pela graca"] },
        { tema: "salvação", termos: ["salvacao", "salvo", "redenção", "redencao", "novo nascimento"] },
        { tema: "oração", termos: ["oracao", "orar", "rezar", "clamor", "intercessao"] },
        { tema: "adoração", termos: ["adoracao", "adorar", "louvor"] },
        { tema: "espírito santo", termos: ["espirito santo", "espirito", "pentecoste", "dons", "unção", "uncao"] },
        { tema: "arrependimento", termos: ["arrependimento", "arrependa", "converter", "conversao", "voltar-se"] },
        { tema: "amor", termos: ["amor", "amar", "agape", "agap"] },
        { tema: "paz", termos: ["paz", "descanso", "tranquilidade"] },
        { tema: "esperança", termos: ["esperanca", "esperança", "esperar", "esperanca viva"] },
        { tema: "santidade", termos: ["santidade", "santo", "consagr", "separado"] },
        { tema: "justiça", termos: ["justica", "justiça", "retidao", "retidão"] },
        { tema: "sabedoria", termos: ["sabedoria", "sábio", "sabio", "entendimento"] },
        { tema: "força", termos: ["forca", "força", "fortale", "poder", "vigor"] },
        { tema: "perdão", termos: ["perdao", "perdão", "perdoar", "perdoado"] },
        { tema: "reino", termos: ["reino", "reinado", "reinar", "reino de deus"] },
        { tema: "testemunho", termos: ["testemunho", "testemunhar", "missao", "missão"] },
        { tema: "família", termos: ["familia", "família", "casamento", "filho", "pai", "mae", "mãe"] },
        { tema: "liderança", termos: ["lider", "liderança", "lideranca", "governo", "direção", "direcao"] }
    ];

    const encontrado = mapa.find(item => item.termos.some(termo => texto.includes(termo)));
    return encontrado ? encontrado.tema : null;
}

function extrairPalavrasChaveTexto(texto = "", limite = 6) {
    const palavrasIgnoradas = new Set([
        "a","o","e","de","da","do","das","dos","em","um","uma","para","por","com","sem","ao","aos","as","os","na","no","nas","nos",
        "que","se","como","quando","onde","porque","pois","eu","tu","ele","ela","nos","vos","eles","elas","me","te","lhe","lhes",
        "ser","estar","ter","haver","mais","menos","muito","pouco","sobre","entre","já","não","sim","também","sua","seu","sua","seus","suas"
    ]);

    const palavras = normalizarTexto(texto)
        .replace(/[^a-z0-9\u00c0-\u024f\s-]/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .filter(p => p.length > 2 && !palavrasIgnoradas.has(p));

    const frequencia = new Map();
    for (const palavra of palavras) {
        frequencia.set(palavra, (frequencia.get(palavra) || 0) + 1);
    }

    return [...frequencia.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limite)
        .map(([palavra]) => palavra);
}

async function abrirReferenciaBiblica(referencia) {
    if (typeof carregarLivros !== "function" || typeof abrirCapitulo !== "function") {
        alert("O leitor bíblico ainda está carregando.");
        return;
    }

    const ref = String(referencia).trim();
    const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);

    if (!match) {
        alert("Referência inválida.");
        return;
    }

    const nomeLivro = match[1].trim();
    const capitulo = parseInt(match[2], 10);
    const versiculo = parseInt(match[3], 10);

    const livros = await carregarLivros();
    const livro = livros.find(item => normalizarTexto(item.nome) === normalizarTexto(nomeLivro));

    if (!livro) {
        alert("Livro não encontrado.");
        return;
    }

    abrirCapitulo(livro.abrev, capitulo, versiculo);
}

async function buscarVersiculosPorTermo(termo, limite = 8) {
    const biblia = await carregarBiblia();
    const normalizado = normalizarTexto(termo);
    const resultados = [];

    for (const livro of biblia) {
        for (let i = 0; i < livro.chapters.length; i++) {
            for (let j = 0; j < livro.chapters[i].length; j++) {
                const versiculo = livro.chapters[i][j];
                if (normalizarTexto(versiculo).includes(normalizado)) {
                    resultados.push({
                        livro: livro.name,
                        abrev: livro.abbrev,
                        capitulo: i + 1,
                        versiculo: j + 1,
                        texto: versiculo
                    });
                    if (resultados.length >= limite) return resultados;
                }
            }
        }
    }

    return resultados;
}

function criarTag(texto) {
    return `<span class="tag">${escaparHtml(texto)}</span>`;
}

window.normalizarTexto = normalizarTexto;
window.escaparHtml = escaparHtml;
window.mostrarDashboard = mostrarDashboard;
window.mostrarPagina = mostrarPagina;
window.voltarDashboard = voltarDashboard;
window.abrirPaginaHTML = abrirPaginaHTML;
window.abrirReferenciaBiblica = abrirReferenciaBiblica;
window.criarTag = criarTag;
window.buscarVersiculosPorTermo = buscarVersiculosPorTermo;
window.extrairTemaPergunta = extrairTemaPergunta;
window.extrairPalavrasChaveTexto = extrairPalavrasChaveTexto;
