import React, { useState, useEffect } from 'react';
import { Star, Check, X, Clock } from 'lucide-react';
import { servicoAvaliacao } from '../../../servicos/api.js';

const AvaliacoesPendentes = ({ usuarioId }) => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [avaliacaoEditando, setAvaliacaoEditando] = useState(null);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');

  const carregarAvaliacoesPendentes = async () => {
    try {
      const resposta = await servicoAvaliacao.buscarPendentes(usuarioId);
      setAvaliacoes(resposta.data || []);
    } catch (erro) {
      setErro('Erro ao carregar avaliações pendentes');
      console.error('Erro ao carregar avaliações pendentes:', erro);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (usuarioId) {
      carregarAvaliacoesPendentes();
    }
  }, [usuarioId]);

  const handleConfirmar = async (avaliacaoId) => {
    if (nota === 0) {
      alert('Por favor, selecione uma nota de 1 a 5 estrelas');
      return;
    }

    try {
      await servicoAvaliacao.confirmar(avaliacaoId, {
        nota,
        desc: comentario
      });
      setAvaliacaoEditando(null);
      setNota(0);
      setComentario('');
      await carregarAvaliacoesPendentes();
    } catch (erro) {
      alert('Erro ao confirmar avaliação: ' + erro.message);
    }
  };

  const handleRecusar = async (avaliacaoId) => {
    if (confirm('Tem certeza que deseja recusar esta avaliação?')) {
      try {
        await servicoAvaliacao.recusar(avaliacaoId);
        await carregarAvaliacoesPendentes();
      } catch (erro) {
        alert('Erro ao recusar avaliação: ' + erro.message);
      }
    }
  };

  const renderEstrelas = (notaSelecionada, interativo = false) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={20}
        className={
          index < Math.floor(notaSelecionada)
            ? "textoAmarelo preenchido"
            : "textoMarromOfuscado"
        }
        fill={index < notaSelecionada ? "currentColor" : "none"}
        onClick={interativo ? () => setNota(index + 1) : undefined}
        style={interativo ? { cursor: 'pointer' } : {}}
      />
    ));
  };

  if (carregando) {
    return (
      <div className="margemInferiorGrande">
        <h3 className="bordaInferiorSubtle">Avaliações Pendentes</h3>
        <p className="textoCentro textoMarromOfuscado">Carregando...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="margemInferiorGrande">
        <h3 className="bordaInferiorSubtle">Avaliações Pendentes</h3>
        <div className="mensagemErro">{erro}</div>
      </div>
    );
  }

  if (avaliacoes.length === 0) {
    return null;
  }

  return (
    <div className="margemInferiorGrande">
      <div className="flexCentro gapPequeno margemInferiorMedia">
        <Clock size={24} />
        <h3 className="bordaInferiorSubtle margemSuperiorZero">Avaliações Pendentes</h3>
      </div>

      <div className="listaVertical">
        {avaliacoes.map((avaliacao) => (
          <div key={avaliacao._id} className="cartaoDestaque fundoMarromDestaqueTransparente textoEsquerda">
            <div className="flexCentro espaçoEntre margemInferiorPequena">
              <div>
                <strong>Solicitação de {avaliacao.profissional.nome}</strong>
                <p className="textoMarromOfuscado textoPequeno">
                  {new Date(avaliacao.dataSolicitacao).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="margemInferiorPequena">
              <strong>Descrição do trabalho:</strong>
              <p>{avaliacao.trabalhoRealizado}</p>
            </div>

            {avaliacaoEditando === avaliacao._id ? (
              <div>
                <div className="margemInferiorPequena">
                  <strong>Avalie o serviço (1-5 estrelas):</strong>
                  <div className="flexCentro gapPequeno margemSuperiorPequena">
                    {renderEstrelas(nota, true)}
                    <span className="textoMarromEscuro">{nota}/5</span>
                  </div>
                </div>

                <div className="campoFormulario">
                  <label className="rotuloCampo">Comentário (opcional)</label>
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    className="inputFormulario areaTexto"
                    rows="3"
                    placeholder="Compartilhe sua experiência com este profissional..."
                  />
                </div>

                <div className="botoesAcao">
                  <button
                    onClick={() => handleConfirmar(avaliacao._id)}
                    className="botao botaoPrimario"
                  >
                    <Check size={16} />
                    Confirmar Avaliação
                  </button>
                  <button
                    onClick={() => {
                      setAvaliacaoEditando(null);
                      setNota(0);
                      setComentario('');
                    }}
                    className="botao botaoSecundario"
                  >
                    <X size={16} />
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="botoesAcao">
                <button
                  onClick={() => setAvaliacaoEditando(avaliacao._id)}
                  className="botao botaoPrimario"
                >
                  <Check size={16} />
                  Avaliar Serviço
                </button>
                <button
                  onClick={() => handleRecusar(avaliacao._id)}
                  className="botao botaoPerigo"
                >
                  <X size={16} />
                  Recusar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvaliacoesPendentes;