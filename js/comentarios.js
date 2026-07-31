let comentarios = {};

async function carregarComentarios() {
    if (Object.keys(comentarios).length > 0) {
        return comentarios;
    }

    if (window.BETHESDA_DATA?.comentarios) {
        comentarios = window.BETHESDA_DATA.comentarios;
        return comentarios;
    }

    try {
        const resposta = await fetch("data/comentarios/comentarios.json");
        if (!resposta.ok) {
            throw new Error("Erro ao carregar comentários.");
        }
        comentarios = await resposta.json();
        return comentarios;
    } catch (erro) {
        console.error("Erro ao carregar comentários:", erro);
        return {};
    }
}

async function buscarComentario(referencia) {
    const dados = await carregarComentarios();
    return dados[referencia] || null;
}

window.carregarComentarios = carregarComentarios;
window.buscarComentario = buscarComentario;
