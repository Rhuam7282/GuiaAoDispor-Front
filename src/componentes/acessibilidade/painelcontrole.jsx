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
      
      // Calcular fatores de escala base mantendo proporções
      const fatorBase = configuracoes.tamanhoFonte / 100;
      
      const conteudoEstilo = `
        /* Aplicar escala proporcional a TODOS os elementos */
        :root {
          --fator-escala-global: ${fatorBase};
          --espacamento-letras-global: ${configuracoes.espacamentoLetras}px;
          --altura-linha-global: ${configuracoes.alturaLinha};
        }
        
        /* Escalar elementos de texto mantendo hierarquia */
        body {
          font-size: calc(1rem * var(--fator-escala-global)) !important;
          letter-spacing: var(--espacamento-letras-global) !important;
          line-height: var(--altura-linha-global) !important;
        }
        
        /* Manter proporções hierárquicas para diferentes elementos */
        h1 { font-size: calc(2rem * var(--fator-escala-global)) !important; }
        h2 { font-size: calc(1.5rem * var(--fator-escala-global)) !important; }
        h3 { font-size: calc(1.3rem * var(--fator-escala-global)) !important; }
        h4 { font-size: calc(1.1rem * var(--fator-escala-global)) !important; }
        h5 { font-size: calc(1rem * var(--fator-escala-global)) !important; }
        h6 { font-size: calc(0.9rem * var(--fator-escala-global)) !important; }
        
        small { font-size: calc(0.8rem * var(--fator-escala-global)) !important; }
        .texto-pequeno { font-size: calc(0.8rem * var(--fator-escala-global)) !important; }
        .texto-grande { font-size: calc(1.2rem * var(--fator-escala-global)) !important; }
        
        /* Botões e inputs também escalam */
        button, input, textarea, select {
          font-size: calc(1rem * var(--fator-escala-global)) !important;
          letter-spacing: var(--espacamento-letras-global) !important;
        }
        
        /* O próprio painel de acessibilidade também escala */
        .painelAcessibilidade {
          font-size: calc(14px * var(--fator-escala-global)) !important;
        }
        
        .painelAcessibilidade .tituloSecao {
          font-size: calc(13px * var(--fator-escala-global)) !important;
        }
        
        .painelAcessibilidade .botoesControle button {
          font-size: calc(12px * var(--fator-escala-global)) !important;
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
        break;
      default: 
        break;
    }
  }, [configuracoes.modoContraste]);

  // Aplicar modo escuro seguindo a paleta do site
  useEffect(() => {
    const raiz = document.documentElement;
    
    if (configuracoes.modoEscuro === 1) {
      raiz.classList.add('temaEscuro');
      // Aplicar cores do tema escuro mantendo identidade visual
      document.documentElement.style.setProperty('--corNeutraClara', '#1a1a1a');
      document.documentElement.style.setProperty('--corNeutraEscura', '#f5f5f5');
      document.documentElement.style.setProperty('--corMarromEscuro', '#e8e8e8');
      document.documentElement.style.setProperty('--corMarromDestaque', '#8B4513');
      document.documentElement.style.setProperty('--corMarromDestaqueTransparente', 'rgba(139, 69, 19, 0.3)');
      document.documentElement.style.setProperty('--corAzulDestaque', '#1e90ff');
    } else {
      raiz.classList.remove('temaEscuro');
      // Restaurar cores originais (elas serão pegas do index.css)
      document.documentElement.style.removeProperty('--corNeutraClara');
      document.documentElement.style.removeProperty('--corNeutraEscura');
      document.documentElement.style.removeProperty('--corMarromEscuro');
      document.documentElement.style.removeProperty('--corMarromDestaque');
      document.documentElement.style.removeProperty('--corMarromDestaqueTransparente');
      document.documentElement.style.removeProperty('--corAzulDestaque');
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
                  document.documentElement.style.removeProperty('--corNeutraClara');
                  document.documentElement.style.removeProperty('--corNeutraEscura');
                  document.documentElement.style.removeProperty('--corMarromEscuro');
                  document.documentElement.style.removeProperty('--corMarromDestaque');
                  document.documentElement.style.removeProperty('--corMarromDestaqueTransparente');
                  document.documentElement.style.removeProperty('--corAzulDestaque');
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