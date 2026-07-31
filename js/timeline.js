async function abrirTimeline(filtro = "") {
    const pagina = document.getElementById("pagina");
    const termo = normalizarTexto(filtro);

    try {
        if (typeof carregarPersonagens === "function") {
            await carregarPersonagens();
        }

        const eventos = Array.isArray(window.BETHESDA_DATA?.timeline) && window.BETHESDA_DATA.timeline.length > 0
            ? window.BETHESDA_DATA.timeline
            : await (async () => {
                const resposta = await fetch("data/timeline/timeline.json");
                if (!resposta.ok) {
                    throw new Error("Não foi possível carregar a linha do tempo.");
                }
                return await resposta.json();
            })();

        const filtrados = termo
            ? eventos.filter(evento =>
                normalizarTexto(evento.titulo).includes(termo) ||
                normalizarTexto(evento.descricao).includes(termo) ||
                normalizarTexto(evento.epoca).includes(termo) ||
                (evento.personagens || []).some(nome => normalizarTexto(nome).includes(termo))
            )
            : eventos;

        let html = `
            <div class="biblioteca">

                <button class="btn-voltar" onclick="voltarDashboard()">⬅ Dashboard</button>

                <h1>📅 Linha do Tempo Bíblica</h1>

                <p>Navegue pelos principais acontecimentos da Bíblia.</p>

                <div class="page-actions">
                    <input
                        id="buscaTimeline"
                        class="search-box"
                        type="text"
                        placeholder="Pesquisar evento ou personagem..."
                        value="${escaparHtml(filtro)}">
                    <button class="btn-voltar" onclick="abrirTimeline(document.getElementById('buscaTimeline').value)">Pesquisar</button>
                </div>

                <p class="muted">${filtrados.length} evento(s) encontrado(s)</p>

                <div class="timeline">
        `;

        filtrados.forEach(evento => {
            const pessoas = (evento.personagens || [])
                .map(nome => (typeof criarLinkPersonagem === "function" ? criarLinkPersonagem(nome) : escaparHtml(nome)))
                .join(", ");

            html += `
                <div class="timeline-card">
                    <h2>${escaparHtml(evento.titulo)}</h2>
                    <small>${escaparHtml(evento.epoca || "")}</small>
                    <p>${escaparHtml(evento.descricao || "")}</p>
                    <strong>Personagens</strong>
                    <p>${pessoas || "<span class='muted'>Sem personagens listados.</span>"}</p>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        mostrarPagina();
        pagina.innerHTML = html;

        const campo = document.getElementById("buscaTimeline");
        if (campo) {
            campo.addEventListener("keydown", (evento) => {
                if (evento.key === "Enter") {
                    abrirTimeline(campo.value);
                }
            });
        }
    } catch (erro) {
        console.error(erro);
        pagina.innerHTML = `
            <div class="biblioteca">
                <button class="btn-voltar" onclick="voltarDashboard()">⬅ Dashboard</button>
                <h1>Erro</h1>
                <p>Não foi possível carregar a linha do tempo.</p>
            </div>
        `;
    }
}

window.abrirTimeline = abrirTimeline;
