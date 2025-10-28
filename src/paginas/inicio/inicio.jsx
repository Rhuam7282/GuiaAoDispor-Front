import React from "react";
import HeroPrincipal from "./componentes/heroPrincipal";
import BotoesAcao from "./componentes/botoesAcao";
import SecaoSobre from "./componentes/secaoSobre";
import CarrosselAcessibilidade from "./componentes/carrosselAcessibilidade";
import SecaoComentarios from "./componentes/secaoComentarios";
import Corpo from "../../componentes/layout/corpo";
import Rodape from "./componentes/rodape";
import "./inicio.css";

const Inicio = () => {
  return (
    <Corpo>
      <main className="paginaInicial"> {/* ✅ SEMÂNTICA */}
        <div className="conteudoInicial">
          <HeroPrincipal />
          <BotoesAcao />
        </div>
      </main>
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