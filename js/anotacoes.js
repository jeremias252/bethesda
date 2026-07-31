let anotacoes = JSON.parse(localStorage.getItem("anotacoesBethesda")) || [];

function salvarAnotacoes() {
    localStorage.setItem("anotacoesBethesda", JSON.stringify(anotacoes));
}

function carregarAnotacoes() {
    anotacoes = JSON.parse(localStorage.getItem("anotacoesBethesda")) || [];
}

function adicionarAnotacao(referencia) {
    const texto = prompt("Digite sua anotação:");

    if (texto === null || texto.trim() === "") {
        return;
    }

    carregarAnotacoes();

    const existente = anotacoes.find(item => item.referencia === referencia);

    if (existente) {
        existente.texto = texto.trim();
    } else {
        anotacoes.push({
            referencia,
            texto: texto.trim()
        });
    }

    salvarAnotacoes();
    alert("Anotação salva!");
}

function abrirAnotacoes() {
    const pagina = document.getElementById("pagina");
    carregarAnotacoes();

    let html = `
        <div class="biblioteca">

            <button class="btn-voltar" onclick="voltarDashboard()">⬅ Dashboard</button>

            <h1>📝 Anotações</h1>

            <div class="page-actions">
                <button class="btn-voltar" onclick="limparAnotacoes()">Limpar todas</button>
            </div>
    `;

    if (anotacoes.length === 0) {
        html += `
            <div class="card">
                <p>Nenhuma anotação encontrada.</p>
            </div>
        `;
    } else {
        anotacoes.forEach((item, indice) => {
            html += `
                <div class="card" style="margin-bottom:20px;">
                    <h3>${escaparHtml(item.referencia)}</h3>
                    <p>${escaparHtml(item.texto)}</p>
                    <button onclick="removerAnotacao(${indice})" class="btn-voltar">🗑 Remover</button>
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

function removerAnotacao(indice) {
    carregarAnotacoes();
    anotacoes.splice(indice, 1);
    salvarAnotacoes();
    abrirAnotacoes();
}

function limparAnotacoes() {
    if (!confirm("Deseja remover todas as anotações?")) return;
    anotacoes = [];
    salvarAnotacoes();
    abrirAnotacoes();
}

window.adicionarAnotacao = adicionarAnotacao;
window.abrirAnotacoes = abrirAnotacoes;
window.removerAnotacao = removerAnotacao;
window.limparAnotacoes = limparAnotacoes;
