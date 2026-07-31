const HISTORICO_AI_KEY = "bethesdaAIHistoricoPremium";

const INSIGHTS_ORIGINAIS_FALLBACK = [
    {
        tema: "fé",
        termo: "πίστις",
        transliteracao: "pistis",
        hebraico: "אֱמוּנָה",
        significado: "confiança obediente em Deus, mesmo antes de ver o resultado",
        referencias: ["Hebreus 11:1", "Romanos 10:17", "2 Coríntios 5:7"]
    },
    {
        tema: "graça",
        termo: "χάρις",
        transliteracao: "charis",
        hebraico: "חֵן",
        significado: "favor imerecido concedido por Deus",
        referencias: ["Efésios 2:8-9", "Romanos 3:24", "Tito 2:11-12"]
    },
    {
        tema: "salvação",
        termo: "σωτηρία",
        transliteracao: "sōtēria",
        hebraico: "יְשׁוּעָה",
        significado: "libertação, resgate e restauração operados por Deus",
        referencias: ["João 3:16", "Atos 4:12", "Romanos 10:9-10"]
    },
    {
        tema: "oração",
        termo: "προσευχή",
        transliteracao: "proseuchē",
        hebraico: "תְּפִלָּה",
        significado: "comunhão reverente e dependente com Deus",
        referencias: ["Mateus 6:6", "Filipenses 4:6-7", "1 Tessalonicenses 5:17"]
    },
    {
        tema: "adoração",
        termo: "προσκυνέω",
        transliteracao: "proskyneō",
        hebraico: "שָׁחָה",
        significado: "rendição reverente diante da majestade de Deus",
        referencias: ["João 4:23-24", "Salmos 95:6", "Romanos 12:1"]
    },
    {
        tema: "arrependimento",
        termo: "μετάνοια",
        transliteracao: "metanoia",
        hebraico: "תְּשׁוּבָה",
        significado: "mudança de mente e de direção que produz retorno a Deus",
        referencias: ["Atos 3:19", "Marcos 1:15", "2 Coríntios 7:10"]
    },
    {
        tema: "amor",
        termo: "ἀγάπη",
        transliteracao: "agapē",
        hebraico: "אַהֲבָה",
        significado: "amor sacrificial, intencional e santo",
        referencias: ["1 Coríntios 13", "João 13:34-35", "1 João 4:8-10"]
    },
    {
        tema: "paz",
        termo: "εἰρήνη",
        transliteracao: "eirēnē",
        hebraico: "שָׁלוֹם",
        significado: "plenitude, ordem e descanso concedidos por Deus",
        referencias: ["João 14:27", "Filipenses 4:7", "Números 6:24-26"]
    },
    {
        tema: "sabedoria",
        termo: "σοφία",
        transliteracao: "sophia",
        hebraico: "חָכְמָה",
        significado: "habilidade espiritual de viver segundo a vontade de Deus",
        referencias: ["Tiago 1:5", "Provérbios 2:6", "Efésios 1:17"]
    },
    {
        tema: "esperança",
        termo: "ἐλπίς",
        transliteracao: "elpis",
        hebraico: "תִּקְוָה",
        significado: "expectativa confiante na fidelidade divina",
        referencias: ["Romanos 15:13", "Hebreus 6:19", "1 Pedro 1:3"]
    },
    {
        tema: "santidade",
        termo: "ἁγιασμός",
        transliteracao: "hagiasmos",
        hebraico: "קֹדֶשׁ",
        significado: "separação para Deus e conformidade ao Seu caráter",
        referencias: ["1 Pedro 1:15-16", "Hebreus 12:14", "1 Tessalonicenses 4:3"]
    },
    {
        tema: "justiça",
        termo: "δικαιοσύνη",
        transliteracao: "dikaiosynē",
        hebraico: "צְדָקָה",
        significado: "retidão, veredito e vida alinhada ao padrão de Deus",
        referencias: ["Mateus 6:33", "Romanos 1:17", "Miquéias 6:8"]
    },
    {
        tema: "força",
        termo: "δύναμις",
        transliteracao: "dynamis",
        hebraico: "כֹּחַ",
        significado: "poder capacitando a vida e o serviço",
        referencias: ["Atos 1:8", "Isaías 40:29", "2 Coríntios 12:9"]
    },
    {
        tema: "palavra",
        termo: "λόγος",
        transliteracao: "logos",
        hebraico: "דָּבָר",
        significado: "mensagem, expressão e revelação divina",
        referencias: ["João 1:1", "Hebreus 4:12", "Salmos 119:105"]
    },
    {
        tema: "aliança",
        termo: "διαθήκη",
        transliteracao: "diathēkē",
        hebraico: "בְּרִית",
        significado: "pacto estabelecido por Deus com Seu povo",
        referencias: ["Gênesis 15", "Jeremias 31:31-34", "Lucas 22:20"]
    },
    {
        tema: "espírito santo",
        termo: "πνεῦμα",
        transliteracao: "pneuma",
        hebraico: "רוּחַ",
        significado: "a presença pessoal de Deus que consola, convence e capacita",
        referencias: ["João 14:26", "Atos 1:8", "Romanos 8:14-16"]
    },
    {
        tema: "nova vida",
        termo: "καινὴ κτίσις",
        transliteracao: "kainē ktisis",
        hebraico: "בְּרִיאָה חֲדָשָׁה",
        significado: "realidade renovada em Cristo",
        referencias: ["2 Coríntios 5:17", "Romanos 6:4", "Efésios 4:22-24"]
    }
];

function extrairReferenciaBiblicaTexto(pergunta = "") {
    const texto = String(pergunta).trim();
    const padrao = /((?:[1-3]\s*)?[A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)*)\s+(\d+):(\d+)/;
    const match = texto.match(padrao);

    if (!match) {
        return null;
    }

    return {
        livro: match[1].trim(),
        capitulo: parseInt(match[2], 10),
        versiculo: parseInt(match[3], 10)
    };
}

function detectarIntencaoPergunta(pergunta) {
    const texto = normalizarTexto(pergunta);

    if (texto.includes("sermao") || texto.includes("pregacao") || texto.includes("pregação") || texto.includes("esboco") || texto.includes("esboço")) return "sermao";
    if (texto.includes("devocional") || texto.includes("meditacao") || texto.includes("meditação")) return "devocional";
    if (texto.includes("personagem") || texto.includes("biografia")) return "personagem";
    if (texto.includes("comparar") || texto.includes("comparacao") || texto.includes("comparação")) return "comparacao";
    if (texto.includes("contexto") || texto.includes("historico") || texto.includes("histórico")) return "contexto";
    if (texto.includes("estudo") || texto.includes("exposicao") || texto.includes("exposição") || texto.includes("profundo") || texto.includes("completo")) return "estudo";
    if (texto.includes("oração") || texto.includes("oracao")) return "oracao";
    if (texto.includes("texto") || texto.includes("passagem") || texto.includes("biblico") || texto.includes("bíblico")) return "texto";
    return "geral";
}

function pontuarEstudoRelacionado(pergunta, estudo) {
    const texto = normalizarTexto(pergunta);
    const referencia = extrairReferenciaBiblicaTexto(pergunta);
    const campos = [
        estudo.titulo,
        estudo.categoria,
        estudo.referencia,
        estudo.resumo,
        estudo.contexto,
        estudo.objetivo,
        estudo.destaque,
        ...(estudo.palavrasChave || []),
        ...(estudo.personagens || []),
        ...(estudo.versiculosChave || []),
        ...(estudo.leituraComplementar || [])
    ].map(campo => normalizarTexto(campo || ""));

    let score = 0;
    const referenciaEstudo = normalizarTexto(estudo.referencia || "");

    if (referencia && referenciaEstudo) {
        const referenciaConsulta = normalizarTexto(`${referencia.livro} ${referencia.capitulo}:${referencia.versiculo}`);
        if (referenciaEstudo === referenciaConsulta) score += 200;
        if (referenciaEstudo.includes(referenciaConsulta) || referenciaConsulta.includes(referenciaEstudo)) score += 140;
        if ((estudo.versiculosChave || []).some(item => normalizarTexto(item).includes(referenciaConsulta) || referenciaConsulta.includes(normalizarTexto(item)))) score += 160;
        if ((estudo.leituraComplementar || []).some(item => normalizarTexto(item).includes(referenciaConsulta))) score += 60;
    }

    const palavrasPergunta = texto.split(/\s+/).filter(Boolean);
    const tokensEstudo = campos.flatMap(campo => campo.split(/\s+/).filter(Boolean));

    for (const palavra of palavrasPergunta) {
        if (!palavra || palavra.length < 3) continue;
        if (campos.some(campo => campo.includes(palavra))) score += 6;
        if (texto.includes(palavra)) score += 3;
        if (tokensEstudo.includes(palavra)) score += 2;
    }

    const palavrasChave = [
        ...(estudo.palavrasChave || []),
        ...(estudo.personagens || []),
        ...(estudo.versiculosChave || [])
    ].map(item => normalizarTexto(item || ""));

    palavrasChave.forEach(item => {
        if (item && (texto.includes(item) || item.includes(texto))) score += 5;
    });

    if (campos.some(campo => campo.includes(texto) || texto.includes(campo))) score += 25;

    return score;
}

function encontrarEstudoRelacionadoPorReferencia(referencia, estudos = []) {
    const alvo = normalizarTexto(referencia || "");
    if (!alvo) return null;

    let melhor = null;
    let maiorScore = 0;

    estudos.forEach(estudo => {
        const score = pontuarEstudoRelacionado(referencia, estudo) + (
            normalizarTexto(estudo.referencia || "").includes(alvo) || alvo.includes(normalizarTexto(estudo.referencia || "")) ? 90 : 0
        );

        if (score > maiorScore) {
            maiorScore = score;
            melhor = estudo;
        }
    });

    return maiorScore > 0 ? melhor : null;
}

function encontrarEstudoRelacionado(pergunta, estudos = []) {
    const texto = normalizarTexto(pergunta);
    let melhor = null;
    let maiorScore = 0;

    estudos.forEach(estudo => {
        const score = pontuarEstudoRelacionado(pergunta, estudo);
        if (score > maiorScore) {
            maiorScore = score;
            melhor = estudo;
        }
    });

    if (melhor) {
        return melhor;
    }

    if (texto) {
        return estudos.find(estudo => {
            const campos = [
                estudo.titulo,
                estudo.categoria,
                estudo.referencia,
                estudo.resumo,
                estudo.contexto,
                estudo.objetivo,
                ...(estudo.palavrasChave || []),
                ...(estudo.personagens || []),
                ...(estudo.versiculosChave || [])
            ];

            return campos.some(campo => {
                const normalizado = normalizarTexto(campo || "");
                return normalizado.includes(texto) || texto.includes(normalizado);
            });
        }) || null;
    }

    return null;
}

function encontrarPersonagemRelacionado(pergunta, pessoas = []) {
    const texto = normalizarTexto(pergunta);

    return pessoas.find(personagem => {
        const campos = [
            personagem.nome,
            personagem.titulo,
            personagem.descricao,
            personagem.versiculo,
            ...(personagem.principaisEventos || [])
        ];

        return campos.some(campo => {
            const normalizado = normalizarTexto(campo || "");
            return normalizado.includes(texto) || texto.includes(normalizado);
        });
    }) || null;
}

function selecionarTermosStrong(pergunta, tema, lexicon = []) {
    const texto = normalizarTexto(pergunta);
    const alvo = normalizarTexto(tema || "");

    const relevantes = lexicon.filter(item => {
        const campos = [
            item.termo,
            item.tema,
            item.significado,
            item.grego,
            item.hebraico,
            item.transliteracao,
            ...(item.referencias || [])
        ].map(campo => normalizarTexto(campo || ""));

        return campos.some(campo =>
            campo.includes(alvo) ||
            alvo.includes(campo) ||
            campo.includes(texto) ||
            texto.includes(campo)
        );
    });

    if (relevantes.length > 0) {
        return relevantes.slice(0, 6);
    }

    return lexicon.slice(0, 4);
}

function gerarEstruturaEsboco(tipo, tema, referenciaTexto) {
    const base = referenciaTexto ? `em ${referenciaTexto}` : `sobre ${tema}`;

    if (tipo === "sermao") {
        return [
            `Introdução poderosa: apresente a verdade central ${base}.`,
            `Exposição textual: explique o movimento do texto e o problema que ele confronta.`,
            `Cristo e a redenção: mostre como a mensagem aponta para a obra de Deus.`,
            `Aplicação pastoral: chame a igreja à fé, arrependimento e obediência.`,
            `Conclusão com apelo: conduza o ouvinte à resposta prática diante de Deus.`
        ];
    }

    if (tipo === "devocional") {
        return [
            `Leitura devocional ${base}.`,
            `Meditação: o que este texto revela sobre Deus e sobre mim?`,
            `Rendição: qual atitude precisa mudar hoje?`,
            `Oração: transforme a verdade em conversa sincera com Deus.`
        ];
    }

    if (tipo === "comparacao") {
        return [
            `Compare o tema ${tema} em diferentes momentos da história bíblica.`,
            `Observe semelhanças, contrastes e desenvolvimento progressivo da revelação.`,
            `Mostre a unidade da Escritura sem perder o contexto de cada passagem.`,
            `Feche com uma síntese cristocêntrica e pastoral.`
        ];
    }

    return [
        `1. O que o texto revela sobre o caráter de Deus?`,
        `2. O que o texto mostra sobre a condição humana ${base}?`,
        `3. Qual é a promessa, ordem ou correção principal do texto?`,
        `4. Como aplicar hoje esta verdade de forma prática e espiritual?`,
        `5. O que este texto aponta para Cristo e para a missão da igreja?`
    ];
}

function gerarAplicacoes(tipo, tema, palavras, publico = "Geral") {
    const baseTema = tema || "o texto";
    const kw = palavras[0] ? `, especialmente em ${palavras[0]}` : "";
    const publicoTexto = normalizarTexto(publico);

    if (tipo === "devocional") {
        return [
            `Separe alguns minutos para ler ${baseTema}${kw} em oração e silêncio.`,
            "Pergunte ao Senhor o que Ele quer corrigir no seu coração hoje.",
            "Transforme a verdade principal em uma decisão prática ainda hoje.",
            "Compartilhe com alguém uma aplicação que fortaleça a fé."
        ];
    }

    if (publicoTexto.includes("jovens")) {
        return [
            `Mostre como ${baseTema} responde às perguntas reais dos jovens.`,
            "Conecte o texto com identidade, propósito e santidade no cotidiano.",
            "Aponte escolhas concretas: amizades, internet, mente e futuro.",
            "Leve os jovens a uma resposta de fé, coragem e coerência."
        ];
    }

    if (publicoTexto.includes("lider")) {
        return [
            `Aplique ${baseTema} à liderança servidora e ao cuidado do rebanho.`,
            "Mostre como o líder aprende a ouvir, servir e corrigir com graça e verdade.",
            "Aponte decisões de governo espiritual, caráter e visão.",
            "Convide líderes a modelar o texto antes de ensinar o texto."
        ];
    }

    return [
        `Leia o texto em seu contexto imediato e observe o argumento principal.`,
        `Identifique uma verdade central sobre ${baseTema}${kw} e anote em uma frase.`,
        `Converta a exposição bíblica em obediência prática durante esta semana.`,
        "Ore para que a Palavra produza transformação real, e não apenas informação."
    ];
}

function gerarPerguntasAvancadas(tema, tipo, publico) {
    const público = publico || "o ouvinte";
    const base = tema || "o texto";

    if (tipo === "sermao") {
        return [
            `Que atitude do ${público} precisa mudar diante de ${base}?`,
            `Como este texto revela a fidelidade de Deus em meio à crise?`,
            `Qual resposta de fé o texto exige agora?`,
            `Que Cristo precisamos anunciar a partir desta passagem?`
        ];
    }

    return [
        `O que o texto ensina sobre Deus?`,
        `O que o texto confronta no coração humano?`,
        `Qual é a ponte entre a exegese e a aplicação?`,
        `Como transformar essa verdade em discipulado prático?`
    ];
}

function gerarPlanoLeitura(tema, referenciaInfo) {
    const referencia = referenciaInfo?.referencia || tema || "o texto";
    return [
        `Dia 1 — Leia ${referencia} lentamente e destaque palavras repetidas.`,
        `Dia 2 — Observe o contexto imediato e o contexto mais amplo do livro.`,
        `Dia 3 — Leia referências cruzadas ligadas ao tema de ${tema || "fé"}.`,
        "Dia 4 — Escreva aplicações para vida pessoal, família e igreja.",
        "Dia 5 — Ore com base no texto e compartilhe o estudo com alguém."
    ];
}

function gerarInsightsOriginais(tema, strongTermos = []) {
    const alvo = normalizarTexto(tema || "");
    const relevantes = strongTermos.filter(item => {
        const campos = [
            item.termo,
            item.tema,
            item.significado,
            item.grego,
            item.hebraico,
            item.transliteracao,
            ...(item.referencias || [])
        ].map(campo => normalizarTexto(campo || ""));

        return campos.some(campo => campo.includes(alvo) || alvo.includes(campo));
    });

    if (relevantes.length > 0) {
        return relevantes.slice(0, 4);
    }

    return INSIGHTS_ORIGINAIS_FALLBACK.filter(item => {
        const chave = normalizarTexto(item.tema);
        return alvo.includes(chave) || chave.includes(alvo);
    }).slice(0, 4);
}

async function localizarReferenciaCompleta(referencia) {
    const match = String(referencia || "").trim().match(/^(.+?)\s+(\d+):(\d+)$/);
    if (!match) {
        return null;
    }

    const nomeLivro = match[1].trim();
    const capitulo = parseInt(match[2], 10);
    const versiculo = parseInt(match[3], 10);

    const livros = await carregarLivros();
    const livroInfo = livros.find(item =>
        normalizarTexto(item.nome) === normalizarTexto(nomeLivro) ||
        normalizarTexto(item.abrev) === normalizarTexto(nomeLivro)
    );

    if (!livroInfo) {
        return null;
    }

    const biblia = await carregarBiblia();
    const livroBiblia = biblia.find(item => normalizarTexto(item.abbrev) === normalizarTexto(livroInfo.abrev));

    if (!livroBiblia || !Array.isArray(livroBiblia.chapters)) {
        return null;
    }

    const cap = livroBiblia.chapters[capitulo - 1] || [];
    const textoVersiculo = cap[versiculo - 1] || "";
    const inicio = Math.max(0, versiculo - 3);
    const fim = Math.min(cap.length, versiculo + 2);
    const contexto = cap.slice(inicio, fim).map((texto, idx) => ({
        numero: inicio + idx + 1,
        texto
    }));

    return {
        livroInfo,
        livroBiblia,
        livroAbrev: livroInfo.abrev,
        capitulo,
        versiculo,
        referencia: `${livroInfo.nome} ${capitulo}:${versiculo}`,
        textoVersiculo,
        contexto
    };
}

function carregarHistoricoAI() {
    try {
        return JSON.parse(localStorage.getItem(HISTORICO_AI_KEY) || "[]");
    } catch {
        return [];
    }
}

function salvarHistoricoAI(item) {
    const atual = carregarHistoricoAI();
    const filtrado = atual.filter(registro => registro.pergunta !== item.pergunta);
    const atualizado = [item, ...filtrado].slice(0, 8);
    localStorage.setItem(HISTORICO_AI_KEY, JSON.stringify(atualizado));
}

function limparHistoricoAI() {
    if (!confirm("Deseja limpar o histórico da Bethesda AI?")) {
        return;
    }

    localStorage.removeItem(HISTORICO_AI_KEY);
    renderizarHistoricoAI();
}

function renderizarHistoricoAI() {
    const lista = document.getElementById("aiHistoricoLista");
    if (!lista) return;

    const historico = carregarHistoricoAI();

    if (!historico.length) {
        lista.innerHTML = `
            <div class="history-empty">
                <p>Nenhum estudo salvo ainda.</p>
            </div>
        `;
        return;
    }

    lista.innerHTML = historico.map((item, indice) => `
        <div class="history-item" onclick="abrirHistoricoAI(${indice})">
            <strong>${escaparHtml(item.titulo || item.pergunta || "Estudo")}</strong>
            <span>${escaparHtml(item.modo || "estudo")} • ${escaparHtml(item.tema || "")}</span>
            <small>${escaparHtml(item.data || "")}</small>
        </div>
    `).join("");
}

function abrirHistoricoAI(indice) {
    const historico = carregarHistoricoAI();
    const item = historico[indice];

    if (!item) {
        return;
    }

    abrirBethesdaAI(item.pergunta || "", {
        modo: item.modo || "estudo",
        publico: item.publico || "Geral",
        profundidade: item.profundidade || "Profundo"
    });
}

function preencherPromptAI(prompt, modo = "estudo") {
    abrirBethesdaAI(prompt || "", { modo });
    setTimeout(() => processarPerguntaAI(), 60);
}

function copiarSaidaAI() {
    const area = document.getElementById("respostaAI");
    const texto = (window.__bethesdaAIUltimoTexto || area?.innerText || "").trim();

    if (!texto) {
        alert("Nenhum resultado para copiar.");
        return;
    }

    navigator.clipboard.writeText(texto);
    alert("Estudo copiado!");
}

function limparBethesdaAI() {
    const campo = document.getElementById("perguntaAI");
    const resposta = document.getElementById("respostaAI");

    if (campo) campo.value = "";
    if (resposta) {
        resposta.innerHTML = `
            <div class="empty-state">
                <p>Escreva sua pergunta e clique em “Gerar estudo premium”.</p>
            </div>
        `;
    }
    window.__bethesdaAIUltimoTexto = "";
    window.__bethesdaAIComparacaoTraducoes = [];
}

function htmlListaItens(items = [], className = "list") {
    return `<ul class="${className}">${items.map(item => `<li>${escaparHtml(item)}</li>`).join("")}</ul>`;
}

function renderizarBlocoOriginal(tema, strongTermos = []) {
    const insights = gerarInsightsOriginais(tema, strongTermos);

    if (!insights.length) {
        return `
            <section class="report-card">
                <h3>📜 Grego e Hebraico</h3>
                <p>Não foi possível identificar termos originais específicos para este tema.</p>
            </section>
        `;
    }

    return `
        <section class="report-card report-card-wide">
            <div class="section-heading">
                <span class="premium-badge">Núcleo do original</span>
                <h3>📜 Grego e Hebraico</h3>
            </div>

            <div class="report-grid report-grid-tight">
                ${insights.map(item => `
                    <article class="strong-card premium-strong">
                        <span class="badge-pill">${escaparHtml(item.tema || item.termo)}</span>
                        <h4>${escaparHtml(item.termo)}</h4>
                        <p><strong>Grego:</strong> ${escaparHtml(item.grego || "—")} <span class="muted">(${escaparHtml(item.transliteracao || "—")})</span></p>
                        <p><strong>Hebraico:</strong> ${escaparHtml(item.hebraico || "—")}</p>
                        <p>${escaparHtml(item.significado || "")}</p>
                        <div class="tag-row">
                            ${(item.referencias || []).map(ref => {
                                const refJs = jsLiteralString(ref);
                                return `<a href="#" class="tag tag-link" onclick="abrirReferencia(${refJs});return false;">${escaparHtml(ref)}</a>`;
                            }).join("")}
                        </div>
                    </article>
                `).join("")}
            </div>
        </section>
    `;
}

function renderizarVersiculoReferencia(referenciaInfo) {
    if (!referenciaInfo) return "";

    const contexto = referenciaInfo.contexto || [];
    const refJs = jsLiteralString(referenciaInfo.referencia);
    const comparacao = Array.isArray(window.__bethesdaAIComparacaoTraducoes) ? window.__bethesdaAIComparacaoTraducoes : [];

    return `
        <section class="report-card report-card-wide">
            <div class="section-heading">
                <span class="premium-badge">Texto base</span>
                <h3>📖 ${escaparHtml(referenciaInfo.referencia)}</h3>
            </div>

            <blockquote class="study-quote">${escaparHtml(referenciaInfo.textoVersiculo || "")}</blockquote>

            <div class="page-actions page-actions-left">
                <button class="btn-voltar" onclick="abrirReferenciaBiblica(${refJs})">Abrir na Bíblia</button>
                <button class="btn-voltar" onclick="copiarSaidaAI()">Copiar estudo</button>
            </div>

            <h4>Contexto imediato</h4>
            <ul>
                ${contexto.map(item => `<li><strong>${item.numero}.</strong> ${escaparHtml(item.texto)}</li>`).join("")}
            </ul>
        </section>

        ${comparacao.length > 1 && typeof renderizarComparacaoBiblica === "function" ? renderizarComparacaoBiblica({
            titulo: `Comparação de traduções — ${referenciaInfo.referencia}`,
            subtitulo: "Seleção ativa de traduções para comparar o mesmo texto.",
            itens: comparacao.map(item => ({
                nomeVersao: item.nomeVersao,
                capitulo: item.capitulo,
                referencia: `${referenciaInfo.referencia} • ${item.nomeVersao}`,
                texto: item.texto
            }))
        }) : ""}
    `;
}

function montarTextoCompartilhavel({
    pergunta,
    modo,
    publico,
    profundidade,
    tema,
    referenciaInfo,
    estudo,
    personagem,
    palavras,
    strongTermos,
    versiculosRelacionados
}) {
    const linhas = [];
    linhas.push(`Bethesda AI Premium — ${pergunta}`);
    linhas.push(`Modo: ${modo} | Público: ${publico} | Profundidade: ${profundidade}`);
    linhas.push(`Tema: ${tema}`);

    if (referenciaInfo) {
        linhas.push(`Texto base: ${referenciaInfo.referencia}`);
        linhas.push(`Versículo: ${referenciaInfo.textoVersiculo}`);
    }

    if (estudo) {
        linhas.push(`Estudo relacionado: ${estudo.titulo}`);
        linhas.push(`Resumo: ${estudo.resumo || ""}`);
    }

    if (personagem) {
        linhas.push(`Personagem relacionado: ${personagem.nome} — ${personagem.titulo || ""}`);
    }

    if (palavras?.length) {
        linhas.push(`Palavras-chave: ${palavras.join(", ")}`);
    }

    if (strongTermos?.length) {
        linhas.push(`Grego/Hebraico: ${strongTermos.map(item => item.termo).join(", ")}`);
    }

    if (versiculosRelacionados?.length) {
        linhas.push(`Versículos relacionados: ${versiculosRelacionados.slice(0, 6).map(item => `${item.livro} ${item.capitulo}:${item.versiculo}`).join(", ")}`);
    }

    return linhas.join("\n\n");
}

function renderizarSeletorAI() {
    return `
        <div class="ai-toolbar">
            <div class="ai-control">
                <label for="modoAI">Modo</label>
                <select id="modoAI">
                    <option value="estudo">Estudo completo</option>
                    <option value="sermao">Sermão expositivo</option>
                    <option value="devocional">Devocional</option>
                    <option value="comparacao">Comparação bíblica</option>
                    <option value="texto">Análise textual</option>
                    <option value="personagem">Personagem bíblico</option>
                </select>
            </div>

            <div class="ai-control">
                <label for="publicoAI">Público</label>
                <select id="publicoAI">
                    <option value="Geral">Geral</option>
                    <option value="Jovens">Jovens</option>
                    <option value="Liderança">Liderança</option>
                    <option value="Pequenos grupos">Pequenos grupos</option>
                    <option value="Novos convertidos">Novos convertidos</option>
                </select>
            </div>

            <div class="ai-control">
                <label for="profundidadeAI">Profundidade</label>
                <select id="profundidadeAI">
                    <option value="Essencial">Essencial</option>
                    <option value="Profundo" selected>Profundo</option>
                    <option value="Doutoral">Doutoral</option>
                    <option value="Premium">Premium</option>
                </select>
            </div>
        </div>

        <div class="card translation-picker-card" style="margin-top:18px;">
            ${typeof renderizarControleVersoesBiblia === "function" ? renderizarControleVersoesBiblia("Bíblias para comparação") : ""}
        </div>
    `;
}

function renderizarAcoesRapidas() {
    return `
        <div class="ai-suggestion-row">
            <button class="ai-suggestion" onclick="preencherPromptAI('Faça um estudo completo sobre fé', 'estudo')">Estudo completo</button>
            <button class="ai-suggestion" onclick="preencherPromptAI('Monte um sermão sobre João 17', 'sermao')">Sermão</button>
            <button class="ai-suggestion" onclick="preencherPromptAI('Faça um devocional sobre ansiedade', 'devocional')">Devocional</button>
            <button class="ai-suggestion" onclick="preencherPromptAI('Explique o personagem Abraão', 'personagem')">Personagem</button>
            <button class="ai-suggestion" onclick="preencherPromptAI('Explique João 3:16', 'texto')">Versículo</button>
            <button class="ai-suggestion" onclick="preencherPromptAI('Faça uma comparação entre fé e obras', 'comparacao')">Comparar</button>
        </div>
    `;
}

function renderizarCabecalhoRespostaAI(pergunta, modo, estudo, personagem, referenciaInfo, tema, publico, profundidade, strongTermos = [], versiculosRelacionados = []) {
    const tags = [
        `Modo: ${modo}`,
        `Público: ${publico}`,
        `Profundidade: ${profundidade}`,
        tema ? `Tema: ${tema}` : null,
        estudo ? `Estudo relacionado: ${estudo.titulo}` : null,
        personagem ? `Personagem: ${personagem.nome}` : null,
        referenciaInfo ? `Referência: ${referenciaInfo.referencia}` : null
    ].filter(Boolean);

    return `
        <div class="study-callout ai-callout">
            <span class="premium-badge">Resposta premium</span>
            <h2>${escaparHtml(pergunta)}</h2>
            <p>${escaparHtml(tags.join(" • "))}</p>
            <div class="study-chip-row">
                ${(strongTermos.slice(0, 4).map(item => `<span class="study-chip">${escaparHtml(item.termo)}</span>`)).join("")}
                ${(versiculosRelacionados.slice(0, 4).map(item => `<span class="study-chip">${escaparHtml(item.livro)} ${item.capitulo}:${item.versiculo}</span>`)).join("")}
            </div>
        </div>
    `;
}

function renderizarResumoExecutivo({ tema, tipo, publico, profundidade, referenciaInfo, estudo, personagem }) {
    const texto = referenciaInfo
        ? `O texto de ${referenciaInfo.referencia} abre uma leitura de ${tema} para ${publico.toLowerCase()}, em nível ${profundidade.toLowerCase()}.`
        : `O tema ${tema} é desenvolvido aqui com abordagem ${tipo}, em nível ${profundidade.toLowerCase()} para ${publico.toLowerCase()}.`;

    const complemento = estudo
        ? `Estudo relacionado: ${estudo.titulo}. ${estudo.resumo || ""}`
        : personagem
            ? `Personagem relacionado: ${personagem.nome}. ${personagem.descricao || ""}`
            : "A análise abaixo foi construída para ser útil na leitura, no ensino e na pregação.";

    return `
        <section class="report-card report-card-wide">
            <div class="section-heading">
                <span class="premium-badge">Resumo executivo</span>
                <h3>🧠 Visão geral do estudo</h3>
            </div>
            <p>${escaparHtml(texto)}</p>
            <p>${escaparHtml(complemento)}</p>
        </section>
    `;
}

function renderizarPanorama({ referenciaInfo, estudo, personagem, tema }) {
    const blocos = [];

    if (referenciaInfo) {
        blocos.push(`Referência central: ${referenciaInfo.referencia}.`);
        blocos.push(`Texto observado: ${referenciaInfo.textoVersiculo || ""}`);
        if (referenciaInfo.contexto?.length) {
            blocos.push(`Contexto imediato: ${referenciaInfo.contexto.map(item => `${item.numero} (${item.texto})`).join(" | ")}`);
        }
    } else {
        blocos.push(`Tema principal: ${tema}.`);
        blocos.push("Leia a Escritura a partir do caráter de Deus e da resposta humana.");
    }

    if (estudo) {
        blocos.push(`Contexto didático: ${estudo.contexto || ""}`);
        blocos.push(`Objetivo: ${estudo.objetivo || ""}`);
    }

    if (personagem) {
        blocos.push(`Personagem: ${personagem.nome} — ${personagem.titulo || ""}`);
        blocos.push(personagem.descricao || "");
    }

    return `
        <section class="report-card">
            <div class="section-heading">
                <span class="premium-badge">Panorama</span>
                <h3>📚 Contexto e leitura</h3>
            </div>
            ${htmlListaItens(blocos.filter(Boolean), "report-list")}
        </section>
    `;
}

function renderizarExegese({ tipo, tema, referenciaInfo, estudo, palavras }) {
    const base = referenciaInfo?.referencia || estudo?.referencia || tema;
    const itens = gerarEstruturaEsboco(tipo, tema, base).slice(0, 4);

    const observacoes = [
        `Observe o verbo central, o sujeito da ação e a resposta exigida.`,
        `Analise a progressão do argumento bíblico sem sair do contexto imediato.`,
        `Aponte a tensão teológica e a solução apresentada pelo texto.`,
        palavras?.length ? `Palavras-chave observadas: ${palavras.join(", ")}.` : `Palavras-chave do tema: ${tema}.`
    ];

    return `
        <section class="report-card">
            <div class="section-heading">
                <span class="premium-badge">Exegese</span>
                <h3>🔍 Movimento do texto</h3>
            </div>
            <ol class="report-list">
                ${itens.map(item => `<li>${escaparHtml(item)}</li>`).join("")}
            </ol>
            <div class="study-quote">${escaparHtml(observacoes.join(" "))}</div>
        </section>
    `;
}

function renderizarAplicacoes({ tipo, tema, palavras, publico }) {
    return `
        <section class="report-card">
            <div class="section-heading">
                <span class="premium-badge">Aplicação</span>
                <h3>🪄 Pontes práticas</h3>
            </div>
            ${htmlListaItens(gerarAplicacoes(tipo, tema, palavras, publico), "report-list")}
        </section>
    `;
}

function renderizarPerguntas({ tema, tipo, publico }) {
    return `
        <section class="report-card">
            <div class="section-heading">
                <span class="premium-badge">Reflexão</span>
                <h3>❓ Perguntas para grupos e pregação</h3>
            </div>
            ${htmlListaItens(gerarPerguntasAvancadas(tema, tipo, publico), "report-list")}
        </section>
    `;
}

function renderizarPlanoLeitura({ tema, referenciaInfo }) {
    return `
        <section class="report-card">
            <div class="section-heading">
                <span class="premium-badge">Plano</span>
                <h3>📅 Plano de 5 dias</h3>
            </div>
            ${htmlListaItens(gerarPlanoLeitura(tema, referenciaInfo), "report-list")}
        </section>
    `;
}

function renderizarSermonLab({ tipo, tema, referenciaInfo, publico }) {
    const base = referenciaInfo?.referencia || tema;
    const itens = gerarEstruturaEsboco(tipo, tema, base);

    return `
        <section class="report-card report-card-wide">
            <div class="section-heading">
                <span class="premium-badge">Sermão</span>
                <h3>🎤 Esboço homilético</h3>
            </div>
            <div class="report-grid report-grid-tight">
                ${itens.map((item, index) => `
                    <article class="card sermon-point">
                        <span class="badge-pill">Ponto ${index + 1}</span>
                        <p>${escaparHtml(item)}</p>
                    </article>
                `).join("")}
            </div>
            <div class="study-quote">
                ${escaparHtml(`Este esboço foi pensado para ${publico.toLowerCase()}, com foco em clareza bíblica, aplicação pastoral e resposta prática.`)}
            </div>
        </section>
    `;
}

function renderizarVersiculosRelacionados(versiculosRelacionados = []) {
    if (!versiculosRelacionados.length) {
        return `
            <section class="report-card">
                <div class="section-heading">
                    <span class="premium-badge">Referências</span>
                    <h3>🔗 Versículos relacionados</h3>
                </div>
                <p>Não foram encontrados versículos relacionados com o tema pesquisado.</p>
            </section>
        `;
    }

    return `
        <section class="report-card report-card-wide">
            <div class="section-heading">
                <span class="premium-badge">Referências</span>
                <h3>🔗 Versículos relacionados</h3>
            </div>
            <ul class="report-list">
                ${versiculosRelacionados.map(item => `
                    <li>
                        <a href="#" onclick="abrirCapitulo('${item.abrev}', ${item.capitulo}, ${item.versiculo});return false;">
                            ${escaparHtml(item.livro)} ${item.capitulo}:${item.versiculo}
                        </a> — ${escaparHtml(item.texto)}
                    </li>
                `).join("")}
            </ul>
        </section>
    `;
}

function renderizarOraçãoFinal(tema) {
    return `
        <section class="report-card report-card-wide">
            <div class="section-heading">
                <span class="premium-badge">Oração</span>
                <h3>🙏 Encerramento devocional</h3>
            </div>
            <p>Senhor, usa esta palavra para transformar meu coração, fortalecer minha fé e me conduzir em obediência. Que o estudo de ${escaparHtml(tema)} produza frutos permanentes em minha vida. Amém.</p>
        </section>
    `;
}

function renderizarBlocoRelacionados({ estudo, personagem }) {
    const cards = [];

    if (estudo) {
        cards.push(`
            <section class="report-card">
                <div class="section-heading">
                    <span class="premium-badge">Estudo relacionado</span>
                    <h3>📚 ${escaparHtml(estudo.titulo)}</h3>
                </div>
                <p>${escaparHtml(estudo.resumo || "")}</p>
                <p><strong>Objetivo:</strong> ${escaparHtml(estudo.objetivo || "")}</p>
                <div class="page-actions page-actions-left">
                    <button class="btn-voltar" onclick="abrirEstudoCompleto(${jsLiteralString(estudo.id)})">Abrir estudo</button>
                </div>
            </section>
        `);
    }

    if (personagem) {
        cards.push(`
            <section class="report-card">
                <div class="section-heading">
                    <span class="premium-badge">Personagem</span>
                    <h3>👤 ${escaparHtml(personagem.nome)}</h3>
                </div>
                <p><strong>${escaparHtml(personagem.titulo || "")}</strong></p>
                <p>${escaparHtml(personagem.descricao || "")}</p>
                <div class="page-actions page-actions-left">
                    <button class="btn-voltar" onclick="abrirPersonagem(${personagem.id})">Abrir ficha</button>
                </div>
            </section>
        `);
    }

    return cards.length
        ? `<section class="report-grid">${cards.join("")}</section>`
        : "";
}

function montarSaidaAI({ pergunta, modo, publico, profundidade, tema, referenciaInfo, estudo, personagem, strongTermos, versiculosRelacionados }) {
    const palavraChave = extrairPalavrasChaveTexto(pergunta, 4);
    const textoPlano = montarTextoCompartilhavel({
        pergunta,
        modo,
        publico,
        profundidade,
        tema,
        referenciaInfo,
        estudo,
        personagem,
        palavras: palavraChave,
        strongTermos,
        versiculosRelacionados
    });

    const html = `
        <div class="ai-answer">
            ${renderizarCabecalhoRespostaAI(pergunta, modo, estudo, personagem, referenciaInfo, tema, publico, profundidade, strongTermos, versiculosRelacionados)}
            <div class="report-stats">
                <div class="report-stat"><strong>${escaparHtml(modo)}</strong><span>Modo</span></div>
                <div class="report-stat"><strong>${escaparHtml(publico)}</strong><span>Público</span></div>
                <div class="report-stat"><strong>${escaparHtml(profundidade)}</strong><span>Profundidade</span></div>
                <div class="report-stat"><strong>${escaparHtml(String((strongTermos || []).length))}</strong><span>Palavras fortes</span></div>
            </div>

            ${renderizarResumoExecutivo({ tema, tipo: modo, publico, profundidade, referenciaInfo, estudo, personagem })}
            ${renderizarVersiculoReferencia(referenciaInfo)}
            ${renderizarPanorama({ referenciaInfo, estudo, personagem, tema })}
            ${renderizarExegese({ tipo: modo, tema, referenciaInfo, estudo, palavras: palavraChave })}
            ${renderizarBlocoRelacionados({ estudo, personagem })}
            ${renderizarBlocoOriginal(tema, strongTermos)}
            ${renderizarSermonLab({ tipo: modo, tema, referenciaInfo, publico })}
            ${renderizarAplicacoes({ tipo: modo, tema, palavras: palavraChave, publico })}
            ${renderizarPerguntas({ tema, tipo: modo, publico })}
            ${renderizarVersiculosRelacionados(versiculosRelacionados)}
            ${renderizarPlanoLeitura({ tema, referenciaInfo })}
            ${renderizarOraçãoFinal(tema)}
        </div>
    `;

    return { html, texto: textoPlano };
}

async function abrirBethesdaAI(perguntaPreenchida = "", preferencias = {}) {
    const pagina = document.getElementById("pagina");
    window.__bethesdaAIComparacaoTraducoes = [];
    window.__bethesdaAIReferenciaAtiva = null;

    const modoInicial = preferencias.modo || "estudo";
    const publicoInicial = preferencias.publico || "Geral";
    const profundidadeInicial = preferencias.profundidade || "Profundo";

    let html = `
        <div class="biblioteca ai-shell">

            <button class="btn-voltar" onclick="voltarDashboard()">⬅ Dashboard</button>

            <div class="premium-hero ai-hero" style="margin-top:18px;">
                <div class="ai-hero-copy">
                    <span class="premium-badge">Bethesda AI Premium Studio</span>
                    <h1>🤖 Bethesda AI</h1>
                    <p>Cole um texto bíblico, referência ou tema e receba estudo completo, exegese, grego/hebraico, esboço homilético, aplicações e oração final.</p>

                    <div class="ai-kicker">
                        <span>Texto base</span>
                        <span>Grego e hebraico</span>
                        <span>Esboços bíblicos</span>
                        <span>Aplicações pastorais</span>
                        <span>Plano devocional</span>
                    </div>
                </div>

                <div class="study-metrics">
                    <div class="card metric-card">
                        <strong>24/7</strong>
                        <span>Estudo disponível</span>
                    </div>
                    <div class="card metric-card">
                        <strong>Deep</strong>
                        <span>Modo bíblico</span>
                    </div>
                    <div class="card metric-card">
                        <strong>AI+</strong>
                        <span>Premium Studio</span>
                    </div>
                </div>
            </div>

            <div class="ai-workspace">
                <section class="ai-panel card">
                    ${renderizarSeletorAI()}

                    <textarea id="perguntaAI" class="ai-input ai-input-premium" placeholder="Cole um texto bíblico ou digite uma referência, ex.: João 3:16. Você também pode pedir: 'Faça um estudo completo sobre fé'"></textarea>

                    ${renderizarAcoesRapidas()}

                    <div class="page-actions page-actions-left">
                        <button class="btn-voltar" onclick="processarPerguntaAI()">Gerar estudo premium</button>
                        <button class="btn-voltar" onclick="copiarSaidaAI()">Copiar resultado</button>
                        <button class="btn-voltar" onclick="limparBethesdaAI()">Limpar</button>
                    </div>

                    <p class="muted ai-tip">Dica: use Ctrl + Enter para gerar rapidamente. Você também pode abrir um estudo a partir de qualquer referência bíblica.</p>
                </section>

                <aside class="ai-history-panel card">
                    <div class="section-heading">
                        <span class="premium-badge">Histórico premium</span>
                        <h3>Últimos estudos</h3>
                    </div>

                    <div id="aiHistoricoLista" class="history-list"></div>

                    <div class="page-actions page-actions-left">
                        <button class="btn-voltar" onclick="limparHistoricoAI()">Limpar histórico</button>
                    </div>
                </aside>
            </div>

            <div id="respostaAI" class="ai-response">
                <div class="empty-state">
                    <p>Escreva sua pergunta e clique em “Gerar estudo premium”.</p>
                </div>
            </div>
        </div>
    `;

    mostrarPagina();
    pagina.innerHTML = html;

    const modo = document.getElementById("modoAI");
    const publico = document.getElementById("publicoAI");
    const profundidade = document.getElementById("profundidadeAI");
    const campo = document.getElementById("perguntaAI");

    if (modo) modo.value = modoInicial;
    if (publico) publico.value = publicoInicial;
    if (profundidade) profundidade.value = profundidadeInicial;
    if (campo) {
        campo.value = perguntaPreenchida || "";
        campo.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter" && (evento.ctrlKey || evento.metaKey)) {
                processarPerguntaAI();
            }
        });
        if (perguntaPreenchida) {
            setTimeout(() => processarPerguntaAI(), 60);
        }
    }

    renderizarHistoricoAI();
}

async function processarPerguntaAI() {
    const respostaEl = document.getElementById("respostaAI");
    const pergunta = (document.getElementById("perguntaAI")?.value || "").trim();
    const modoSelecionado = document.getElementById("modoAI")?.value || detectarIntencaoPergunta(pergunta);
    const publico = document.getElementById("publicoAI")?.value || "Geral";
    const profundidade = document.getElementById("profundidadeAI")?.value || "Profundo";
    const versoesSelecionadas = typeof obterVersoesSelecionadasBiblia === "function" ? obterVersoesSelecionadasBiblia() : ["local"];

    if (!pergunta) {
        respostaEl.innerHTML = `<div class="empty-state"><p>Digite um texto bíblico, uma referência ou um tema primeiro.</p></div>`;
        return;
    }

    respostaEl.innerHTML = `
        <div class="empty-state">
            <p>Gerando estudo premium... aguarde alguns instantes.</p>
        </div>
    `;

    const [dicionarioPronto, estudos, pessoas, lexicon] = await Promise.all([
        typeof carregarDicionario === "function" ? carregarDicionario() : Promise.resolve({}),
        typeof carregarEstudos === "function" ? carregarEstudos() : Promise.resolve([]),
        typeof carregarPersonagens === "function" ? carregarPersonagens() : Promise.resolve([]),
        typeof carregarLexicoStrong === "function" ? carregarLexicoStrong() : Promise.resolve([])
    ]);

    const referencia = extrairReferenciaBiblicaTexto(pergunta);
    const tipoDetectado = detectarIntencaoPergunta(pergunta);
    const modo = modoSelecionado || tipoDetectado || "estudo";
    const referenciaTexto = referencia ? `${referencia.livro} ${referencia.capitulo}:${referencia.versiculo}` : "";
    const estudoReferencia = referenciaTexto ? encontrarEstudoRelacionadoPorReferencia(referenciaTexto, estudos) : null;
    const estudo = estudoReferencia || encontrarEstudoRelacionado(pergunta, estudos);
    const personagem = encontrarPersonagemRelacionado(pergunta, pessoas);
    const temaDicionario = extrairTemaPergunta(pergunta);
    const temaBase = estudo?.titulo || temaDicionario || referenciaTexto || extrairPalavrasChaveTexto(pergunta, 1)[0] || "estudo bíblico";
    const tema = (temaDicionario && dicionarioPronto[temaDicionario]) ? temaDicionario : temaBase;
    const temaDados = temaDicionario ? dicionarioPronto[temaDicionario] : null;
    const versiculos = typeof buscarVersiculosPorTermo === "function" ? await buscarVersiculosPorTermo(pergunta, 8) : [];
    const strongTermos = selecionarTermosStrong(pergunta, tema, lexicon);
    const referenciaInfo = referenciaTexto ? await localizarReferenciaCompleta(referenciaTexto) : null;
    const comparacaoTraducoes = referenciaInfo && typeof carregarReferenciaVersoesBiblica === "function"
        ? await carregarReferenciaVersoesBiblica(referenciaInfo, versoesSelecionadas)
        : [];

    window.__bethesdaAIComparacaoTraducoes = comparacaoTraducoes;
    window.__bethesdaAIReferenciaAtiva = referenciaInfo;

    const saida = montarSaidaAI({
        pergunta,
        modo,
        publico,
        profundidade,
        tema,
        referenciaInfo,
        estudo,
        personagem,
        strongTermos,
        versiculosRelacionados: versiculos
    });

    let html = saida.html;

    if (temaDados) {
        html = `
            <div class="ai-answer">
                ${renderizarCabecalhoRespostaAI(pergunta, modo, estudo, personagem, referenciaInfo, tema, publico, profundidade, strongTermos, versiculos)}
                <section class="report-card report-card-wide">
                    <div class="section-heading">
                        <span class="premium-badge">Tema identificado</span>
                        <h3>📜 ${escaparHtml(temaDados.titulo)}</h3>
                    </div>
                    <p><strong>${escaparHtml(temaDados.titulo)}</strong> — ${escaparHtml(temaDados.descricao)}</p>
                    <div class="tag-row">
                        ${(temaDados.referencias || []).map(ref => {
                            const refJs = jsLiteralString(ref);
                            return `<a href="#" class="tag tag-link" onclick="abrirReferencia(${refJs});return false;">${escaparHtml(ref)}</a>`;
                        }).join("")}
                    </div>
                </section>

                <div class="report-stats">
                    <div class="report-stat"><strong>${escaparHtml(modo)}</strong><span>Modo</span></div>
                    <div class="report-stat"><strong>${escaparHtml(publico)}</strong><span>Público</span></div>
                    <div class="report-stat"><strong>${escaparHtml(profundidade)}</strong><span>Profundidade</span></div>
                    <div class="report-stat"><strong>${escaparHtml(String((strongTermos || []).length))}</strong><span>Palavras fortes</span></div>
                </div>

                ${renderizarResumoExecutivo({ tema, tipo: modo, publico, profundidade, referenciaInfo, estudo, personagem })}
                ${renderizarVersiculoReferencia(referenciaInfo)}
                ${renderizarPanorama({ referenciaInfo, estudo, personagem, tema })}
                ${renderizarExegese({ tipo: modo, tema, referenciaInfo, estudo, palavras: extrairPalavrasChaveTexto(pergunta, 4) })}
                ${renderizarBlocoRelacionados({ estudo, personagem })}
                ${renderizarBlocoOriginal(tema, strongTermos)}
                ${renderizarSermonLab({ tipo: modo, tema, referenciaInfo, publico })}
                ${renderizarAplicacoes({ tipo: modo, tema, palavras: extrairPalavrasChaveTexto(pergunta, 4), publico })}
                ${renderizarPerguntas({ tema, tipo: modo, publico })}
                ${renderizarVersiculosRelacionados(versiculos)}
                ${renderizarPlanoLeitura({ tema, referenciaInfo })}
                ${renderizarOraçãoFinal(tema)}
            </div>
        `;
    }

    respostaEl.innerHTML = html;

    const planoTexto = montarTextoCompartilhavel({
        pergunta,
        modo,
        publico,
        profundidade,
        tema,
        referenciaInfo,
        estudo,
        personagem,
        palavras: extrairPalavrasChaveTexto(pergunta, 4),
        strongTermos,
        versiculosRelacionados: versiculos
    });

    window.__bethesdaAIUltimoTexto = planoTexto;
    window.__bethesdaAIUltimoEstudo = {
        pergunta,
        modo,
        publico,
        profundidade,
        tema,
        data: new Date().toLocaleString("pt-BR"),
        resumo: referenciaInfo?.referencia || estudo?.titulo || tema
    };

    salvarHistoricoAI({
        pergunta,
        titulo: referenciaInfo?.referencia || estudo?.titulo || tema,
        resumo: referenciaInfo?.textoVersiculo || estudo?.resumo || tema,
        modo,
        tema,
        publico,
        profundidade,
        data: new Date().toLocaleString("pt-BR")
    });

    renderizarHistoricoAI();
}

window.abrirBethesdaAI = abrirBethesdaAI;
window.processarPerguntaAI = processarPerguntaAI;
window.extrairReferenciaBiblicaTexto = extrairReferenciaBiblicaTexto;
window.detectarIntencaoPergunta = detectarIntencaoPergunta;
window.encontrarEstudoRelacionado = encontrarEstudoRelacionado;
window.encontrarPersonagemRelacionado = encontrarPersonagemRelacionado;
window.selecionarTermosStrong = selecionarTermosStrong;
window.copiarSaidaAI = copiarSaidaAI;
window.limparBethesdaAI = limparBethesdaAI;
window.limparHistoricoAI = limparHistoricoAI;
window.abrirHistoricoAI = abrirHistoricoAI;
window.preencherPromptAI = preencherPromptAI;
