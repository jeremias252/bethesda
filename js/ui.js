
function aplicarTemaAtual() {
    const tema = localStorage.getItem("bethesdaTema") || "claro";
    document.body.classList.toggle("theme-dark", tema === "escuro");
}

function alternarTemaBethesda() {
    const atual = localStorage.getItem("bethesdaTema") || "claro";
    const novo = atual === "escuro" ? "claro" : "escuro";
    localStorage.setItem("bethesdaTema", novo);
    aplicarTemaAtual();
    if (document.getElementById("pagina")) {
        abrirConfiguracoes();
    }
}

function abrirMapas() {
    const pagina = document.getElementById("pagina");
    const mapas = [
        {
            titulo: "Jerusalém",
            resumo: "Centro espiritual, político e profético da narrativa bíblica.",
            acao: "Abrir estudo sobre Jerusalém",
            prompt: "Faça um estudo completo sobre Jerusalém na Bíblia"
        },
        {
            titulo: "Êxodo",
            resumo: "O caminho de Israel do Egito ao deserto e à promessa.",
            acao: "Abrir estudo sobre o Êxodo",
            prompt: "Faça um estudo completo sobre o Êxodo e o deserto"
        },
        {
            titulo: "Viagens de Paulo",
            resumo: "As jornadas missionárias que espalharam o evangelho no mundo antigo.",
            acao: "Abrir estudo sobre Paulo",
            prompt: "Faça um estudo completo sobre as viagens missionárias de Paulo"
        },
        {
            titulo: "Terra Santa",
            resumo: "Contexto geográfico dos patriarcas, profetas e de Jesus.",
            acao: "Abrir estudo da Terra Santa",
            prompt: "Faça um estudo completo sobre a geografia bíblica da Terra Santa"
        }
    ];

    let html = `
        <div class="biblioteca">
            <button class="btn-voltar" onclick="voltarDashboard()">⬅ Dashboard</button>
            <h1>🗺️ Mapas Bíblicos</h1>
            <p>Estudos geográficos e contextuais com abertura rápida na Bethesda AI.</p>

            <div class="map-grid">
                ${mapas.map(map => `
                    <div class="card map-card">
                        <span class="badge-pill">Mapa</span>
                        <h3>${escaparHtml(map.titulo)}</h3>
                        <p>${escaparHtml(map.resumo)}</p>
                        <div class="page-actions page-actions-left">
                            <button class="btn-voltar" onclick="abrirBethesdaAI(${jsLiteralString(map.prompt)})">${escaparHtml(map.acao)}</button>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;

    mostrarPagina();
    pagina.innerHTML = html;
}

function abrirConfiguracoes() {
    const pagina = document.getElementById("pagina");
    const temaAtual = localStorage.getItem("bethesdaTema") || "claro";
    const favoritos = JSON.parse(localStorage.getItem("favoritosBethesda") || "[]");
    const anotacoes = JSON.parse(localStorage.getItem("anotacoesBethesda") || "[]");
    const usuario = typeof obterUsuarioAtualAcesso === "function" ? obterUsuarioAtualAcesso() : null;
    const linkAcesso = usuario && typeof gerarLinkAcesso === "function"
        ? gerarLinkAcesso(usuario.token || usuario.usuario || usuario.nome)
        : "";

    let html = `
        <div class="biblioteca">
            <button class="btn-voltar" onclick="voltarDashboard()">⬅ Dashboard</button>
            <h1>⚙️ Configurações</h1>
            <p>Personalize a aparência, traduções e acesso do app.</p>

            <div class="settings-grid">
                <div class="card">
                    <h3>🎨 Aparência</h3>
                    <p>Tema atual: <strong>${temaAtual === "escuro" ? "Escuro" : "Claro"}</strong></p>
                    <div class="page-actions page-actions-left">
                        <button class="btn-voltar" onclick="alternarTemaBethesda()">Alternar tema</button>
                    </div>
                </div>

                <div class="card">
                    <h3>📖 Traduções bíblicas</h3>
                    <p>Selecione até 3 versões para comparar no leitor e na Bethesda AI.</p>
                    ${typeof renderizarControleVersoesBiblia === "function" ? renderizarControleVersoesBiblia("Versões ativas") : ""}
                </div>

                <div class="card">
                    <h3>🔐 Acesso e compartilhamento</h3>
                    <p>Usuário atual: <strong>${escaparHtml(usuario?.nome || "Sem sessão")}</strong></p>
                    <p>Perfil: <strong>${escaparHtml(usuario?.papel || "-")}</strong></p>
                    <p>Chave: <strong>${escaparHtml(usuario?.token || "-")}</strong></p>
                    <div class="page-actions page-actions-left">
                        <button class="btn-voltar" onclick="copiarLinkAcessoAtual()">Copiar link de acesso</button>
                        <button class="btn-voltar" onclick="sairBethesda()">Sair</button>
                    </div>
                    ${linkAcesso ? `<input class="search-box access-link" readonly value="${escaparHtml(linkAcesso)}">` : ""}
                </div>

                <div class="card">
                    <h3>💾 Seus dados</h3>
                    <p>Favoritos salvos: <strong>${favoritos.length}</strong></p>
                    <p>Anotações salvas: <strong>${anotacoes.length}</strong></p>
                </div>

                <div class="card">
                    <h3>🧹 Manutenção</h3>
                    <div class="page-actions page-actions-left">
                        <button class="btn-voltar" onclick="limparFavoritos()">Limpar favoritos</button>
                        <button class="btn-voltar" onclick="limparAnotacoes()">Limpar anotações</button>
                    </div>
                </div>

                <div class="card">
                    <h3>🤖 Estudos rápidos</h3>
                    <p>Abra a Bethesda AI para gerar um estudo completo, esboço, devocional ou explicação de texto bíblico.</p>
                    <div class="page-actions page-actions-left">
                        <button class="btn-voltar" onclick="abrirBethesdaAI('Faça um estudo completo sobre fé')">Abrir AI</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    mostrarPagina();
    pagina.innerHTML = html;
}

window.aplicarTemaAtual = aplicarTemaAtual;
window.alternarTemaBethesda = alternarTemaBethesda;
window.abrirMapas = abrirMapas;
window.abrirConfiguracoes = abrirConfiguracoes;
