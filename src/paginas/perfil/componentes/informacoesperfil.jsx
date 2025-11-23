import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Star, Facebook, Instagram, Linkedin, Edit, Camera } from "lucide-react";
import { useAuth } from '../../../contextos/autenticacao.jsx';
import { servicoAuth } from '../../../servicos/api.js';

const InformacoesPerfil = forwardRef(({ 
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
  salvarHistoricos,
  historicosRemovidos
}, ref) => {
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

  // NOVO ESTADO: Contatos removidos
  const [contatosRemovidos, setContatosRemovidos] = useState([]);

  if (modoEdicao && !isPerfilProprio) {
    // Se tentarem forçar modoEdicao sem ser o próprio perfil, desativa
    modoEdicao = false;
  }
  
  // Expor função de salvar via ref
  useImperativeHandle(ref, () => ({
    salvarEdicoes: handleSalvarEdicao
  }));

  // Preencher dados editáveis quando os dados do perfil mudarem
  useEffect(() => {
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

  // Funções para máscaras e formatação
  const formatarTelefone = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1)$2-$3');
    } else {
      return numeros.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1)$2-$3');
    }
  };

  // NOVA FUNÇÃO: Formatar username para URL
  const formatarUsernameParaURL = (tipo, username) => {
    if (!username) return '';
    
    // Se já for uma URL completa, extrair apenas o username
    if (username.includes('http') || username.includes('www.') || username.includes('/')) {
      // Extrair apenas o username da URL
      const urlParts = username.split('/').filter(part => part);
      return urlParts[urlParts.length - 1] || username;
    }
    
    // Retornar o username limpo
    return username.replace('@', '');
  };

  // NOVA FUNÇÃO: Gerar URL completa a partir do username
  const gerarURLCompleta = (tipo, username) => {
    const usernameLimpo = formatarUsernameParaURL(tipo, username);
    
    switch (tipo) {
      case 'Instagram':
        return `https://www.instagram.com/${usernameLimpo}`;
      case 'Facebook':
        return `https://www.facebook.com/${usernameLimpo}`;
      case 'LinkedIn':
        return `https://www.linkedin.com/in/${usernameLimpo}`;
      default:
        return usernameLimpo;
    }
  };

  const handleInputChange = (campo, valor) => {
    setDadosEditaveis(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleSelecionarFoto = (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    if (!arquivo.type.startsWith('image/')) {
      setMensagem('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      setMensagem('A imagem deve ter no máximo 5MB.');
      return;
    }

    setCarregandoFoto(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewFoto(e.target.result);
      setDadosEditaveis(prev => ({
        ...prev,
        foto: e.target.result
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
    const contato = dadosEditaveis.contatos[index];
    // Adicionar à lista de removidos se tiver ID (não é novo)
    if (contato._id) {
      setContatosRemovidos(prev => [...prev, contato._id]);
    }
    setDadosEditaveis(prev => ({
      ...prev,
      contatos: prev.contatos.filter((_, i) => i !== index)
    }));
  };

  const alterarContato = (index, campo, valor) => {
    setDadosEditaveis(prev => {
      const novosContatos = prev.contatos.map((contato, i) => {
        if (i === index) {
          let valorFormatado = valor;
          
          // Aplicar máscaras e formatações
          if (campo === 'valor') {
            if (contato.tipo === 'Telefone') {
              valorFormatado = formatarTelefone(valor);
            }
            // NÃO formatar redes sociais - usuário digita apenas username
          }
          
          return { ...contato, [campo]: valorFormatado };
        }
        return contato;
      });
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
        const telefoneRegex = /^\(\d{2}\)\d{4,5}-\d{4}$/;
        if (!telefoneRegex.test(valor)) return "Formato: (XX)XXXX-XXXX";
        break;
      }
      default:
        break;
    }

    return "";
  };

  // ATUALIZADA: Gerar link para redes sociais
  const getSocialLink = (tipo, username) => {
    return gerarURLCompleta(tipo, username);
  };

  const handleSalvarEdicao = async () => {
    setCarregando(true);
    setMensagem('');
    
    try {
      // Validar campos obrigatórios
      if (!dadosEditaveis.nome.trim()) {
        setMensagem('O nome é obrigatório.');
        return false;
      }

      if (!dadosEditaveis.email.trim()) {
        setMensagem('O email é obrigatório.');
        return false;
      }

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
        return false;
      }

      // Formatar contatos - garantir que redes sociais tenham apenas username
      const contatosFormatados = dadosEditaveis.contatos
        .filter(contato => contato.tipo && contato.valor)
        .map(contato => {
          let valorFormatado = contato.valor;
          
          // Para redes sociais, garantir que seja apenas o username
          if (['Instagram', 'Facebook', 'LinkedIn'].includes(contato.tipo)) {
            valorFormatado = formatarUsernameParaURL(contato.tipo, contato.valor);
          }
          
          return {
            ...contato,
            valor: valorFormatado
          };
        });

      const dadosAtualizacao = {
        nome: dadosEditaveis.nome,
        desc: dadosEditaveis.descricao,
        email: dadosEditaveis.email,
        foto: dadosEditaveis.foto,
        contatos: contatosFormatados,
        // Adicionar contatos removidos para deleção no backend
        contatosRemovidos: contatosRemovidos
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
        
        // Limpar lista de contatos removidos
        setContatosRemovidos([]);
        
        setMensagem('Perfil atualizado com sucesso!');
        
        return true;
      } else {
        throw new Error(resposta.message || 'Erro ao atualizar perfil');
      }
    } catch (erro) {
      console.error('❌ Erro ao editar perfil:', erro);
      setMensagem(erro.message || 'Erro ao atualizar perfil. Tente novamente.');
      return false;
    } finally {
      setCarregando(false);
    }
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
        
        <div className={`cartaoDestaque fundoMarromDestaqueTransparente textoEsquerda margemInferiorPequena ${modoEdicao ? 'modoEdicao' : ''}`}>
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
        </div>
        
        {/* CONTATOS NO MODO EDIÇÃO */}
        <div className="cartaoDestaque fundoMarromDestaqueTransparente textoEsquerda">
          <h3>Contatos</h3>
          <p className="texto-obrigatorio">
            Para redes sociais, digite apenas o username (ex: "rhuam7282" para Instagram)
          </p>

          <div className="contatos-empilhados">
            {dadosEditaveis.contatos.map((contato, index) => (
              <div key={index} className="item-contato">
                <div className="linha-contato">
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
                    placeholder={
                      contato.tipo === 'Telefone' ? '(XX)XXXX-XXXX' :
                      contato.tipo === 'Email' ? 'seu@email.com' :
                      contato.tipo === 'Instagram' ? 'nomeusuario' :
                      contato.tipo === 'Facebook' ? 'nomeusuario' :
                      contato.tipo === 'LinkedIn' ? 'nomeusuario' :
                      'Valor do contato'
                    }
                    className={validarContato(contato.tipo, contato.valor) ? "erro" : ""}
                    disabled={carregando}
                  />
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
                {validarContato(contato.tipo, contato.valor) && (
                  <span className="mensagem-erro pequena">
                    {validarContato(contato.tipo, contato.valor)}
                  </span>
                )}
                {['Instagram', 'Facebook', 'LinkedIn'].includes(contato.tipo) && contato.valor && (
                  <span className="textoMarromOfuscado textoPequeno">
                    Link: {gerarURLCompleta(contato.tipo, contato.valor)}
                  </span>
                )}
              </div>
            ))}
          </div>

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
      
      {/* CONTATOS NO MODO VISUALIZAÇÃO */}
      <div>
        <h3>Contatos</h3>
        <div className="lista-vertical">
          {(!dadosPerfil.contatos || dadosPerfil.contatos.length === 0) ? (
            <p className="textoMarromOfuscado">Nenhum contato informado</p>
          ) : (
            dadosPerfil.contatos.map((contato, index) => (
              <div key={index} className="item-contato-visual">
                {contato.tipo === 'Email' && <span>📧</span>}
                {contato.tipo === 'Telefone' && <span>📞</span>}
                {contato.tipo === 'Facebook' && <Facebook size={18} />}
                {contato.tipo === 'Instagram' && <Instagram size={18} />}
                {contato.tipo === 'LinkedIn' && <Linkedin size={18} />}
                {contato.tipo === 'Outro' && <span>🔗</span>}
                <span>
                  {['Instagram', 'Facebook', 'LinkedIn'].includes(contato.tipo) ? (
                    <a 
                      href={getSocialLink(contato.tipo, contato.valor)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="textoAzulEscuro"
                    >
                      {contato.valor}
                    </a>
                  ) : (
                    contato.valor
                  )}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
});

export default InformacoesPerfil;