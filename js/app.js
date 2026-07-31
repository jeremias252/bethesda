
document.addEventListener("DOMContentLoaded", async () => {
    if (typeof aplicarTemaAtual === "function") {
        aplicarTemaAtual();
    }

    if (typeof inicializarAutenticacaoBethesda === "function") {
        await inicializarAutenticacaoBethesda();
    }

    const dashboard = document.querySelector(".dashboard");
    const pagina = document.getElementById("pagina");

    if (!dashboard || !pagina) {
        return;
    }

    function ocultarDashboard() {
        dashboard.style.display = "none";
        pagina.style.display = "block";
    }

    function mostrarHome() {
        dashboard.style.display = "flex";
        pagina.style.display = "none";
    }

    window.mostrarDashboard = mostrarHome;
    window.voltarDashboard = mostrarHome;

    const rotas = {
        "🏠 Dashboard": () => mostrarHome(),
        "🤖 Bethesda AI": () => abrirBethesdaAI(),
        "📖 Estudos": () => abrirEstudos(),
        "📚 Biblioteca": () => abrirBiblioteca(),
        "👤 Personagens": () => abrirPersonagens(),
        "🗺️ Mapas": () => abrirMapas(),
        "📜 Strong": () => abrirStrong(),
        "⭐ Favoritos": () => abrirFavoritos(),
        "📝 Anotações": () => abrirAnotacoes(),
        "⚙️ Configurações": () => abrirConfiguracoes()
    };

    document.querySelectorAll(".sidebar nav button").forEach(botao => {
        botao.addEventListener("click", () => {
            const texto = botao.textContent.trim();
            const acao = rotas[texto];

            if (acao) {
                ocultarDashboard();
                acao();
            }
        });
    });

    const cards = Array.from(document.querySelectorAll(".cards-grid .card"));
    cards.forEach(card => {
        card.addEventListener("click", () => {
            const titulo = normalizarTexto(card.querySelector("h3")?.textContent || "");
            ocultarDashboard();

            if (titulo.includes("bethesda ai")) {
                abrirBethesdaAI();
            } else if (titulo.includes("biblioteca")) {
                abrirBiblioteca();
            } else if (titulo.includes("estudos")) {
                abrirEstudos();
            } else if (titulo.includes("personagens")) {
                abrirPersonagens();
            } else if (titulo.includes("linha do tempo")) {
                abrirTimeline();
            } else if (titulo.includes("strong")) {
                abrirStrong();
            } else if (titulo.includes("favoritos")) {
                abrirFavoritos();
            }
        });
    });

    const campoPesquisa = document.getElementById("campoPesquisa");
    if (campoPesquisa) {
        campoPesquisa.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter") {
                ocultarDashboard();
                pesquisarGlobal(campoPesquisa.value);
            }
        });
    }
});
