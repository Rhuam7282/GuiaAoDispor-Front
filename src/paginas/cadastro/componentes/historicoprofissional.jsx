import React from 'react';

const HistoricoProfissional = ({ 
  historicosProfissionais, 
  adicionarHistoricoProfissional, 
  removerHistoricoProfissional, 
  alterarHistoricoProfissional,
  alterarFotoHistoricoProfissional 
}) => {
  return (
    <div className="secao-historico-completa">
      <div className="cabecalho-secao-historico">
        <h3 className="titulo-secao-centralizado">Histórico Profissional</h3>
        <p className="texto-descricao-secao">Adicione suas experiências profissionais</p>
      </div>
      
      <div className="lista-historicos">
        {historicosProfissionais.map((hp, index) => (
          <div key={index} className="item-historico-lista">
            <div className="linha-campos-historico">
              <div className="container-upload-imagem-historico">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => alterarFotoHistoricoProfissional(index, e.target.files[0])}
                  className="input-arquivo-historico"
                  id={`hp-foto-${index}`}
                />
                <label 
                  htmlFor={`hp-foto-${index}`} 
                  className={`rotulo-upload-imagem-historico ${hp.foto ? 'com-imagem' : ''}`}
                >
                  {hp.foto ? (
                    <div className="preview-imagem-historico">
                      <img src={hp.foto} alt="Preview do histórico" />
                    </div>
                  ) : (
                    <span className="icone-upload">📁</span>
                  )}
                </label>
              </div>
              
              <input
                type="text"
                value={hp.nome}
                onChange={(e) => alterarHistoricoProfissional(index, 'nome', e.target.value)}
                placeholder="Cargo/Posição *"
                className="campo-titulo-historico"
              />
              
              <button
                type="button"
                onClick={() => removerHistoricoProfissional(index)}
                className="botao-remover-historico"
                title="Remover histórico"
              >
                ✕
              </button>
            </div>
            <textarea
              value={hp.desc}
              onChange={(e) => alterarHistoricoProfissional(index, 'desc', e.target.value)}
              placeholder="Descrição (empresa, período, responsabilidades...)"
              rows="2"
              className="textarea-historico"
            />
          </div>
        ))}
      </div>
      
      <button
        type="button"
        onClick={adicionarHistoricoProfissional}
        className="botao-adicionar-grande"
      >
        ➕ Adicionar Histórico Profissional
      </button>
    </div>
  );
};

export default HistoricoProfissional;