import React, { useRef } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';

const HistoricoProfissionalPerfil = ({ 
  historicoProfissional, 
  nomePerfil, 
  modoEdicao, 
  adicionarHistoricoProfissional, 
  removerHistoricoProfissional, 
  alterarHistoricoProfissional 
}) => {
  const fileInputRefs = useRef([]);

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      alterarHistoricoProfissional(index, 'imagem', e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = (index) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].click();
    }
  };

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
      
      <div className="carrossel-historico">
        {historicoProfissional.length > 0 ? (
          historicoProfissional.map((item, index) => (
            <div key={item._id || index} className="item-carrossel">
              <div className={modoEdicao ? "cartao-carrossel posicaoRelativa layout-profissional-edicao" : "cartao-carrossel layout-profissional-visualizacao"} 
                   style={modoEdicao ? {height: 'auto', minHeight: '400px'} : {}}>
                {modoEdicao ? (
                  <>
                    {/* Linha 1: Imagem com ratio 3/4 */}
                    <div className="campoFormulario">
                      <div className="container-upload-imagem">
                        <img
                          className="imagem-upload imagem-profissional"
                          src={item.imagem || '/placeholder-company.jpg'}
                          alt="Preview da empresa"
                        />
                        <div className="sobreposicao-upload opaco" onClick={() => triggerFileInput(index)}>
                          <Upload size={24} />
                          <span>Alterar imagem</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          ref={el => fileInputRefs.current[index] = el}
                          onChange={(e) => handleImageUpload(index, e)}
                          style={{ display: 'none' }}
                        />
                      </div>
                    </div>
                    
                    {/* Linha 2: Título */}
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
                    
                    {/* Linha 3: Descrição */}
                    <div className="campoFormulario">
                      <label className="rotuloCampo">Descrição</label>
                      <textarea
                        value={item.descricao}
                        onChange={(e) => alterarHistoricoProfissional(index, 'descricao', e.target.value)}
                        className="inputFormulario areaTexto"
                        rows="3"
                        placeholder="Descrição da experiência profissional"
                      />
                    </div>
                    
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
                    {/* Layout de visualização - 3 linhas como no modo edição */}
                    <div className="container-upload-imagem">
                      <img
                        className="imagem-upload imagem-profissional"
                        src={item.imagem || '/placeholder-company.jpg'}
                        alt={`${item.nome} - Local de trabalho de ${nomePerfil}`}
                      />
                    </div>
                    <div className="conteudo-profissional">
                      <h3>{item.nome}</h3>
                      {item.descricao && <p>{item.descricao}</p>}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="item-carrossel">
            <div className="cartao-carrossel">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricoProfissionalPerfil;