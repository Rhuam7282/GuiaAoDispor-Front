import React from "react";

const HistoricoCurricular = ({
  historicosCurriculares,
  adicionarHistoricoCurricular,
  removerHistoricoCurricular,
  alterarHistoricoCurricular,
}) => {
  return (
    <div className="secao-historico-completa">
      <div className="cabecalho-secao-historico">
        <h3 className="titulo-secao-centralizado">Histórico Acadêmico</h3>
        <p className="texto-descricao-secao">
          Adicione suas formações e qualificações acadêmicas
        </p>
      </div>

      <div className="lista-historicos">
        {historicosCurriculares.map((hc, index) => (
          <div key={index} className="item-historico-lista">
            <div className="linha-campos-historico">
              <input
                type="text"
                value={hc.nome}
                onChange={(e) =>
                  alterarHistoricoCurricular(index, "nome", e.target.value)
                }
                placeholder="Título da formação *"
                className="campo-titulo-historico"
              />
              <button
                type="button"
                onClick={() => removerHistoricoCurricular(index)}
                className="botao-remover-historico"
                title="Remover histórico"
              >
                ✕
              </button>
            </div>
            <div className="campo-descricao-breve-container">
              <textarea
                value={hc.desc}
                onChange={(e) =>
                  alterarHistoricoCurricular(index, "desc", e.target.value)
                }
                placeholder="Descrição breve da formação (máx. 100 caracteres)"
                rows="2"
                className="textarea-descricao-breve"
                maxLength="100"
              />
              <span className="contador-caracteres">
                {hc.desc ? hc.desc.length : 0}/100
              </span>
            </div>
            <div className="linha-datas-historico">
              <div className="campo-data">
                <label>Data de Início</label>
                <input
                  type="month"
                  value={hc.dataInicio || ""}
                  onChange={(e) =>
                    alterarHistoricoCurricular(
                      index,
                      "dataInicio",
                      e.target.value
                    )
                  }
                  className="campo-data-input"
                />
              </div>
              <div className="campo-data">
                <label>Data de Conclusão</label>
                <input
                  type="month"
                  value={hc.dataConclusao || ""}
                  onChange={(e) =>
                    alterarHistoricoCurricular(
                      index,
                      "dataConclusao",
                      e.target.value
                    )
                  }
                  className="campo-data-input"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={adicionarHistoricoCurricular}
        className="botao-adicionar-grande"
      >
        ➕ Adicionar Histórico Acadêmico
      </button>
    </div>
  );
};

export default HistoricoCurricular;
