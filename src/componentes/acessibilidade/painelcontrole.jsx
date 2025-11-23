// src/componentes/acessibilidade/PainelControle.jsx
import React, { useState, useEffect } from 'react';
import { PersonStanding, X, Type, AlignJustify, MoreHorizontal, Eye, Contrast, Moon, Image, Heading, LinkIcon, BookOpen, Pause, MousePointer } from 'lucide-react';
import { useConfiguracaoAcessibilidade } from './ganchos/useconfiguracaoacessibilidade.jsx';
import { useGuiasLeitura } from './ganchos/useguiasleitura';
import SecaoTexto from './secaotexto/secaotexto';
import SecaoVisao from './secaovisao/secaovisao';
import SecaoConteudo from './secaoconteudo/secaoconteudo';
import SecaoAnimacoesCursor from './secaoanimacoescursor/secaoanimacoescursor';
import MaskLeitura from './mascaraleitura/mascaraleitura';
import GuiaLeitura from './guialeitura/guialeitura';

import './painelcontrole.css';

const PainelControle = () => {
  const [estaAberto, setEstaAberto] = useState(false);
  const [maskLeituraAtiva, setMaskLeituraAtiva] = useState(false);
  const [guiaLeituraAtiva, setGuiaLeituraAtiva] = useState(false);

  const { configuracoes, atualizarConfiguracao } = useConfiguracaoAcessibilidade();
  useGuiasLeitura(configuracoes.guiaLeitura);

  // Aplicar estilos de texto em TODOS os elementos (incluindo o painel) proporcionalmente
  useEffect(() => {
    const aplicarEstilosTexto = () => {
      let estiloDinamico = document.getElementById('estiloAcessibilidadeTexto');
      
      const fatorBase = configuracoes.tamanhoFonte / 100;
      
      const conteudoEstilo = `
        /* Aplicar escala GLOBAL a TODOS os elementos */
        * {
          font-size: calc(1em * ${fatorBase}) !important;
          letter-spacing: ${configuracoes.espacamentoLetras}px !important;
          line-height: ${configuracoes.alturaLinha} !important;
        }
        
        /* Manter proporções hierárquicas */
        h1 { font-size: calc(2em * ${fatorBase}) !important; }
        h2 { font-size: calc(1.5em * ${fatorBase}) !important; }
        h3 { font-size: calc(1.3em * ${fatorBase}) !important; }
        h4 { font-size: calc(1.1em * ${fatorBase}) !important; }
        h5 { font-size: calc(1em * ${fatorBase}) !important; }
        h6 { font-size: calc(0.9em * ${fatorBase}) !important; }
        
        /* Elementos específicos que podem ter tamanhos fixos */
        button, input, textarea, select {
          font-size: calc(1em * ${fatorBase}) !important;
        }
        
        /* O painel de acessibilidade também escala */
        .painelAcessibilidade {
          font-size: calc(14px * ${fatorBase}) !important;
        }
        
        .painelAcessibilidade .tituloSecao {
          font-size: calc(13px * ${fatorBase}) !important;
        }
        
        .painelAcessibilidade .botoesControle button {
          font-size: calc(12px * ${fatorBase}) !important;
        }
      `;

      if (!estiloDinamico) {
        const style = document.createElement('style');
        style.id = 'estiloAcessibilidadeTexto';
        document.head.appendChild(style);
        estiloDinamico = style;
      }
      estiloDinamico.textContent = conteudoEstilo;
    };

    aplicarEstilosTexto();
  }, [configuracoes.tamanhoFonte, configuracoes.espacamentoLetras, configuracoes.alturaLinha]);

  // Aplicar modo de contraste
  useEffect(() => {
    const raiz = document.documentElement;
    raiz.classList.remove('contrasteLeve', 'contrasteIntenso');
    
    switch (configuracoes.modoContraste) {
      case 1: 
        raiz.classList.add('contrasteLeve');
        break;
      case 2: 
        raiz.classList.add('contrasteIntenso');
        // Forçar contraste máximo
        document.body.style.setProperty('--corNeutraClara', '#000000', 'important');
        document.body.style.setProperty('--corMarromEscuro', '#ffffff', 'important');
        document.body.style.setProperty('--corAzulDestaque', '#ffff00', 'important');
        break;
      default: 
        // Reset para cores originais
        document.body.style.removeProperty('--corNeutraClara');
        document.body.style.removeProperty('--corMarromEscuro');
        document.body.style.removeProperty('--corAzulDestaque');
        break;
    }
  }, [configuracoes.modoContraste]);

  // Aplicar modo escuro com a paleta fornecida
  useEffect(() => {
    const raiz = document.documentElement;
    
    if (configuracoes.modoEscuro === 1) {
      raiz.classList.add('temaEscuro');
      
      // Aplicar paleta de cores do modo escuro COM CONTRASTE
      document.documentElement.style.setProperty('--corNeutraEscura', '#fdf9ee');
      document.documentElement.style.setProperty('--corNeutraClara', '#1b3133'); // Fundo mais escuro para melhor contraste
      document.documentElement.style.setProperty('--corMarromDestaque', '#d3a27f');
      document.documentElement.style.setProperty('--corMarromOfuscado', '#94877e');
      document.documentElement.style.setProperty('--corMarromEscuro', '#fdf9ee'); // Texto claro
      document.documentElement.style.setProperty('--corAzulDestaque', '#7fccd4');
      document.documentElement.style.setProperty('--corAzulOfuscado', '#6e7d7f');
      document.documentElement.style.setProperty('--corAzulEscuro', '#7fccd4'); // Azul mais visível
      document.documentElement.style.setProperty('--corMarromDestaqueTransparente', 'rgba(211, 162, 127, 0.4)');
      document.documentElement.style.setProperty('--corAzulDestaqueTransparente', 'rgba(127, 204, 212, 0.4)');
      
      // Forçar contraste adequado em elementos críticos
      const estiloContraste = `
        .temaEscuro body {
          background-color: #1b3133 !important;
          color: #fdf9ee !important;
        }
        
        .temaEscuro .painelAcessibilidade {
          background-color: #303538 !important;
          color: #fdf9ee !important;
          border-color: #d3a27f !important;
        }
        
        .temaEscuro .titulo-grupo,
        .temaEscuro .tituloSecao {
          color: #d3a27f !important;
          border-color: rgba(211, 162, 127, 0.5) !important;
        }
        
        .temaEscuro .botoesControle button {
          background: #54453b !important;
          color: #fdf9ee !important;
          border-color: #d3a27f !important;
        }
        
        .temaEscuro .botoesControle button.ativo {
          background: #7fccd4 !important;
          color: #1b3133 !important;
          font-weight: bold !important;
        }
        
        .temaEscuro .grupo-opcoes {
          border-color: rgba(211, 162, 127, 0.3) !important;
          background: rgba(48, 53, 56, 0.8) !important;
        }
        
        /* Garantir contraste em textos */
        .temaEscuro h1,
        .temaEscuro h2,
        .temaEscuro h3,
        .temaEscuro h4,
        .temaEscuro h5,
        .temaEscuro h6,
        .temaEscuro p,
        .temaEscuro span,
        .temaEscuro div:not(.botoesControle button):not(.botaoAlternarAcessibilidade) {
          color: #fdf9ee !important;
        }
        
        /* Links no modo escuro */
        .temaEscuro a {
          color: #7fccd4 !important;
          text-decoration: underline !important;
        }
        
        .temaEscuro a:hover {
          color: #d3a27f !important;
        }
      `;
      
      let estiloExistente = document.getElementById('estiloModoEscuroContraste');
      if (!estiloExistente) {
        const style = document.createElement('style');
        style.id = 'estiloModoEscuroContraste';
        document.head.appendChild(style);
        estiloExistente = style;
      }
      estiloExistente.textContent = estiloContraste;
      
    } else {
      raiz.classList.remove('temaEscuro');
      
      // Remover estilos forçados
      document.documentElement.style.removeProperty('--corNeutraEscura');
      document.documentElement.style.removeProperty('--corNeutraClara');
      document.documentElement.style.removeProperty('--corMarromDestaque');
      document.documentElement.style.removeProperty('--corMarromOfuscado');
      document.documentElement.style.removeProperty('--corMarromEscuro');
      document.documentElement.style.removeProperty('--corAzulDestaque');
      document.documentElement.style.removeProperty('--corAzulOfuscado');
      document.documentElement.style.removeProperty('--corAzulEscuro');
      document.documentElement.style.removeProperty('--corMarromDestaqueTransparente');
      document.documentElement.style.removeProperty('--corAzulDestaqueTransparente');
      
      // Remover estilo de contraste
      const estiloContraste = document.getElementById('estiloModoEscuroContraste');
      if (estiloContraste) {
        estiloContraste.remove();
      }
    }
  }, [configuracoes.modoEscuro]);

  // Aplicar outras configurações
  useEffect(() => {
    const raiz = document.documentElement;
    
    raiz.classList.toggle('removerImagens', configuracoes.removerImagens);
    raiz.classList.toggle('removerCabecalhos', configuracoes.removerCabecalhos);
    raiz.classList.toggle('pausarAnimacoes', configuracoes.pausarAnimacoes);
    raiz.classList.toggle('cursorGrande', configuracoes.cursorGrande);

    // Destacar elementos clicáveis baseado no modo
    raiz.classList.remove('destacarLinks1', 'destacarLinks2', 'destacarLinks3');
    if (configuracoes.destacarLinks === 1) {
      raiz.classList.add('destacarLinks1');
    } else if (configuracoes.destacarLinks === 2) {
      raiz.classList.add('destacarLinks2');
    } else if (configuracoes.destacarLinks === 3) {
      raiz.classList.add('destacarLinks3');
    }

    // Modos daltônicos
    raiz.classList.remove('daltonicoProtanopia', 'daltonicoDeuteranopia', 'daltonicoTritanopia');
    switch (configuracoes.modoDaltonico) {
      case 1: raiz.classList.add('daltonicoProtanopia'); break;
      case 2: raiz.classList.add('daltonicoDeuteranopia'); break;
      case 3: raiz.classList.add('daltonicoTritanopia'); break;
      default: break;
    }
  }, [
    configuracoes.removerImagens, 
    configuracoes.removerCabecalhos, 
    configuracoes.destacarLinks,
    configuracoes.modoDaltonico, 
    configuracoes.pausarAnimacoes, 
    configuracoes.cursorGrande
  ]);

  // Atalhos de teclado
  useEffect(() => {
    const manipularTeclaPressionada = (evento) => {
      if (evento.altKey && evento.key === 'a') {
        evento.preventDefault();
        setEstaAberto(prev => !prev);
      }
      if (evento.altKey && evento.key === 'c') {
        evento.preventDefault();
        atualizarConfiguracao('modoContraste', (configuracoes.modoContraste + 1) % 3);
      }
      if (evento.altKey && evento.key === 'd') {
        evento.preventDefault();
        atualizarConfiguracao('modoEscuro', (configuracoes.modoEscuro + 1) % 2);
      }
      if (evento.altKey && evento.key === '+') {
        evento.preventDefault();
        atualizarConfiguracao('tamanhoFonte', Math.min(configuracoes.tamanhoFonte + 10, 150));
      }
      if (evento.altKey && evento.key === '-') {
        evento.preventDefault();
        atualizarConfiguracao('tamanhoFonte', Math.max(configuracoes.tamanhoFonte - 10, 80));
      }
    };

    document.addEventListener('keydown', manipularTeclaPressionada);
    return () => document.removeEventListener('keydown', manipularTeclaPressionada);
  }, [configuracoes, atualizarConfiguracao]);

  const alternarPainel = () => setEstaAberto(!estaAberto);

  return (
    <div className="controlesAcessibilidade">
      <button
        className="botaoAlternarAcessibilidade"
        onClick={alternarPainel}
        aria-label={estaAberto ? "Fechar controles de acessibilidade" : "Abrir controles de acessibilidade (Alt + A)"}
        title={estaAberto ? "Fechar Controles" : "Controles de Acessibilidade (Alt + A)"}
      >
        {estaAberto ? <X size={24} /> : <PersonStanding size={24} />}
      </button>

      {estaAberto && (
        <div className="painelAcessibilidade" role="dialog" aria-label="Painel de controles de acessibilidade">
          <div className="cabecalhoAcessibilidade">
            <div className="tituloHeader">
              <PersonStanding size={16} />
              <h3>Acessibilidade</h3>
            </div>
          </div>

          <div className="conteudo-painel">
            <div className="grupo-opcoes">
              <h4 className="titulo-grupo">Texto</h4>
              <SecaoTexto
                configuracoes={configuracoes}
                atualizarConfiguracao={atualizarConfiguracao}
              />
            </div>

            <div className="grupo-opcoes">
              <h4 className="titulo-grupo">Visão</h4>
              <SecaoVisao
                configuracoes={configuracoes}
                atualizarConfiguracao={atualizarConfiguracao}
              />
            </div>

            <div className="grupo-opcoes">
              <h4 className="titulo-grupo">Conteúdo</h4>
              <SecaoConteudo
                configuracoes={configuracoes}
                atualizarConfiguracao={atualizarConfiguracao}
              />
            </div>

            <div className="grupo-opcoes">
              <h4 className="titulo-grupo">Animação & Cursor</h4>
              <SecaoAnimacoesCursor
                configuracoes={configuracoes}
                atualizarConfiguracao={atualizarConfiguracao}
              />
            </div>

            <div className="grupo-opcoes">
              <h4 className="titulo-grupo">Ferramentas de Leitura</h4>
              <div className="secao">
                <h4 className="tituloSecao">
                  <Eye size={16} /> Máscara de Leitura
                </h4>
                <div className="botoesControle">
                  <button
                    onClick={() => setMaskLeituraAtiva(!maskLeituraAtiva)}
                    className={maskLeituraAtiva ? 'ativo' : ''}
                  >
                    {maskLeituraAtiva ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              </div>

              <div className="secao">
                <h4 className="tituloSecao">
                  <AlignJustify size={16} /> Guia de Leitura
                </h4>
                <div className="botoesControle">
                  <button
                    onClick={() => setGuiaLeituraAtiva(!guiaLeituraAtiva)}
                    className={guiaLeituraAtiva ? 'ativo' : ''}
                  >
                    {guiaLeituraAtiva ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            </div>

            <div className="secao-redefinir">
              <button
                className="botao-redefinir-tudo"
                onClick={() => {
                  atualizarConfiguracao('tamanhoFonte', 100);
                  atualizarConfiguracao('espacamentoLetras', 0);
                  atualizarConfiguracao('alturaLinha', 1.5);
                  atualizarConfiguracao('modoContraste', 0);
                  atualizarConfiguracao('modoEscuro', 0);
                  atualizarConfiguracao('modoDaltonico', 0);
                  atualizarConfiguracao('removerImagens', false);
                  atualizarConfiguracao('removerCabecalhos', false);
                  atualizarConfiguracao('destacarLinks', 0);
                  atualizarConfiguracao('pausarAnimacoes', false);
                  atualizarConfiguracao('cursorGrande', false);
                  setMaskLeituraAtiva(false);
                  setGuiaLeituraAtiva(false);
                  
                  // Resetar estilos forçados
                  document.documentElement.style.removeProperty('--corNeutraEscura');
                  document.documentElement.style.removeProperty('--corNeutraClara');
                  document.documentElement.style.removeProperty('--corMarromDestaque');
                  document.documentElement.style.removeProperty('--corMarromOfuscado');
                  document.documentElement.style.removeProperty('--corMarromEscuro');
                  document.documentElement.style.removeProperty('--corAzulDestaque');
                  document.documentElement.style.removeProperty('--corAzulOfuscado');
                  document.documentElement.style.removeProperty('--corAzulEscuro');
                  document.documentElement.style.removeProperty('--corMarromDestaqueTransparente');
                  document.documentElement.style.removeProperty('--corAzulDestaqueTransparente');
                }}
              >
                Redefinir Tudo
              </button>
            </div>
          </div>

          <MaskLeitura ativo={maskLeituraAtiva} />
          <GuiaLeitura ativo={guiaLeituraAtiva} />
        </div>
      )}
    </div>
  );
}

export default PainelControle;