import React, { useState, useEffect } from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { servicoAvaliacao } from '../../../servicos/api.js';

const ListaAvaliacoes = ({ profissionalId }) => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarAvaliacoes = async () => {
    try {
      const resposta = await servicoAvaliacao.buscarPorProfissional(profissionalId);
      setAvaliacoes(resposta.data || []);
    } catch (erro) {
      setErro('Erro ao carregar avaliações');
      console.error('Erro ao carregar avaliações:', erro);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarAvaliacoes();
  }, [profissionalId]);

  const renderEstrelas = (nota) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={
          index < Math.floor(nota)
            ? "textoAmarelo preenchido"
            : "textoMarromOfuscado"
        }
        fill={index < nota ? "currentColor" : "none"}
      />
    ));
  };

  if (carregando) {
    return (
      <div className="margemInferiorGrande">
        <h3 className="bordaInferiorSubtle">Avaliações</h3>
        <p className="textoCentro textoMarromOfuscado">Carregando avaliações...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="margemInferiorGrande">
        <h3 className="bordaInferiorSubtle">Avaliações</h3>
        <div className="mensagemErro">{erro}</div>
      </div>
    );
  }

  return (
    <div className="margemInferiorGrande">
      <div className="flexCentro gapPequeno margemInferiorMedia">
        <MessageCircle size={24} />
        <h3 className="bordaInferiorSubtle margemSuperiorZero">Avaliações e Comentários</h3>
      </div>

      {avaliacoes.length === 0 ? (
        <div className="cartaoDestaque fundoMarromDestaqueTransparente textoCentro">
          <p className="textoMarromOfuscado">
            Nenhuma avaliação confirmada ainda.
          </p>
        </div>
      ) : (
        <div className="listaVertical">
          {avaliacoes.map((avaliacao) => (
            <div key={avaliacao._id} className="cartaoDestaque fundoMarromDestaqueTransparente textoEsquerda">
              <div className="flexCentro espaçoEntre margemInferiorPequena">
                <div className="flexCentro gapPequeno">
                  {avaliacao.usuario.foto && (
                    <img
                      src={avaliacao.usuario.foto}
                      alt={`Foto de ${avaliacao.usuario.nome}`}
                      className="imagemPerfil"
                      style={{ width: '40px', height: '40px' }}
                    />
                  )}
                  <div>
                    <strong>{avaliacao.usuario.nome}</strong>
                    <div className="flexCentro gapPequeno">
                      {renderEstrelas(avaliacao.nota)}
                      <span className="textoMarromEscuro textoPequeno">
                        {avaliacao.nota.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="textoMarromOfuscado textoPequeno">
                  {new Date(avaliacao.dataConfirmacao).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div className="margemInferiorPequena">
                <strong>Trabalho realizado:</strong>
                <p>{avaliacao.trabalhoRealizado}</p>
              </div>

              {avaliacao.desc && (
                <div>
                  <strong>Comentário:</strong>
                  <p>{avaliacao.desc}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaAvaliacoes;