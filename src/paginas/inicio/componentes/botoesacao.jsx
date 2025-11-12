import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contextos/autenticacao';
import { Rocket, Lock } from 'lucide-react'; // ✅ Ícones Lucide
import './botoesacao.css';

const BotoesAcao = () => {
  const navigate = useNavigate();
  const { estaAutenticado } = useAuth?.() || {};

  if (!useAuth) {
    console.warn('Hook useAuth não disponível');
    return null;
  }

  const handleEntrarAnonimo = () => {
    console.log('🚀 Acessando diretamente (anonimo)');
    navigate('/qualificados');
  };

  const handleFazerLogin = () => {
    navigate('/cadastro');
  };

  return (
    <div className="secaoBotoesAcao">
      <div className="containerBotoesAcao">
        <div className="textoMotivacional">
          <h3>Pronto para começar?</h3>
          <p>Escolha como deseja acessar nossa plataforma e descubra as possibilidades</p>
        </div>
        
        <div className="grupoBotoes">
          <button 
            onClick={handleEntrarAnonimo} 
            className="botaoAcesso botaoSecundario"
          >
            <div className="conteudoBotao">
              <Rocket size={20} className="iconeBotao" /> {/* ✅ Ícone Lucide */}
              <div className="textoBotao">
                <span className="tituloBotao">Acessar Diretamente</span>
                <span className="descricaoBotao">Explore sem compromisso</span>
              </div>
            </div>
          </button>

          <button 
            onClick={handleFazerLogin} 
            className="botaoAcesso botaoPrimario"
          >
            <div className="conteudoBotao">
              <Lock size={20} className="iconeBotao" /> {/* ✅ Ícone Lucide */}
              <div className="textoBotao">
                <span className="tituloBotao">Fazer Login</span>
                <span className="descricaoBotao">Acesso completo</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BotoesAcao;