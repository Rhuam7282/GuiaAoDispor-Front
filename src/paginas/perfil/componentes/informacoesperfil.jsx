import React, { useState, useEffect, useRef } from 'react';
import { Star, Facebook, Instagram, Linkedin, Save, X, Edit, Camera, Plus, Trash2 } from "lucide-react";
import { useAuth } from '../../../contextos/autenticacao.jsx';
import { servicoAuth } from '../../../servicos/api.js';

const InformacoesPerfil = ({ 
  dadosPerfil, 
  estaAutenticado, 
  usuario, 
  id, 
  modoEdicao, 
  setModoEdicao,
  historicoAcademico,
  historicoProfissional,
  adicionarHistoricoAcademico,
  removerHistoricoAcademico,
  alterarHistoricoAcademico,
  adicionarHistoricoProfissional,
  removerHistoricoProfissional,
  alterarHistoricoProfissional,
  salvarHistoricos
}) => {
  const { atualizarUsuario } = useAuth();
  const [dadosEditaveis, setDadosEditaveis] = useState({
    nome: '',
    descricao: '',
    email: '',
    foto: '',
    contatos: []
  });
  const [carregando, setCarregando] = useState(false);
  const [carregandoFoto, setCarregandoFoto] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [previewFoto, setPreviewFoto] = useState('');
  const inputFileRef = useRef(null);

  // Preencher dados editáveis quando os dados do perfil mudarem
  useEffect(() => {
    console.log("🔄 Atualizando dados editáveis com:", dadosPerfil);
    if (dadosPerfil) {
      setDadosEditaveis({
        nome: dadosPerfil.nome || '',
        descricao: dadosPerfil.descricao || '',
        email: dadosPerfil.email || '',
        foto: dadosPerfil.foto || '',
        contatos: dadosPerfil.contatos || []
      });
      
      setPreviewFoto(dadosPerfil.foto || '');
    }
  }, [dadosPerfil]);

  const handleInputChange = (campo, valor) => {
    setDadosEditaveis(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleSelecionarFoto = (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    // Verificar se é uma imagem
    if (!arquivo.type.startsWith('image/')) {
      setMensagem('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    // Verificar tamanho do arquivo (máximo 5MB)
    if (arquivo.size > 5 * 1024 * 1024) {
      setMensagem('A imagem deve ter no máximo 5MB.');
      return;
    }

    setCarregandoFoto(true);

    // Criar preview da imagem
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewFoto(e.target.result);
      setDadosEditaveis(prev => ({
        ...prev,
        foto: e.target.result // Usar base64 para a imagem
      }));
      setCarregandoFoto(false);
    };
    reader.readAsDataURL(arquivo);
  };

  // Funções para gerenciar contatos
  const adicionarContato = () => {
    setDadosEditaveis(prev => ({
      ...prev,
      contatos: [...prev.contatos, { tipo: '', valor: '' }]
    }));
  };

  const removerContato = (index) => {
    setDadosEditaveis(prev => ({
      ...prev,
      contatos: prev.contatos.filter((_, i) => i !== index)
    }));
  };

  const alterarContato = (index, campo, valor) => {
    setDadosEditaveis(prev => {
      const novosContatos = prev.contatos.map((contato, i) => 
        i === index ? { ...contato, [campo]: valor } : contato
      );
      return { ...prev, contatos: novosContatos };
    });
  };

  const validarContato = (tipo, valor) => {
    if (!valor.trim()) return "Campo obrigatório";

    switch (tipo) {
      case "Email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(valor)) return "Email inválido";
        break;
      }
      case "Telefone": {
        const telefoneRegex = /^(\d{2}\s?\d{4,5}\s?\d{4})|(\(\d{2}\)\s?\d{4,5}?\d{4})$/;
        if (!telefoneRegex.test(valor.replace(/\s/g, ""))) return "Telefone inválido";
        break;
      }
      case "LinkedIn": {
        const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/;
        if (!linkedinRegex.test(valor)) return "URL do LinkedIn inválida";
        break;
      }
      case "Facebook": {
        const facebookRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/.+/;
        if (!facebookRegex.test(valor)) return "URL do Facebook inválida";
        break;
      }
      default: {
        break;
      }
    }

    return "";
  };

  const handleSalvarEdicao = async () => {
    setCarregando(true);
    setMensagem('');
    
    try {
      // Validar contatos
      const errosContatos = {};
      dadosEditaveis.contatos.forEach((contato, index) => {
        if (contato.tipo && contato.valor) {
          const erro = validarContato(contato.tipo, contato.valor);
          if (erro) {
            errosContatos[index] = erro;
          }
        }
      });

      if (Object.keys(errosContatos).length > 0) {
        setMensagem('Corrija os erros nos contatos antes de salvar.');
        return;
      }

      const dadosAtualizacao = {
        nome: dadosEditaveis.nome,
        desc: dadosEditaveis.descricao,
        email: dadosEditaveis.email,
        foto: dadosEditaveis.foto,
        contatos: dadosEditaveis.contatos.filter(contato => contato.tipo && contato.valor)
      };

      console.log('📤 Enviando dados de atualização:', dadosAtualizacao);
      
      const resposta = await servicoAuth.editarPerfil(id, dadosAtualizacao);
      
      if (resposta.status === 'sucesso') {
        // Salvar históricos se for profissional
        if (dadosPerfil.tipoPerfil === 'Profissional') {
          await salvarHistoricos();
        }

        // Atualizar contexto de autenticação
        await atualizarUsuario(dadosAtualizacao);
        
        setMensagem('Perfil atualizado com sucesso!');
        setTimeout(() => setMensagem(''), 5000);
        setModoEdicao(false);
        
        // Recarregar a página para refletir as mudanças
        window.location.reload();
      } else {
        throw new Error(resposta.message || 'Erro ao atualizar perfil');
      }
    } catch (erro) {
      console.error('❌ Erro ao editar perfil:', erro);
      setMensagem(erro.message || 'Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleCancelarEdicao = () => {
    // Restaurar dados originais
    setDadosEditaveis({
      nome: dadosPerfil.nome || '',
      descricao: dadosPerfil.descricao || '',
      email: dadosPerfil.email || '',
      foto: dadosPerfil.foto || '',
      contatos: dadosPerfil.contatos || []
    });
    setPreviewFoto(dadosPerfil.foto || '');
    setModoEdicao(false);
    setMensagem('');
  };

  const triggerFileInput = () => {
    inputFileRef.current.click();
  };

  // Verificar se é o perfil próprio para permitir edição
  const isPerfilProprio = estaAutenticado && usuario && usuario._id === id;

  // Verificar se é perfil profissional
  const isProfissional = dadosPerfil.tipoPerfil === 'Profissional';

  if (modoEdicao) {
    return (
      <div className="containerPrincipal margemInferiorGrande">
        <div className="alinharCentro">
          <div className="containerFoto posicaoRelativa">
            <img
              className="imagemPerfilGrande"
              src={previewFoto || dadosPerfil.foto || '/placeholder-avatar.jpg'}
              alt={`Preview da foto de ${dadosEditaveis.nome}`}
            />
            <div className="sobreposicaoFoto opaco" onClick={triggerFileInput}>
              <Camera size={24} />
              <span>Alterar foto</span>
            </div>
            <input
              ref={inputFileRef}
              type="file"
              accept="image/*"
              onChange={handleSelecionarFoto}
              style={{ display: 'none' }}
              disabled={carregando || carregandoFoto}
            />
          </div>
          
          {carregandoFoto && (
            <p className="textoCentro textoMarromOfuscado margemSuperiorPequena">
              Processando imagem...
            </p>
          )}
          
          <div className="campoFormulario margemSuperiorPequena">
            <label htmlFor="urlFoto" className="rotuloCampo">Ou cole a URL de uma imagem</label>
            <input
              id="urlFoto"
              type="url"
              value={dadosEditaveis.foto}
              onChange={(e) => {
                setDadosEditaveis(prev => ({ ...prev, foto: e.target.value }));
                setPreviewFoto(e.target.value);
              }}
              className="inputFormulario"
              disabled={carregando}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>
        </div>
        
        <div className="cartaoDestaque fundoMarromDestaqueTransparente textoEsquerda">
          <div className="campoFormulario">
            <label htmlFor="nome" className="rotuloCampo">Nome *</label>
            <input
              id="nome"
              type="text"
              value={dadosEditaveis.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              className="inputFormulario"
              disabled={carregando}
              placeholder="Seu nome completo"
            />
          </div>
          
          <div className="campoFormulario">
            <label htmlFor="descricao" className="rotuloCampo">
              Descrição {isProfissional && '*'}
            </label>
            <textarea
              id="descricao"
              value={dadosEditaveis.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              className="inputFormulario areaTexto"
              rows="3"
              disabled={carregando}
              placeholder={
                isProfissional
                  ? "Descreva seus serviços, especialidades e experiência profissional..."
                  : "Conte um pouco sobre você"
              }
            />
          </div>

          <div className="campoFormulario">
            <label htmlFor="email" className="rotuloCampo">Email *</label>
            <input
              id="email"
              type="email"
              value={dadosEditaveis.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="inputFormulario"
              disabled={carregando}
              placeholder="seu@email.com"
            />
          </div>
          
          {mensagem && (
            <div className={`mensagem ${mensagem.includes('Erro') ? 'mensagemErro' : 'mensagemSucesso'} margemSuperiorPequena`}>
              {mensagem}
            </div>
          )}

          <div className="botoesAcao margemSuperiorMedia">
            <button
              onClick={handleSalvarEdicao}
              disabled={carregando || carregandoFoto}
              className="botao botaoPrimario"
            >
              {carregando ? 'Salvando...' : 'Salvar Alterações'}
              <Save size={16} />
            </button>
            <button
              onClick={handleCancelarEdicao}
              disabled={carregando}
              className="botao botaoSecundario"
            >
              Cancelar
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className="cartaoDestaque variacao2 secao-completa">
          <h3>Contatos</h3>
          <p className="texto-obrigatorio">
            Adicione outras formas de contato como LinkedIn, Facebook, etc.
          </p>

          {dadosEditaveis.contatos.map((contato, index) => (
            <div key={index} className="item-contato">
              <select
                value={contato.tipo}
                onChange={(e) => alterarContato(index, 'tipo', e.target.value)}
                className={validarContato(contato.tipo, contato.valor) ? "erro" : ""}
                disabled={carregando}
              >
                <option value="">Selecione o tipo</option>
                <option value="Telefone">📞 Telefone</option>
                <option value="Email">📧 Email</option>
                <option value="Facebook">📘 Facebook</option>
                <option value="Instagram">📷 Instagram</option>
                <option value="LinkedIn">💼 LinkedIn</option>
                <option value="Outro">🔗 Outro</option>
              </select>
              <input
                type="text"
                value={contato.valor}
                onChange={(e) => alterarContato(index, 'valor', e.target.value)}
                placeholder="Valor do contato"
                className={validarContato(contato.tipo, contato.valor) ? "erro" : ""}
                disabled={carregando}
              />
              {validarContato(contato.tipo, contato.valor) && (
                <span className="mensagem-erro pequena">
                  {validarContato(contato.tipo, contato.valor)}
                </span>
              )}
              <button
                type="button"
                onClick={() => removerContato(index)}
                className="botao-remover"
                disabled={carregando}
                title="Remover contato"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={adicionarContato}
            className="botao-adicionar"
            disabled={carregando}
          >
            ➕ Adicionar Contato
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="containerPrincipal margemInferiorGrande">
      <div className="flexCentro alinharCentro flexColuna">
        <div className="containerFoto posicaoRelativa">
          <img
            className="imagemPerfilGrande"
            src={dadosPerfil.foto || '/placeholder-avatar.jpg'}
            alt={`${dadosPerfil.nome} - ${dadosPerfil.descricao} em ${dadosPerfil.localizacao}`}
          />
          {isPerfilProprio && (
            <div className="sobreposicaoFoto" onClick={() => setModoEdicao(true)}>
              <Edit size={20} />
              <span>Editar perfil</span>
            </div>
          )}
        </div>
        
        <div className="margemSuperiorPequena">
          <p className="textoCentro textoMarromOfuscado">{dadosPerfil.localizacao}</p>
        </div>
      </div>
      
      <div className="cartaoDestaque fundoMarromDestaqueTransparente textoEsquerda">
        <p className="margemInferiorPequena">{dadosPerfil.descricao}</p>
        <div className="flexCentro gapPequeno">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < Math.floor(dadosPerfil.avaliacao || 0)
                  ? "textoAmarelo preenchido"
                  : "textoMarromOfuscado"
              }
            />
          ))}
          <span className="textoMarromEscuro">
            {(dadosPerfil.avaliacao || 0).toFixed(1)}
          </span>
        </div>
      </div>
      
      <div>
        <h3>Contatos</h3>
        <div className="listaIcones vertical gapPequeno">
          {dadosPerfil.contatos && dadosPerfil.contatos.map((contato, index) => (
            <div key={index} className="flexCentro gapPequeno">
              {contato.tipo === 'Email' && <span>📧</span>}
              {contato.tipo === 'Telefone' && <span>📞</span>}
              {contato.tipo === 'Facebook' && <Facebook size={18} />}
              {contato.tipo === 'Instagram' && <Instagram size={18} />}
              {contato.tipo === 'LinkedIn' && <Linkedin size={18} />}
              {contato.tipo === 'Outro' && <span>🔗</span>}
              <span>{contato.valor}</span>
            </div>
          ))}
          
          {(!dadosPerfil.contatos || dadosPerfil.contatos.length === 0) && (
            <p className="textoMarromOfuscado">Nenhum contato informado</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InformacoesPerfil;