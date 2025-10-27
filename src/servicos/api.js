import { API_CONFIG } from "../config/apiconfig.js";

const URL_BASE = API_CONFIG.BASE_URL;

// Função auxiliar para obter token
const obterToken = () => {
  return localStorage.getItem("token") || localStorage.getItem("auth_token");
};

// Função principal para fazer requisições
const fazerRequisicao = async (endpoint, metodo, dados = null) => {
  const token = obterToken();
  
  // Construir URL corretamente - EVITAR DUPLICAÇÃO
  const urlCompleta = `${URL_BASE}${endpoint}`;
  
  console.log(`🌐 Fazendo requisição ${metodo} para: ${urlCompleta}`);

  const opcoes = {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    credentials: "include",
  };

  if (token) {
    opcoes.headers.Authorization = `Bearer ${token}`;
  }

  if (dados && (metodo === "POST" || metodo === "PUT" || metodo === "PATCH")) {
    opcoes.body = JSON.stringify(dados);
  }

  try {
    const controlador = new AbortController();
    const idTempo = setTimeout(() => controlador.abort(), API_CONFIG.TIMEOUT);
    opcoes.signal = controlador.signal;

    const resposta = await fetch(urlCompleta, opcoes);
    clearTimeout(idTempo);

    if (!resposta.ok) {
      let mensagemErro = `Erro ${resposta.status}: ${resposta.statusText}`;

      try {
        const contentType = resposta.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const dadosErro = await resposta.json();
          mensagemErro = dadosErro.message || dadosErro.mensagem || mensagemErro;
        }
      } catch (e) {
        console.warn("Não foi possível parsear resposta de erro:", e);
      }

      if (resposta.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
        localStorage.removeItem("estaAutenticado");
        window.location.href = "/qualificados";
      }

      throw new Error(mensagemErro);
    }

    const contentType = resposta.headers.get("content-type");

    if (resposta.status === 204 || !contentType) {
      return { status: "sucesso" };
    }

    const text = await resposta.text();

    if (!contentType.includes("application/json")) {
      console.warn("⚠️ Resposta não é JSON:", text.substring(0, 200));
      throw new Error("Resposta da API não é JSON");
    }

    const dadosResposta = JSON.parse(text);
    return dadosResposta;
  } catch (erro) {
    console.error("❌ Erro na requisição:", erro);

    if (erro.name === "AbortError") {
      throw new Error("Tempo de requisição excedido. Tente novamente.");
    }

    if (erro.name === "TypeError" && erro.message.includes("fetch")) {
      throw new Error("Erro de conexão. Verifique se o servidor está rodando.");
    }

    throw erro;
  }
};

// ========== SERVIÇOS CORRIGIDOS - ENDPOINTS RELATIVOS ==========

export const servicoLocalizacao = {
  criar: (dadosLocalizacao) =>
    fazerRequisicao('/api/localizacoes', "POST", dadosLocalizacao),
  buscarPorId: (id) => 
    fazerRequisicao(`/api/localizacoes/${id}`, "GET"),
  listarTodas: () => 
    fazerRequisicao('/api/localizacoes', "GET"),
  atualizar: (id, dadosLocalizacao) =>
    fazerRequisicao(`/api/localizacoes/${id}`, "PUT", dadosLocalizacao),
  deletar: (id) => 
    fazerRequisicao(`/api/localizacoes/${id}`, "DELETE"),
};

export const servicoUsuario = {
  criar: (dadosUsuario) =>
    fazerRequisicao('/api/usuarios', "POST", dadosUsuario),
  buscarPorId: (id) => 
    fazerRequisicao(`/api/usuarios/${id}`, "GET"),
  listarTodos: () => 
    fazerRequisicao('/api/usuarios', "GET"),
  atualizar: (id, dadosUsuario) =>
    fazerRequisicao(`/api/usuarios/${id}`, "PUT", dadosUsuario),
  deletar: (id) => 
    fazerRequisicao(`/api/usuarios/${id}`, "DELETE"),
};

export const servicoProfissional = {
  criar: (dadosProfissional) =>
    fazerRequisicao('/api/profissionais', "POST", dadosProfissional),
  buscarPorId: (id) =>
    fazerRequisicao(`/api/profissionais/${id}`, "GET"),
  listarTodos: () => 
    fazerRequisicao('/api/profissionais', "GET"),
  atualizar: (id, dadosProfissional) =>
    fazerRequisicao(`/api/profissionais/${id}`, "PUT", dadosProfissional),
  deletar: (id) => 
    fazerRequisicao(`/api/profissionais/${id}`, "DELETE"),
};

export const servicoAvaliacao = {
  criar: (dadosAvaliacao) =>
    fazerRequisicao('/api/avaliacoes', "POST", dadosAvaliacao),
  buscarPorId: (id) => 
    fazerRequisicao(`/api/avaliacoes/${id}`, "GET"),
  listarTodas: () => 
    fazerRequisicao('/api/avaliacoes', "GET"),
  atualizar: (id, dadosAvaliacao) =>
    fazerRequisicao(`/api/avaliacoes/${id}`, "PUT", dadosAvaliacao),
  deletar: (id) => 
    fazerRequisicao(`/api/avaliacoes/${id}`, "DELETE"),
};

export const servicoHCurricular = {
  criar: (dadosHCurricular) =>
    fazerRequisicao('/api/hcurriculares', "POST", dadosHCurricular),
  buscarPorId: (id) =>
    fazerRequisicao(`/api/hcurriculares/${id}`, "GET"),
  listarTodos: () => 
    fazerRequisicao('/api/hcurriculares', "GET"),
  atualizar: (id, dadosHCurricular) =>
    fazerRequisicao(`/api/hcurriculares/${id}`, "PUT", dadosHCurricular),
  deletar: (id) => 
    fazerRequisicao(`/api/hcurriculares/${id}`, "DELETE"),
};

export const servicoHProfissional = {
  criar: (dadosHProfissional) =>
    fazerRequisicao('/api/hprofissionais', "POST", dadosHProfissional),
  buscarPorId: (id) =>
    fazerRequisicao(`/api/hprofissionais/${id}`, "GET"),
  listarTodos: () => 
    fazerRequisicao('/api/hprofissionais', "GET"),
  atualizar: (id, dadosHProfissional) =>
    fazerRequisicao(`/api/hprofissionais/${id}`, "PUT", dadosHProfissional),
  deletar: (id) =>
    fazerRequisicao(`/api/hprofissionais/${id}`, "DELETE"),
};

export const servicoCadastro = {
  validarEmail: async (email) => {
    try {
      const resposta = await fazerRequisicao(
        '/api/auth/validar-email',
        "POST",
        { email }
      );
      return resposta;
    } catch (erro) {
      console.error("Erro ao validar email:", erro);
      throw erro;
    }
  },

  cadastrarUsuario: async (dadosPerfil, dadosLocalizacao) => {
    try {
      const respostaLocalizacao = await servicoLocalizacao.criar(dadosLocalizacao);
      const localizacaoId = respostaLocalizacao.data._id;

      const dadosUsuario = {
        ...dadosPerfil,
        localizacao: localizacaoId,
      };

      const respostaUsuario = await servicoUsuario.criar(dadosUsuario);
      return respostaUsuario;
    } catch (erro) {
      console.error("Erro ao cadastrar usuário:", erro);
      throw new Error(`Erro no cadastro: ${erro.message}`);
    }
  },

  cadastrarProfissional: async (dadosProfissional, dadosLocalizacao) => {
    try {
      const respostaLocalizacao = await servicoLocalizacao.criar(dadosLocalizacao);

      const respostaProfissional = await servicoProfissional.criar({
        ...dadosProfissional,
        localizacao: respostaLocalizacao.data._id,
      });

      return respostaProfissional;
    } catch (erro) {
      throw new Error(`Erro no cadastro: ${erro.message}`);
    }
  },
};

export const servicoAuth = {
  login: async (email, senha) => {
    try {
      console.log('🔐 Tentando login para:', email);
      
      const resposta = await fazerRequisicao(
        '/api/auth/login', 
        "POST", 
        { email, senha }
      );

      console.log('📨 Resposta do login:', resposta);

      if (resposta && resposta.status === "sucesso") {
        // Armazenar token e dados do usuário de forma padronizada
        localStorage.setItem("token", resposta.token);
        localStorage.setItem("auth_token", resposta.token);
        localStorage.setItem("user", JSON.stringify(resposta.data));
        localStorage.setItem("user_data", JSON.stringify(resposta.data));
        localStorage.setItem("estaAutenticado", "true");
        localStorage.setItem("loginTimestamp", Date.now().toString());

        console.log('✅ Login bem-sucedido, token armazenado');
        return resposta;
      } else {
        const mensagemErro = resposta?.message || "Credenciais inválidas";
        console.error('❌ Erro na resposta do login:', mensagemErro);
        throw new Error(mensagemErro);
      }
    } catch (erro) {
      console.error("❌ Erro no login:", erro);

      // Limpar dados de autenticação em caso de erro
      localStorage.removeItem("token");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      localStorage.removeItem("user_data");
      localStorage.removeItem("estaAutenticado");

      if (erro.message.includes("401")) {
        throw new Error("Credenciais inválidas");
      } else if (erro.message.includes("404")) {
        throw new Error("Email não encontrado");
      } else if (erro.message.includes("Network Error") || erro.message.includes("Failed to fetch")) {
        throw new Error("Erro de conexão. Verifique sua internet.");
      } else {
        throw new Error(erro.message || "Erro ao fazer login");
      }
    }
  },

  buscarPerfilLogado: async (id) => {
    try {
      const resposta = await fazerRequisicao(
        `/api/auth/perfil/${id}`,
        "GET"
      );
      return resposta;
    } catch (erro) {
      throw new Error(`Erro ao buscar perfil: ${erro.message}`);
    }
  },

  editarPerfil: async (id, dadosAtualizacao) => {
    try {
      const resposta = await fazerRequisicao(
        `/api/auth/perfil/${id}`,
        "PUT",
        dadosAtualizacao
      );
      return resposta;
    } catch (erro) {
      throw new Error(`Erro ao editar perfil: ${erro.message}`);
    }
  },

  logout: async () => {
    try {
      const resposta = await fazerRequisicao(
        '/api/auth/logout', 
        "POST"
      );

      // Limpar todos os dados de autenticação
      localStorage.removeItem("token");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      localStorage.removeItem("user_data");
      localStorage.removeItem("estaAutenticado");
      localStorage.removeItem("loginTimestamp");
      localStorage.removeItem("emailLembrado");
      localStorage.removeItem("lembrarMe");

      return resposta;
    } catch (erro) {
      // Limpar mesmo em caso de erro
      localStorage.removeItem("token");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      localStorage.removeItem("user_data");
      localStorage.removeItem("estaAutenticado");
      localStorage.removeItem("loginTimestamp");
      localStorage.removeItem("emailLembrado");
      localStorage.removeItem("lembrarMe");

      throw new Error(`Erro ao fazer logout: ${erro.message}`);
    }
  },
};

// Health check da API
export const verificarConexaoAPI = async () => {
  try {
    const resposta = await fetch(`${URL_BASE}/api/health`);
    return resposta.ok;
  } catch (erro) {
    console.error("❌ API não está respondendo:", erro);
    return false;
  }
};