let livrosBiblia = [];
let biblia = [];

async function carregarLivros() {
    if (Array.isArray(window.BETHESDA_DATA?.livros) && window.BETHESDA_DATA.livros.length > 0) {
        livrosBiblia = window.BETHESDA_DATA.livros;
        return livrosBiblia;
    }

    if (livrosBiblia.length > 0) {
        return livrosBiblia;
    }

    try {
        const resposta = await fetch("data/livros.json");
        if (!resposta.ok) {
            throw new Error("Erro ao carregar livros.");
        }

        livrosBiblia = await resposta.json();
        return livrosBiblia;
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar os livros da Bíblia.");
        return [];
    }
}

async function carregarBiblia() {
    if (Array.isArray(window.BETHESDA_DATA?.biblia) && window.BETHESDA_DATA.biblia.length > 0) {
        biblia = window.BETHESDA_DATA.biblia;
        return biblia;
    }

    if (biblia.length > 0) {
        return biblia;
    }

    try {
        const resposta = await fetch("data/biblia.json");
        if (!resposta.ok) {
            throw new Error("Erro ao carregar a Bíblia.");
        }

        biblia = await resposta.json();
        return biblia;
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar a Bíblia.");
        return [];
    }
}

async function carregarLivroBiblia(abrev) {
    const bibliaCompleta = await carregarBiblia();
    return bibliaCompleta.find(livro => livro.abbrev === abrev || livro.abbrev === String(abrev).toLowerCase());
}

window.carregarLivros = carregarLivros;
window.carregarBiblia = carregarBiblia;
window.carregarLivroBiblia = carregarLivroBiblia;
