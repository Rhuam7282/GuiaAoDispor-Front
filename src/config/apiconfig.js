export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:3001',
  TIMEOUT: 15000,
  
  ENDPOINTS: {
    AUTH: '/api/auth',
    USERS: '/api/usuarios', 
    PROFESSIONALS: '/api/profissionais',
    LOCATIONS: '/api/localizacoes',
    EVALUATIONS: '/api/avaliacoes',
    HCURRICULAR: '/api/hcurriculares',
    HPROFISSIONAL: '/api/hprofissionais'
  }
};

console.log('🔧 Configuração API carregada:', {
  BASE_URL: API_CONFIG.BASE_URL,
  ambiente: import.meta.env.MODE
});

// Configurações de autenticação
export const AUTH_CONFIG = {
  TOKEN_KEY: "auth_token",
  USER_KEY: "user_data",
  REFRESH_TOKEN_KEY: "refresh_token",
  TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000 // 7 dias em milissegundos
};

// Tipos de perfil disponíveis
export const TIPOS_PERFIL = {
  PESSOAL: "Pessoal",
  PROFISSIONAL: "Profissional",
};

// Status de resposta da API
export const API_STATUS = {
  SUCCESS: "sucesso",
  ERROR: "erro",
  LOADING: "carregando"
};

export default {
  API_CONFIG,
  AUTH_CONFIG,
  TIPOS_PERFIL,
  API_STATUS
};