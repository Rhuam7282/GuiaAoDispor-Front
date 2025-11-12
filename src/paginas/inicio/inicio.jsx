import React from "react";
import HeroPrincipal from "./componentes/heroprincipal";
import BotoesAcao from "./componentes/botoesacao";
import SecaoSobre from "./componentes/secaosobre";
import CarrosselAcessibilidade from "./componentes/carrosselacessibilidade";
import SecaoComentarios from "./componentes/secaocomentarios";
import Corpo from "../../componentes/layout/corpo";
import Rodape from "./componentes/rodape";
import Logo from "../../recursos/icones/logo.png";
import "./inicio.css";

const Inicio = () => {
  return (
    <Corpo>
      <div 
        className="paginaInicial" 
        style={{
          backgroundImage: `url(${Logo})`,
          backgroundSize: '40%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.85)',
          zIndex: 1
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <main className="paginaInicial">
            <div className="conteudoInicial">
              <HeroPrincipal />
              <BotoesAcao />
            </div>
          </main>
        </div>
      </div>
      
      <div className="conteudoPrincipalInicio">
        <div className="container">
          <CarrosselAcessibilidade />
          <SecaoSobre />
          <SecaoComentarios />
        </div>
      </div>
      <Rodape />
    </Corpo>
  );
};

export default Inicio;