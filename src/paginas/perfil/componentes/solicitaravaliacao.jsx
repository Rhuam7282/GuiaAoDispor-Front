import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { servicoAvaliacao } from '../../../servicos/api.js';

const SolicitarAvaliacao = ({ profissionalId, profissionalNome }) => {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [dadosForm, setDadosForm] = useState({
    usuarioNome: '',
    trabalhoRealizado: '',
    desc: ''
  });

  const handleInputChange = (campo, valor) => {
    setDadosForm(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleSolicitar = async () => {
    if (!dadosForm.usuarioNome || !dadosForm.trabalhoRealizado) {
      setMensagem('Nome do usuário e descrição do trabalho são obrigatórios');
      return;
    }

    setCarregando(true);
    setMensagem('');

    try {
      await servicoAvaliacao.solicitar({
        profissionalId,
        usuarioNome: dadosForm.usuarioNome,
        trabalhoRealizado: dadosForm.trabalhoRealizado,
        desc: dadosForm.desc
      });

      setMensagem('Solicitação enviada com sucesso! O usuário receberá uma notificação.');
      setDadosForm({
        usuarioNome: '',
        trabalhoRealizado: '',
        desc: ''
      });
      setMostrarForm(false);
    } catch (erro) {
      setMensagem(erro.message || 'Erro ao enviar solicitação');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="margemInferiorGrande">
      <div className="flexCentro espaçoEntre">
        <h3>Solicitar Confirmação de Trabalho</h3>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="botao botaoSecundario"
        >
          {mostrarForm ? <X size={16} /> : <Plus size={16} />}
          {mostrarForm ? 'Cancelar' : 'Solicitar Confirmação'}
        </button>
      </div>

      {mostrarForm && (
        <div className="cartaoDestaque fundoMarromDestaqueTransparente textoEsquerda margemSuperiorPequena">
          <div className="campoFormulario">
            <label className="rotuloCampo">Nome do Usuário *</label>
            <input
              type="text"
              value={dadosForm.usuarioNome}
              onChange={(e) => handleInputChange('usuarioNome', e.target.value)}
              className="inputFormulario"
              placeholder="Digite o nome completo do usuário"
              disabled={carregando}
            />
          </div>

          <div className="campoFormulario">
            <label className="rotuloCampo">Descrição do Trabalho Realizado *</label>
            <textarea
              value={dadosForm.trabalhoRealizado}
              onChange={(e) => handleInputChange('trabalhoRealizado', e.target.value)}
              className="inputFormulario areaTexto"
              rows="3"
              placeholder="Descreva o trabalho ou serviço prestado"
              disabled={carregando}
            />
          </div>

          <div className="campoFormulario">
            <label className="rotuloCampo">Observações Adicionais (opcional)</label>
            <textarea
              value={dadosForm.desc}
              onChange={(e) => handleInputChange('desc', e.target.value)}
              className="inputFormulario areaTexto"
              rows="2"
              placeholder="Alguma informação adicional sobre o trabalho"
              disabled={carregando}
            />
          </div>

          <button
            onClick={handleSolicitar}
            disabled={carregando}
            className="botao botaoPrimario"
          >
            {carregando ? 'Enviando...' : 'Enviar Solicitação'}
          </button>

          {mensagem && (
            <div className={`mensagem ${mensagem.includes('Erro') ? 'mensagemErro' : 'mensagemSucesso'} margemSuperiorPequena`}>
              {mensagem}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SolicitarAvaliacao;