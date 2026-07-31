
const BETHESDA_SESSAO_KEY = "bethesdaSessaoAcesso";
const BETHESDA_USUARIOS_KEY = "bethesdaUsuariosAcesso";
let usuariosAcessoCache = null;

function normalizarLoginAcesso(valor = "") {
    return normalizarTexto(valor).replace(/\s+/g, "");
}

async function carregarUsuariosAcesso() {
    if (Array.isArray(usuariosAcessoCache) && usuariosAcessoCache.length > 0) {
        return usuariosAcessoCache;
    }

    try {
        const local = localStorage.getItem(BETHESDA_USUARIOS_KEY);
        if (local) {
            const dados = JSON.parse(local);
            if (Array.isArray(dados) && dados.length > 0) {
                usuariosAcessoCache = dados;
                return usuariosAcessoCache;
            }
        }
    } catch (erro) {
        console.warn("Falha ao ler usuários locais:", erro);
    }

    try {
        const resposta = await fetch("data/acesso.json");
        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os acessos.");
        }

        const dados = await resposta.json();
        usuariosAcessoCache = Array.isArray(dados?.users) ? dados.users : [];
        return usuariosAcessoCache;
    } catch (erro) {
        console.error(erro);
        usuariosAcessoCache = [];
        return usuariosAcessoCache;
    }
}

function salvarUsuariosAcesso(usuarios) {
    usuariosAcessoCache = Array.isArray(usuarios) ? usuarios : [];
    localStorage.setItem(BETHESDA_USUARIOS_KEY, JSON.stringify(usuariosAcessoCache));
}

function obterSessaoAcesso() {
    try {
        return JSON.parse(localStorage.getItem(BETHESDA_SESSAO_KEY) || "null");
    } catch {
        return null;
    }
}

function salvarSessaoAcesso(usuario) {
    localStorage.setItem(BETHESDA_SESSAO_KEY, JSON.stringify(usuario));
}

function limparSessaoAcesso() {
    localStorage.removeItem(BETHESDA_SESSAO_KEY);
}

function obterTokenAcessoUrl() {
    const url = new URL(window.location.href);
    return url.searchParams.get("access") || url.searchParams.get("invite") || "";
}

async function autenticarAcesso(usuarioDigitado, senhaDigitada) {
    const lista = await carregarUsuariosAcesso();
    const login = normalizarLoginAcesso(usuarioDigitado);
    const senha = String(senhaDigitada || "").trim();

    return lista.find(usuario => {
        const loginUsuario = normalizarLoginAcesso(usuario.usuario || usuario.login || usuario.nome);
        return loginUsuario === login && String(usuario.senha || "") === senha;
    }) || null;
}

async function autenticarPorToken(token) {
    const lista = await carregarUsuariosAcesso();
    const chave = String(token || "").trim();

    return lista.find(usuario => String(usuario.token || "") === chave) || null;
}

function gerarIniciais(nome = "") {
    const partes = String(nome)
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (!partes.length) return "B";
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();

    return `${partes[0][0] || ""}${partes[partes.length - 1][0] || ""}`.toUpperCase();
}

function atualizarCabecalhoUsuario(usuario) {
    const titulo = document.querySelector(".topbar h2");
    const subtitulo = document.querySelector(".topbar p");
    const avatar = document.getElementById("avatarUsuario");
    const nomeAtivo = document.getElementById("usuarioAtivo");

    if (titulo) {
        titulo.textContent = `Bem-vindo, ${usuario?.nome || "Leitor"}`;
    }

    if (subtitulo) {
        subtitulo.textContent = usuario?.papel
            ? `Perfil ${usuario.papel} • Estudos bíblicos premium.`
            : "Seu ambiente completo de estudos bíblicos.";
    }

    if (avatar) {
        avatar.textContent = gerarIniciais(usuario?.nome || "Bethesda");
    }

    if (nomeAtivo) {
        nomeAtivo.textContent = usuario?.nome || "Leitor";
    }
}

function mostrarAppAutenticado(usuario) {
    const login = document.getElementById("loginScreen");
    const app = document.getElementById("app");

    document.body.classList.add("authenticated");

    if (login) login.style.display = "none";
    if (app) app.style.display = "flex";

    atualizarCabecalhoUsuario(usuario);
    mostrarDashboard();
}

function mostrarTelaLogin(mensagem = "") {
    const login = document.getElementById("loginScreen");
    const app = document.getElementById("app");
    const msg = document.getElementById("loginMensagem");
    const form = document.getElementById("loginFormBethesda");

    document.body.classList.remove("authenticated");

    if (app) app.style.display = "none";
    if (login) login.style.display = "flex";

    if (msg) {
        msg.textContent = mensagem || "";
        msg.style.display = mensagem ? "block" : "none";
    }

    if (form) {
        form.reset();
    }
}

function gerarLinkAcesso(token) {
    const url = new URL(window.location.href);
    url.searchParams.set("access", token);
    return url.toString();
}

function copiarLinkAcessoAtual() {
    const sessao = obterSessaoAcesso();
    if (!sessao) {
        alert("Faça login primeiro.");
        return;
    }

    const link = gerarLinkAcesso(sessao.token || sessao.usuario || sessao.nome);
    navigator.clipboard.writeText(link);
    alert("Link de acesso copiado!");
}

async function sairBethesda() {
    limparSessaoAcesso();
    const url = new URL(window.location.href);
    url.searchParams.delete("access");
    url.searchParams.delete("invite");
    window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
    mostrarTelaLogin("Sessão encerrada.");
}

async function inicializarAutenticacaoBethesda() {
    const form = document.getElementById("loginFormBethesda");
    const botao = document.getElementById("loginBotaoBethesda");
    const usuarioAtual = obterSessaoAcesso();

    if (usuarioAtual) {
        mostrarAppAutenticado(usuarioAtual);
        return usuarioAtual;
    }

    const token = obterTokenAcessoUrl();
    if (token) {
        const usuarioPorToken = await autenticarPorToken(token);
        if (usuarioPorToken) {
            salvarSessaoAcesso(usuarioPorToken);
            mostrarAppAutenticado(usuarioPorToken);
            return usuarioPorToken;
        }
    }

    mostrarTelaLogin();

    if (form && !form.dataset.authLoaded) {
        form.dataset.authLoaded = "true";
        form.addEventListener("submit", async (evento) => {
            evento.preventDefault();

            const usuario = document.getElementById("loginUsuarioBethesda")?.value || "";
            const senha = document.getElementById("loginSenhaBethesda")?.value || "";
            const mensagem = document.getElementById("loginMensagem");

            if (botao) {
                botao.disabled = true;
                botao.textContent = "Entrando...";
            }

            const autenticado = await autenticarAcesso(usuario, senha);

            if (!autenticado) {
                if (mensagem) {
                    mensagem.textContent = "Usuário ou senha inválidos.";
                    mensagem.style.display = "block";
                }
                if (botao) {
                    botao.disabled = false;
                    botao.textContent = "Entrar";
                }
                return;
            }

            salvarSessaoAcesso(autenticado);
            if (mensagem) {
                mensagem.textContent = "";
                mensagem.style.display = "none";
            }
            if (botao) {
                botao.disabled = false;
                botao.textContent = "Entrar";
            }

            mostrarAppAutenticado(autenticado);
        });
    }

    return null;
}

function obterUsuarioAtualAcesso() {
    return obterSessaoAcesso();
}

window.carregarUsuariosAcesso = carregarUsuariosAcesso;
window.salvarUsuariosAcesso = salvarUsuariosAcesso;
window.obterSessaoAcesso = obterSessaoAcesso;
window.autenticarAcesso = autenticarAcesso;
window.autenticarPorToken = autenticarPorToken;
window.inicializarAutenticacaoBethesda = inicializarAutenticacaoBethesda;
window.sairBethesda = sairBethesda;
window.copiarLinkAcessoAtual = copiarLinkAcessoAtual;
window.gerarLinkAcesso = gerarLinkAcesso;
window.obterUsuarioAtualAcesso = obterUsuarioAtualAcesso;
window.mostrarAppAutenticado = mostrarAppAutenticado;
window.mostrarTelaLogin = mostrarTelaLogin;
