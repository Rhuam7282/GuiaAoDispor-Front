import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Corpo from "../../componentes/layout/corpo.jsx";
import InformacoesPerfil from "./componentes/informacoesperfil.jsx";
import HistoricoAcademicoPerfil from "./componentes/historicoacademicoperfil.jsx";
import HistoricoProfissionalPerfil from "./componentes/historicoprofissionalperfil.jsx";
import SolicitarAvaliacao from "./componentes/solicitaravaliacao.jsx";
import ListaAvaliacoes from "./componentes/listaaavaliacoes.jsx";
import AvaliacoesPendentes from "./componentes/avaliacoespendenetes.jsx";
import {
  servicoProfissional,
  servicoHCurricular,
  servicoHProfissional,
  servicoAuth,
} from "../../servicos/api.js";
import { useAuth } from "../../contextos/autenticacao.jsx";
import "./perfil.css";

import { LogOut, Save, X } from "lucide-react";

import logo from "../../recursos/icones/logo.png";

const Perfil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario, estaAutenticado, logout } = useAuth();

  const [dadosPerfil, setDadosPerfil] = useState(null);
  const [historicoAcademico, setHistoricoAcademico] = useState([]);
  const [historicoProfissional, setHistoricoProfissional] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const informacoesPerfilRef = useRef();

  // Dados estáticos para fallback
  const dadosEstaticos = {
    nome: "Maria Silva",
    foto: mariaSilva,
    localizacao: "Assis Chateaibriand, PR",
    descricao: "Enfermeira especializada in geriatria com 10 anos de experiência.",
    avaliacao: 4.8,
    email: "",
    face: "",
    inst: "",
    linkedin: "",
    historicoProfissional: [
      {
        nome: "Hospital Micheletto - Assis Chateaubriand",
        imagem: micheleto,
        alt: "Hospital Micheletto",
      },
      {
        nome: "Instituto Butantan - São Paulo",
        imagem: butantan,
        alt: "Instituto Butantan",
      },
      {
        nome: "Hospital Beneficente Português - Belém",
        imagem: portugues,
        alt: "Hospital Beneficente Português",
      },
    ],
    historicoAcademico: [
      {
        nome: "Graduação em Enfermagem",
        instituicao: "USP",
        periodo: "2010-2014",
      },
      {
        nome: "Pós-graduação em Geriatria",
        instituicao: "UNIFESP",
        periodo: "2015-2017",
      },
    ],
  };

  // Função para verificar se é o perfil do próprio usuário
  const isPerfilProprio = () => {
    if (!estaAutenticado() || !usuario) return false;
    
    if (id) {
      return usuario._id === id;
    }
    
    return true;
  };

  // Função para logout
  const handleLogout = () => {
    logout();
  };

  // Sair do modo edição e recarregar página
  const sairModoEdicaoERecarregar = () => {
    setModoEdicao(false);
    setMensagem("Perfil atualizado com sucesso!");
    setTimeout(() => {
      setMensagem("");
      window.location.reload();
    }, 2000);
  };

  // Função para salvar todas as alterações
  const handleSalvarTudo = async () => {
    if (!isPerfilProprio()) {
      setMensagem("Você não tem permissão para editar este perfil.");
      return;
    }

    setSalvando(true);
    try {
      if (informacoesPerfilRef.current) {
        const sucesso = await informacoesPerfilRef.current.salvarEdicoes();
        if (sucesso) {
          sairModoEdicaoERecarregar();
        } else {
          setMensagem("Erro ao salvar alterações. Verifique os campos obrigatórios.");
        }
      }
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      setMensagem("Erro ao salvar alterações. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelarEdicao = () => {
    setModoEdicao(false);
    carregarDadosPerfil();
  };

  // Função para formatar dados do perfil
  const formatarDadosPerfil = (dadosUsuario) => {
    if (!dadosUsuario) return dadosEstaticos;

    let localizacaoFormatada = "Localização não informada";
    if (dadosUsuario.localizacao) {
      if (typeof dadosUsuario.localizacao === "string") {
        localizacaoFormatada = dadosUsuario.localizacao;
      } else if (typeof dadosUsuario.localizacao === "object") {
        localizacaoFormatada =
          dadosUsuario.localizacao.nome ||
          `${dadosUsuario.localizacao.cidade || ""} ${dadosUsuario.localizacao.estado || ""}`.trim() ||
          "Localização não informada";
      }
    }

    let contatosFormatados = [];
    if (dadosUsuario.contatos && Array.isArray(dadosUsuario.contatos)) {
      contatosFormatados = dadosUsuario.contatos;
    } else {
      if (dadosUsuario.email) {
        contatosFormatados.push({ tipo: "Email", valor: dadosUsuario.email });
      }
      if (dadosUsuario.face) {
        contatosFormatados.push({ tipo: "Facebook", valor: dadosUsuario.face });
      }
      if (dadosUsuario.inst) {
        contatosFormatados.push({ tipo: "Instagram", valor: dadosUsuario.inst });
      }
      if (dadosUsuario.linkedin) {
        contatosFormatados.push({ tipo: "LinkedIn", valor: dadosUsuario.linkedin });
      }
    }

    return {
      _id: dadosUsuario._id,
      nome: dadosUsuario.nome || "Nome não informado",
      foto: dadosUsuario.foto || dadosUsuario.picture || logo,
      localizacao: localizacaoFormatada,
      descricao: dadosUsuario.desc || dadosUsuario.descricao || "Descrição não informada",
      avaliacao: dadosUsuario.avaliacao || dadosUsuario.nota || 0,
      email: dadosUsuario.email || "",
      contatos: contatosFormatados,
      tipoPerfil: dadosUsuario.tipoPerfil || (dadosUsuario.desc ? "Profissional" : "Pessoal"),
    };
  };

  // Função para carregar perfil profissional
  const carregarPerfilProfissional = async (profissionalId) => {
    try {
      const [perfilResposta, hcurricularResposta, hprofissionalResposta] = await Promise.all([
        servicoProfissional.buscarPorId(profissionalId).catch(() => null),
        servicoHCurricular.listarTodos().catch(() => ({ data: [] })),
        servicoHProfissional.listarTodos().catch(() => ({ data: [] })),
      ]);

      if (!perfilResposta || !perfilResposta.data) {
        const respostaUsuario = await servicoAuth.buscarPerfilLogado(profissionalId);
        if (respostaUsuario && respostaUsuario.data) {
          const perfilFormatado = formatarDadosPerfil(respostaUsuario.data);
          setDadosPerfil(perfilFormatado);
          return;
        }
        throw new Error("Perfil não encontrado");
      }

      const perfil = perfilResposta.data;
      const perfilFormatado = formatarDadosPerfil(perfil);
      setDadosPerfil(perfilFormatado);

      const hcurriculares = Array.isArray(hcurricularResposta?.data)
        ? hcurricularResposta.data.filter((hc) => hc.profissional && hc.profissional._id === profissionalId)
        : [];

      const hprofissionais = Array.isArray(hprofissionalResposta?.data)
        ? hprofissionalResposta.data.filter((hp) => hp.profissional && hp.profissional._id === profissionalId)
        : [];

      const academicoFormatado = hcurriculares.map((hc) => ({
        _id: hc._id,
        nome: hc.nome || "Curso não informado",
        instituicao: hc.instituicao || hc.desc || "Instituição não informada",
        periodo: hc.periodo || "Período não informado",
        descricao: hc.descricao || hc.desc || "",
        imagem: hc.foto || "",
      }));

      const profissionalFormatado = hprofissionais.map((hp) => ({
        _id: hp._id,
        nome: hp.nome || "Empresa não informada",
        imagem: hp.foto || hp.imagem || micheleto,
        alt: hp.nome || "Empresa",
        descricao: hp.descricao || hp.desc || "",
      }));

      setHistoricoAcademico(academicoFormatado);
      setHistoricoProfissional(profissionalFormatado);

    } catch (error) {
      console.error("❌ Erro ao carregar perfil profissional:", error);
      throw error;
    }
  };

  // Função para carregar históricos do profissional
  const carregarHistoricosProfissional = async (profissionalId) => {
    try {
      const [hcurricularResposta, hprofissionalResposta] = await Promise.all([
        servicoHCurricular.listarTodos().catch(() => ({ data: [] })),
        servicoHProfissional.listarTodos().catch(() => ({ data: [] })),
      ]);

      const hcurriculares = Array.isArray(hcurricularResposta?.data)
        ? hcurricularResposta.data.filter((hc) => hc.profissional && hc.profissional._id === profissionalId)
        : [];

      const hprofissionais = Array.isArray(hprofissionalResposta?.data)
        ? hprofissionalResposta.data.filter((hp) => hp.profissional && hp.profissional._id === profissionalId)
        : [];

      const academicoFormatado = hcurriculares.map((hc) => ({
        _id: hc._id,
        nome: hc.nome || "Curso não informado",
        instituicao: hc.instituicao || hc.desc || "Instituição não informada",
        periodo: hc.periodo || "Período não informado",
        descricao: hc.descricao || hc.desc || "",
        imagem: hc.foto || "",
      }));

      const profissionalFormatado = hprofissionais.map((hp) => ({
        _id: hp._id,
        nome: hp.nome || "Empresa não informada",
        imagem: hp.foto || hp.imagem || micheleto,
        alt: hp.nome || "Empresa",
        descricao: hp.descricao || hp.desc || "",
      }));

      setHistoricoAcademico(academicoFormatado);
      setHistoricoProfissional(profissionalFormatado);
    } catch (error) {
      console.error("Erro ao carregar históricos do profissional:", error);
      setHistoricoAcademico([]);
      setHistoricoProfissional([]);
    }
  };

  // Função principal para carregar dados do perfil
  const carregarDadosPerfil = async () => {
    setCarregando(true);
    setErro(null);

    try {
      // CASO 1: Usuário logado acessando próprio perfil (sem ID na URL)
      if (!id && estaAutenticado() && usuario) {
        try {
          const resposta = await servicoAuth.buscarPerfilLogado(usuario._id);
          if (resposta && resposta.status === "sucesso" && resposta.data) {
            const perfilFormatado = formatarDadosPerfil(resposta.data);
            setDadosPerfil(perfilFormatado);

            if (resposta.data.tipoPerfil === "Profissional" || resposta.data.desc) {
              await carregarHistoricosProfissional(usuario._id);
            } else {
              setHistoricoAcademico([]);
              setHistoricoProfissional([]);
            }
          } else {
            throw new Error("Resposta da API não contém dados");
          }
        } catch (erroApi) {
          const perfilFormatado = formatarDadosPerfil(usuario);
          setDadosPerfil(perfilFormatado);

          if (usuario.tipoPerfil === "Profissional" || usuario.desc) {
            await carregarHistoricosProfissional(usuario._id);
          } else {
            setHistoricoAcademico([]);
            setHistoricoProfissional([]);
          }

          setErro(`Dados carregados localmente. Erro da API: ${erroApi.message}`);
        }
      }
      // CASO 2: Perfil específico por ID
      else if (id) {
        try {
          await carregarPerfilProfissional(id);
        } catch (error) {
          try {
            const respostaUsuario = await servicoAuth.buscarPerfilLogado(id);
            if (respostaUsuario && respostaUsuario.data) {
              const perfilFormatado = formatarDadosPerfil(respostaUsuario.data);
              setDadosPerfil(perfilFormatado);
              setHistoricoAcademico([]);
              setHistoricoProfissional([]);
            } else {
              throw error;
            }
          } catch (fallbackError) {
            throw error;
          }
        }
      }
      // CASO 3: Usuário não logado
      else {
        setDadosPerfil(dadosEstaticos);
        setHistoricoAcademico(dadosEstaticos.historicoAcademico);
        setHistoricoProfissional(dadosEstaticos.historicoProfissional);
      }
    } catch (error) {
      console.error("❌ Erro geral ao carregar perfil:", error);
      setErro("Erro ao carregar dados do perfil. Tente novamente.");
      setDadosPerfil(dadosEstaticos);
      setHistoricoAcademico(dadosEstaticos.historicoAcademico);
      setHistoricoProfissional(dadosEstaticos.historicoProfissional);
    } finally {
      setCarregando(false);
    }
  };

  // Função para verificar se é um perfil profissional
  const isPerfilProfissional = () => {
    if (id) return true;
    if (dadosPerfil?.tipoPerfil === "Profissional") return true;
    
    const temDescricaoPersonalizada =
      dadosPerfil?.descricao &&
      dadosPerfil.descricao !== "Descrição não informada" &&
      dadosPerfil.descricao !== dadosEstaticos.descricao;

    return temDescricaoPersonalizada;
  };

  // Históricos removidos
  const [historicosRemovidos, setHistoricosRemovidos] = useState({
    academicos: [],
    profissionais: [],
  });

  // Funções para gerenciar históricos
  const adicionarHistoricoAcademico = () => {
    setHistoricoAcademico((prev) => [
      ...prev,
      { _id: `temp-${Date.now()}`, nome: "", instituicao: "", periodo: "", descricao: "", imagem: "" },
    ]);
  };

  const removerHistoricoAcademico = (index) => {
    const item = historicoAcademico[index];
    if (item._id && !item._id.startsWith("temp-")) {
      setHistoricosRemovidos((prev) => ({
        ...prev,
        academicos: [...prev.academicos, item._id],
      }));
    }
    setHistoricoAcademico((prev) => prev.filter((_, i) => i !== index));
  };

  const alterarHistoricoAcademico = (index, campo, valor) => {
    setHistoricoAcademico((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [campo]: valor } : item))
    );
  };

  const adicionarHistoricoProfissional = () => {
    setHistoricoProfissional((prev) => [
      ...prev,
      { _id: `temp-${Date.now()}`, nome: "", imagem: "", descricao: "" },
    ]);
  };

  const removerHistoricoProfissional = (index) => {
    const item = historicoProfissional[index];
    if (item._id && !item._id.startsWith("temp-")) {
      setHistoricosRemovidos((prev) => ({
        ...prev,
        profissionais: [...prev.profissionais, item._id],
      }));
    }
    setHistoricoProfissional((prev) => prev.filter((_, i) => i !== index));
  };

  const alterarHistoricoProfissional = (index, campo, valor) => {
    setHistoricoProfissional((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [campo]: valor } : item))
    );
  };

  // Salvar históricos
  const salvarHistoricos = async () => {
    try {
      for (const id of historicosRemovidos.academicos) {
        await servicoHCurricular.deletar(id);
      }
      for (const id of historicosRemovidos.profissionais) {
        await servicoHProfissional.deletar(id);
      }

      for (const hc of historicoAcademico) {
        if (hc._id.startsWith("temp-")) {
          await servicoHCurricular.criar({
            nome: hc.nome,
            instituicao: hc.instituicao,
            periodo: hc.periodo,
            desc: hc.descricao,
            foto: hc.imagem,
            profissional: usuario._id,
          });
        } else {
          await servicoHCurricular.atualizar(hc._id, {
            nome: hc.nome,
            instituicao: hc.instituicao,
            periodo: hc.periodo,
            desc: hc.descricao,
            foto: hc.imagem,
          });
        }
      }

      for (const hp of historicoProfissional) {
        if (hp._id.startsWith("temp-")) {
          await servicoHProfissional.criar({
            nome: hp.nome,
            desc: hp.descricao,
            foto: hp.imagem,
            profissional: usuario._id,
          });
        } else {
          await servicoHProfissional.atualizar(hp._id, {
            nome: hp.nome,
            desc: hp.descricao,
            foto: hp.imagem,
          });
        }
      }

      setHistoricosRemovidos({ academicos: [], profissionais: [] });
      await carregarHistoricosProfissional(usuario._id);
    } catch (error) {
      console.error("Erro ao salvar históricos:", error);
      throw error;
    }
  };

  // useEffect para carregar dados
  useEffect(() => {
    console.log("🔍 Perfil - ID da URL:", id);
    console.log("🔍 Perfil - Usuário autenticado:", estaAutenticado());

    // Se não há ID e não está autenticado, não tentar carregar (já vai ser tratado no render)
    if (!id && (!estaAutenticado() || !usuario)) {
      setCarregando(false);
      return;
    }

    if (!isPerfilProprio()) {
      setModoEdicao(false);
    }

    carregarDadosPerfil();
  }, [id, usuario, estaAutenticado]);

  if (carregando) {
    return (
      <Corpo>
        <div className="containerPerfil container">
          <div className="container textoCentro paddingGrande">
            <div className="carregando">
              <h2>Carregando perfil...</h2>
            </div>
          </div>
        </div>
      </Corpo>
    );
  }

  // Se não há ID e não está autenticado, mostrar mensagem
  if (!id && (!estaAutenticado() || !usuario)) {
    return (
      <Corpo>
        <div className="containerPerfil">
          <div className="container textoCentro paddingGrande">
            <div className="erro">
              <h2>Perfil não disponível</h2>
              <p>Faça login para ver seu perfil ou selecione um profissional na página de Qualificados.</p>
              <div className="botoesAcao">
                <button
                  onClick={() => navigate("/qualificados")}
                  className="botao botaoPrimario"
                >
                  Ver Profissionais
                </button>
                <button
                  onClick={() => navigate("/cadastro")}
                  className="botao botaoSecundario"
                >
                  Fazer Cadastro
                </button>
              </div>
            </div>
          </div>
        </div>
      </Corpo>
    );
  }

  if (erro && !dadosPerfil) {
    return (
      <Corpo>
        <div className="containerPerfil">
          <div className="container">
            <div className="erro textoCentro paddingGrande">
              <h2>Erro ao carregar perfil</h2>
              <p>{erro}</p>
              <button
                onClick={() => window.location.reload()}
                className="botao botaoPrimario"
                style={{ marginTop: "20px" }}
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </Corpo>
    );
  }

  if (!dadosPerfil) {
    return (
      <Corpo>
        <div className="containerPerfil">
          <div className="container textoCentro paddingGrande">
            <div className="erro">
              <h2>Perfil não disponível</h2>
              <button
                onClick={() => navigate("/")}
                className="botao botaoPrimario"
                style={{ marginTop: "20px" }}
              >
                Voltar para início
              </button>
            </div>
          </div>
        </div>
      </Corpo>
    );
  }

  return (
    <Corpo>
      <div className="containerPerfil">
        <div className="container">
          <div>
            <h1 className="titulo">{dadosPerfil.nome}</h1>
            <div className="botoesCabecalho">
              {estaAutenticado() && isPerfilProprio() && (
                <>
                  {!modoEdicao ? (
                    <button
                      className="botao botaoPrimario"
                      onClick={() => setModoEdicao(true)}
                    >
                      Editar Perfil
                    </button>
                  ) : (
                    <>
                      <button
                        className="botao botaoPrimario"
                        onClick={handleSalvarTudo}
                        disabled={salvando}
                      >
                        <Save size={16} />
                        {salvando ? "Salvando..." : "Salvar Alterações"}
                      </button>
                      <button
                        className="botao botaoSecundario"
                        onClick={handleCancelarEdicao}
                        disabled={salvando}
                      >
                        <X size={16} />
                        Cancelar
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="botao botaoSecundario"
                  >
                    <LogOut size={16} />
                    <span>Sair</span>
                  </button>
                </>
              )}
              
              {estaAutenticado() && !isPerfilProprio() && (
                <div className="alert alert-info">
                  <small>Você está visualizando o perfil de outro usuário. A edição não está disponível.</small>
                </div>
              )}
            </div>
          </div>

          {erro && (
            <div className="aviso-erro">
              <p>⚠️ {erro}</p>
            </div>
          )}

          {mensagem && (
            <div
              className={`mensagem ${
                mensagem.includes("Erro") ? "mensagemErro" : "mensagemSucesso"
              } margemInferiorPequena`}
            >
              {mensagem}
            </div>
          )}

          <InformacoesPerfil
            ref={informacoesPerfilRef}
            dadosPerfil={dadosPerfil}
            estaAutenticado={estaAutenticado}
            usuario={usuario}
            id={id || (usuario ? usuario._id : null)}
            modoEdicao={modoEdicao && isPerfilProprio()}
            setModoEdicao={setModoEdicao}
            historicoAcademico={historicoAcademico}
            historicoProfissional={historicoProfissional}
            adicionarHistoricoAcademico={adicionarHistoricoAcademico}
            removerHistoricoAcademico={removerHistoricoAcademico}
            alterarHistoricoAcademico={alterarHistoricoAcademico}
            adicionarHistoricoProfissional={adicionarHistoricoProfissional}
            removerHistoricoProfissional={removerHistoricoProfissional}
            alterarHistoricoProfissional={alterarHistoricoProfissional}
            salvarHistoricos={salvarHistoricos}
            historicosRemovidos={historicosRemovidos}
            isPerfilProprio={isPerfilProprio()}
          />

          {isPerfilProfissional() && (
            <div className="flexColuna gapGrande">
              <HistoricoAcademicoPerfil
                historicoAcademico={historicoAcademico}
                modoEdicao={modoEdicao && isPerfilProprio()}
                adicionarHistoricoAcademico={adicionarHistoricoAcademico}
                removerHistoricoAcademico={removerHistoricoAcademico}
                alterarHistoricoAcademico={alterarHistoricoAcademico}
                isPerfilProprio={isPerfilProprio()}
              />
              <HistoricoProfissionalPerfil
                historicoProfissional={historicoProfissional}
                nomePerfil={dadosPerfil.nome}
                modoEdicao={modoEdicao && isPerfilProprio()}
                adicionarHistoricoProfissional={adicionarHistoricoProfissional}
                removerHistoricoProfissional={removerHistoricoProfissional}
                alterarHistoricoProfissional={alterarHistoricoProfissional}
                isPerfilProprio={isPerfilProprio()}
              />
            </div>
          )}

          {/* Seção de Avaliações para profissionais */}
          {isPerfilProfissional() && (
            <>
              {/* O profissional pode solicitar avaliações apenas no próprio perfil */}
              {isPerfilProprio() && (
                <SolicitarAvaliacao 
                  profissionalId={id || usuario._id} 
                  profissionalNome={dadosPerfil.nome}
                />
              )}
              
              {/* Lista de avaliações confirmadas */}
              <ListaAvaliacoes profissionalId={id || usuario._id} />
            </>
          )}

          {/* Avaliações pendentes para usuários comuns */}
          {isPerfilProprio() && !isPerfilProfissional() && (
            <AvaliacoesPendentes usuarioId={usuario._id} />
          )}

        </div>
      </div>
    </Corpo>
  );
};

export default Perfil;