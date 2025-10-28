import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const HistoricoProfissionalPerfil = ({ 
  historicoProfissional, 
  nomePerfil, 
  modoEdicao, 
  adicionarHistoricoProfissional, 
  removerHistoricoProfissional, 
  alterarHistoricoProfissional 
}) => {
  return (
    <div className="margemInferiorGrande">
      <div className="flexCentro espaçoEntre margemInferiorMedia">
        <h2 className="bordaInferiorSubtle margemSuperiorZero">Histórico Profissional</h2>
        {modoEdicao && (
          <button
            type="button"
            onClick={adicionarHistoricoProfissional}
            className="botao botaoSecundario"
          >
            <Plus size={16} />
            Adicionar
          </button>
        )}
      </div>
      
      <div className="gridContainer gridUmaColuna gapPequeno">
        {historicoProfissional.length > 0 ? (
          historicoProfissional.map((item, index) => (
            <div key={item._id || index} className={modoEdicao ? "cartaoAcademico posicaoRelativa" : "cartaoLateral"}>
              {modoEdicao ? (
                <>
                  <div className="campoFormulario">
                    <label className="rotuloCampo">Empresa/Instituição *</label>
                    <input
                      type="text"
                      value={item.nome}
                      onChange={(e) => alterarHistoricoProfissional(index, 'nome', e.target.value)}
                      className="inputFormulario"
                      placeholder="Ex: Hospital Micheletto"
                    />
                  </div>
                  <div className="campoFormulario">
                    <label className="rotuloCampo">URL da Imagem</label>
                    <input
                      type="text"
                      value={item.imagem}
                      onChange={(e) => alterarHistoricoProfissional(index, 'imagem', e.target.value)}
                      className="inputFormulario"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                  <div className="campoFormulario">
                    <label className="rotuloCampo">Descrição</label>
                    <textarea
                      value={item.descricao}
                      onChange={(e) => alterarHistoricoProfissional(index, 'descricao', e.target.value)}
                      className="inputFormulario areaTexto"
                      rows="2"
                      placeholder="Descrição da experiência profissional"
                    />
                  </div>
                  {item.imagem && (
                    <div className="campoFormulario">
                      <label className="rotuloCampo">Preview da Imagem</label>
                      <img
                        src={item.imagem}
                        alt={`Preview ${item.nome}`}
                        className="imagemPerfil"
                        style={{ maxWidth: '200px', maxHeight: '150px' }}
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removerHistoricoProfissional(index)}
                    className="botao botaoSecundario posicaoAbsoluta topoDireito"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              ) : (
                <>
                  <div className="containerImagemLateral">
                    <img
                      className="imagemLateral"
                      src={item.imagem}
                      alt={`${item.nome} - Local de trabalho de ${nomePerfil}`}
                    />
                  </div>
                  <div className="conteudoLateral">
                    <h3>{item.nome}</h3>
                    {item.descricao && <p>{item.descricao}</p>}
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="cartaoAcademico">
            {modoEdicao ? (
              <p className="textoCentro textoMarromOfuscado">
                Nenhum histórico profissional cadastrado. Clique em "Adicionar" para incluir.
              </p>
            ) : (
              <p className="textoCentro textoMarromOfuscado">
                Nenhum histórico profissional cadastrado.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricoProfissionalPerfil;