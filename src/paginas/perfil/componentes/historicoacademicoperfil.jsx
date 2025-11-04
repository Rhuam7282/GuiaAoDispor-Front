import React, { useRef } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';

const HistoricoAcademicoPerfil = ({ 
  historicoAcademico, 
  modoEdicao, 
  adicionarHistoricoAcademico, 
  removerHistoricoAcademico, 
  alterarHistoricoAcademico 
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
      alterarHistoricoAcademico(index, 'imagem', e.target.result);
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
        <h2 className="bordaInferiorSubtle margemSuperiorZero">Histórico Acadêmico</h2>
        {modoEdicao && (
          <button
            type="button"
            onClick={adicionarHistoricoAcademico}
            className="botao botaoSecundario"
          >
            <Plus size={16} />
            Adicionar
          </button>
        )}
      </div>
      
      <div className="carrossel-historico">
        {historicoAcademico.length > 0 ? (
          historicoAcademico.map((item, index) => (
            <div key={item._id || index} className="item-carrossel">
              <div className="cartao-carrossel posicaoRelativa">
                {modoEdicao ? (
                  <>
                    <div className="campoFormulario">
                      <label className="rotuloCampo">Título *</label>
                      <input
                        type="text"
                        value={item.nome}
                        onChange={(e) => alterarHistoricoAcademico(index, 'nome', e.target.value)}
                        className="inputFormulario"
                        placeholder="Ex: Graduação em Enfermagem"
                      />
                    </div>
                    <div className="campoFormulario">
                      <label className="rotuloCampo">Instituição</label>
                      <input
                        type="text"
                        value={item.instituicao}
                        onChange={(e) => alterarHistoricoAcademico(index, 'instituicao', e.target.value)}
                        className="inputFormulario"
                        placeholder="Ex: USP"
                      />
                    </div>
                    <div className="campoFormulario">
                      <label className="rotuloCampo">Período</label>
                      <input
                        type="text"
                        value={item.periodo}
                        onChange={(e) => alterarHistoricoAcademico(index, 'periodo', e.target.value)}
                        className="inputFormulario"
                        placeholder="Ex: 2010-2014"
                      />
                    </div>
                    <div className="campoFormulario">
                      <label className="rotuloCampo">Descrição</label>
                      <textarea
                        value={item.descricao}
                        onChange={(e) => alterarHistoricoAcademico(index, 'descricao', e.target.value)}
                        className="inputFormulario areaTexto"
                        rows="2"
                        placeholder="Descrição do curso ou formação"
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removerHistoricoAcademico(index)}
                      className="botao botaoSecundario posicaoAbsoluta topoDireito"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <h3>{item.nome}</h3>
                    {item.instituicao && <p><strong>Instituição:</strong> {item.instituicao}</p>}
                    {item.periodo && <p><strong>Período:</strong> {item.periodo}</p>}
                    {item.descricao && <p>{item.descricao}</p>}
                    {item.imagem && (
                      <div className="margemSuperiorPequena">
                        <img
                          src={item.imagem}
                          alt={`Certificado ${item.nome}`}
                          className="preview-imagem"
                        />
                      </div>
                    )}
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
                  Nenhum histórico acadêmico cadastrado. Clique em "Adicionar" para incluir.
                </p>
              ) : (
                <p className="textoCentro textoMarromOfuscado">
                  Nenhum histórico acadêmico cadastrado.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricoAcademicoPerfil;