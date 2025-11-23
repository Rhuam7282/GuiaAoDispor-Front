import React, { useState } from 'react';
import { Image, Heading, LinkIcon } from 'lucide-react';

const SecaoConteudo = ({ configuracoes, atualizarConfiguracao }) => {
  const [modoDestacarLinks, setModoDestacarLinks] = useState(0);

  const alternarModoDestacarLinks = () => {
    const novoModo = (modoDestacarLinks + 1) % 4; // 0-3
    setModoDestacarLinks(novoModo);
    atualizarConfiguracao('destacarLinks', novoModo);
  };

  const obterTextoDestacarLinks = () => {
    switch (modoDestacarLinks) {
      case 0: return 'Desativado';
      case 1: return 'Modo Suave';
      case 2: return 'Modo Cores';
      case 3: return 'Modo Borda';
      default: return 'Desativado';
    }
  };

  return (
    <>
      <div className="secao">
        <h4 className="tituloSecao">
          <Image size={16} /> Remover Imagens
        </h4>
        <div className="botoesControle">
          <button 
            onClick={() => atualizarConfiguracao('removerImagens', !configuracoes.removerImagens)} 
            className={configuracoes.removerImagens ? 'ativo' : ''}
            aria-pressed={configuracoes.removerImagens}
          >
            {configuracoes.removerImagens ? 'Ativado' : 'Desativado'}
          </button>
        </div>
      </div>

      <div className="secao">
        <h4 className="tituloSecao">
          <Heading size={16} /> Remover Cabeçalhos
        </h4>
        <div className="botoesControle">
          <button 
            onClick={() => atualizarConfiguracao('removerCabecalhos', !configuracoes.removerCabecalhos)} 
            className={configuracoes.removerCabecalhos ? 'ativo' : ''}
            aria-pressed={configuracoes.removerCabecalhos}
          >
            {configuracoes.removerCabecalhos ? 'Ativado' : 'Desativado'}
          </button>
        </div>
      </div>

      <div className="secao">
        <h4 className="tituloSecao">
          <LinkIcon size={16} /> Destacar Elementos Clicáveis
        </h4>
        <div className="botoesControle">
          <button 
            onClick={alternarModoDestacarLinks}
            className={modoDestacarLinks !== 0 ? 'ativo' : ''}
            aria-pressed={modoDestacarLinks !== 0}
          >
            {obterTextoDestacarLinks()}
          </button>
        </div>
        <p style={{fontSize: '11px', margin: '5px 0 0 0', color: '#666'}}>
          {modoDestacarLinks === 1 && 'Azul suave com borda sutil'}
          {modoDestacarLinks === 2 && 'Amarelo forte com borda vermelha'}
          {modoDestacarLinks === 3 && 'Borda laranja tracejada'}
        </p>
      </div>
    </>
  );
};

export default SecaoConteudo;