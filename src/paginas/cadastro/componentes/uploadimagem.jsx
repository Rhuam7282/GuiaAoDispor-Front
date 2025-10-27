import React, { useRef } from 'react';

const UploadImagem = ({ foto, aoSelecionarArquivo }) => {
  const inputRef = useRef(null);

  const handleRemoverFoto = () => {
    // Resetar o input file
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    // Chamar a função para remover a foto
    aoSelecionarArquivo({ target: { name: 'foto', value: null } });
  };

  return (
    <div className="secao-upload-imagem">
      <div className="container-upload-perfil">
        <input
          ref={inputRef}
          type="file"
          id="foto"
          name="foto"
          accept="image/jpeg, image/jpg, image/png, image/webp"
          onChange={aoSelecionarArquivo}
          className="input-arquivo-perfil"
        />
        <label 
          htmlFor="foto" 
          className={`area-upload-imagem ${foto ? 'com-imagem' : ''}`}
        >
          {foto ? (
            <div className="preview-imagem-perfil">
              <img src={foto} alt="Preview da foto de perfil" />
            </div>
          ) : (
            <div className="conteudo-sem-imagem">
              <span className="icone-upload-grande">📁</span>
              <span className="texto-upload">Adicionar Foto de Perfil</span>
            </div>
          )}
        </label>
      </div>
      {foto && (
        <button 
          type="button"
          onClick={handleRemoverFoto}
          className="botao-remover-foto"
        >
          🗑️ Remover Foto
        </button>
      )}
    </div>
  );
};

export default UploadImagem;