// client/src/servicos/api.js
import { API_CONFIG } from "../config/apiconfig.js";

const URL_BASE = API_CONFIG.BASE_URL;

// Função auxiliar para obter token
const obterToken = () => {
  return localStorage.getItem("token") || localStorage.getItem("auth_token");
};

// Função principal para fazer requisições
const fazerRequisicao = async (url, metodo, dados = null) => {
  const token = obterToken();
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
    console.log(`🌐 Fazendo requisição ${metodo} para: ${url}`);

    const controlador = new AbortController();
    const idTempo = setTimeout(() => controlador.abort(), API_CONFIG.TIMEOUT);
    opcoes.signal = controlador.signal;

    const resposta = await fetch(url, opcoes);
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

// Serviços básicos usando os endpoints corretos
export const servicoLocalizacao = {
  criar: (dadosLocalizacao) =>
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.LOCATIONS}`, "POST", dadosLocalizacao),
  buscarPorId: (id) => 
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.LOCATIONS}/${id}`, "GET"),
  listarTodas: () => 
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.LOCATIONS}`, "GET"),
  atualizar: (id, dadosLocalizacao) =>
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.LOCATIONS}/${id}`, "PUT", dadosLocalizacao),
  deletar: (id) => 
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.LOCATIONS}/${id}`, "DELETE"),
};

export const servicoUsuario = {
  criar: (dadosUsuario) =>
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.USERS}`, "POST", dadosUsuario),
  buscarPorId: (id) => 
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.USERS}/${id}`, "GET"),
  listarTodos: () => 
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.USERS}`, "GET"),
  atualizar: (id, dadosUsuario) =>
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.USERS}/${id}`, "PUT", dadosUsuario),
  deletar: (id) => 
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.USERS}/${id}`, "DELETE"),
};

export const servicoProfissional = {
  criar: (dadosProfissional) =>
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.PROFESSIONALS}`, "POST", dadosProfissional),
  buscarPorId: (id) =>
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.PROFESSIONALS}/${id}`, "GET"),
  listarTodos: () => 
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.PROFESSIONALS}`, "GET"),
  atualizar: (id, dadosProfissional) =>
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.PROFESSIONALS}/${id}`, "PUT", dadosProfissional),
  deletar: (id) => 
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.PROFESSIONALS}/${id}`, "DELETE"),
};

export const servicoAvaliacao = {
  criar: (dadosAvaliacao) =>
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.EVALUATIONS}`, "POST", dadosAvaliacao),
  buscarPorId: (id) => 
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.EVALUATIONS}/${id}`, "GET"),
  listarTodas: () => 
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.EVALUATIONS}`, "GET"),
  atualizar: (id, dadosAvaliacao) =>
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.EVALUATIONS}/${id}`, "PUT", dadosAvaliacao),
  deletar: (id) => 
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.EVALUATIONS}/${id}`, "DELETE"),
};

export const servicoHCurricular = {
  criar: (dadosHCurricular) =>
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.HCURRICULAR}`, "POST", dadosHCurricular),
  buscarPorId: (id) =>
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.HCURRICULAR}/${id}`, "GET"),
  listarTodos: () => 
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.HCURRICULAR}`, "GET"),
  atualizar: (id, dadosHCurricular) =>
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.HCURRICULAR}/${id}`, "PUT", dadosHCurricular),
  deletar: (id) => 
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.HCURRICULAR}/${id}`, "DELETE"),
};

export const servicoHProfissional = {
  criar: (dadosHProfissional) =>
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.HPROFISSIONAL}`, "POST", dadosHProfissional),
  buscarPorId: (id) =>
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.HPROFISSIONAL}/${id}`, "GET"),
  listarTodos: () => 
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.HPROFISSIONAL}`, "GET"),
  atualizar: (id, dadosHProfissional) =>
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.HPROFISSIONAL}/${id}`, "PUT", dadosHProfissional),
  deletar: (id) =>
    fazerRequisicao(`${URL_BASE}${API_CONFIG.ENDPOINTS.HPROFISSIONAL}/${id}`, "DELETE"),
};

export const servicoCadastro = {
  validarEmail: async (email) => {
    try {
      const resposta = await fazerRequisicao(
        `${URL_BASE}${API_CONFIG.ENDPOINTS.AUTH}/validar-email`,
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
        `${URL_BASE}${API_CONFIG.ENDPOINTS.AUTH}/login`, 
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
        `${URL_BASE}${API_CONFIG.ENDPOINTS.AUTH}/perfil/${id}`,
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
        `${URL_BASE}${API_CONFIG.ENDPOINTS.AUTH}/perfil/${id}`,
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
        `${URL_BASE}${API_CONFIG.ENDPOINTS.AUTH}/logout`, 
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