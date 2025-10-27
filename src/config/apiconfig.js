// Configurações consolidadas da API - Arquivo único
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  ENDPOINTS: {
    USERS: "/api/usuarios",
    AUTH: "/api/auth",
    PROFILES: "/api/profiles",
    LOCATIONS: "/api/localizacoes",
    PROFESSIONALS: "/api/profissionais",
    EVALUATIONS: "/api/avaliacoes",
    HCURRICULAR: "/api/hcurriculares",
    HPROFISSIONAL: "/api/hprofissionais"
  },
  TIMEOUT: 10000
};

// Configurações do Google OAuth
export const GOOGLE_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  SCOPE: "profile email"
};

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
  GOOGLE_CONFIG,
  AUTH_CONFIG,
  TIPOS_PERFIL,
  API_STATUS
};