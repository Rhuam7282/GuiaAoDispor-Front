import React from "react";
import Logo from "../../../recursos/icones/logo.png"; // Ajuste o caminho conforme necessário

const ListaProfissionais = ({ profissionais, aoClicarPerfil }) => {
  const handleImageError = (e) => {
    
    // Substitui pela logo importada
    if (!e.target.src.includes('logo.png')) {
      e.target.src = Logo;
      e.target.style.filter = 'grayscale(100%) contrast(0.8) brightness(0.9)';
      e.target.style.opacity = '0.8';
    }
  };

  const handleImageLoad = (e) => {
    // Remove filtro cinza apenas se não for a logo
    if (!e.target.src.includes('logo.png')) {
      e.target.style.filter = 'none';
      e.target.style.opacity = '1';
    }
  };

  // Processa profissionais - usa logo apenas quando não há imagem
  const profissionaisProcessados = profissionais?.map(profissional => {
    const temImagemValida = profissional.imagem && 
      profissional.imagem.trim() !== '' && 
      profissional.imagem !== 'undefined' &&
      profissional.imagem !== 'null';
    
    return {
      ...profissional,
      imagem: temImagemValida ? profissional.imagem : Logo
    };
  }) || [];

  return (
    <div className="qualificados-profile-list">
      {profissionaisProcessados.length === 0 ? (
        <div className="qualificados-empty-state">
          <p>Nenhum profissional encontrado.</p>
        </div>
      ) : (
        profissionaisProcessados.map((profissional) => (
          <div
            key={profissional._id}
            className="qualificados-cartaoDestaque"
            onClick={() => aoClicarPerfil(profissional)}
          >
            <div className="qualificados-profile-content">
              <img
                src={profissional.imagem}
                alt={`Perfil de ${profissional.nome}`}
                className="qualificados-imagemPerfil"
                onError={handleImageError}
                onLoad={handleImageLoad}
                loading="lazy"
              />
              <div className="qualificados-profile-text-content">
                <span className="qualificados-profile-name">{profissional.nome}</span>
                <span className="qualificados-profile-location">
                  📍 {profissional.localizacao}
                </span>
                <span className="qualificados-profile-experience">
                  💼 {profissional.experiencia}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ListaProfissionais;