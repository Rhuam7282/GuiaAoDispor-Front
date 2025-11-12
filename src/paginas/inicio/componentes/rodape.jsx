import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  User,
  Instagram,
  Mail,
  GalleryHorizontal,
  Phone,
  MapPin,
  Mail as MailIcon,
} from "lucide-react";
import "./rodape.css";

const Rodape = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const linksRapidos = [
    { Icone: GalleryHorizontal, texto: "Qualificados", rota: "/qualificados" },
    { Icone: User, texto: "Perfil", rota: "/perfil" },
    { Icone: Mail, texto: "Sobre Nós", rota: "/sobreNos" },
  ];

  const handleNavigation = (rota) => {
    navigate(rota);
  };

  // TODO: Implementar handlers para os botões legais
  // Estas funções devem ser implementadas quando as páginas correspondentes forem criadas
  const handlePoliticaPrivacidade = () => {
    console.log("Redirecionar para política de privacidade");
    // navigate('/politica-privacidade');
  };

  const handleTermosUso = () => {
    console.log("Redirecionar para termos de uso");
    // navigate('/termos-uso');
  };

  const handleNossoArtigo = () => {
    console.log("Redirecionar para nosso artigo");
    // navigate('/nosso-artigo');
  };

  return (
    <footer className="footer">
      <div className="containerFooter">
        <div className="footerSuperior">
          <div className="footerSection">
            <h4 className="tituloFooter">Links Rápidos</h4>
            <ul className="listaFooter">
              {linksRapidos.map((item) => (
                <li key={item.texto} className="itemListaFooter">
                  <button
                    className={`botaoFooter ${
                      location.pathname === item.rota ? "ativo" : ""
                    }`}
                    onClick={() => handleNavigation(item.rota)}
                  >
                    <item.Icone size={16} />
                    <span>{item.texto}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="footerSection">
            <h4 className="tituloFooter">Contato</h4>
            <div className="infoContato">
              <div className="itemContato">
                <Instagram size={16} />
                <span>@guiaodispor</span>
              </div>
              <div className="itemContato">
                <MailIcon size={16} />
                <span>guiaaodsipor@gmail.com</span>
              </div>
              <div className="itemContato">
                <MapPin size={16} />
                <span>Assis Chateaubriand, PR - Brasil</span>
              </div>
            </div>
          </div>
        </div>

        <div className="linhaDivisoria"></div>

        <div className="footerInferior">
          <div className="copyright">
            <p>
              &copy; {new Date().getFullYear()} Guia ao Dispor. Todos os
              direitos reservados.
            </p>
          </div>
          <div className="linksLegais">
            {/* TODO: Implementar páginas de política de privacidade e termos de uso */}
            <button className="botaoLegal" onClick={handlePoliticaPrivacidade}>
              Política de Privacidade
            </button>
            <button className="botaoLegal" onClick={handleTermosUso}>
              Termos de Uso
            </button>
            <button className="botaoLegal" onClick={handleNossoArtigo}>
              Nosso Artigo
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Rodape;