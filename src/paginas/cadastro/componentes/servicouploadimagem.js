import { API_CONFIG } from '../../../../config/apiconfig.js';

class ServicoUploadImagem {
  constructor() {
    // Usa a BASE_URL centralizada do apiconfig
    this.apiUrl = API_CONFIG.BASE_URL;
    console.log('🖼️ Serviço de Upload inicializado com URL:', this.apiUrl);
  }

  async fazerUpload(arquivo, token) {
    try {
      console.log('📤 Iniciando upload da imagem...', {
        nome: arquivo.name,
        tipo: arquivo.type,
        tamanho: arquivo.size
      });
      
      if (!arquivo) {
        throw new Error('Nenhum arquivo selecionado');
      }

      // Validar tipo de arquivo
      const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!tiposPermitidos.includes(arquivo.type)) {
        throw new Error('Tipo de arquivo não suportado. Use JPG, PNG, WebP ou GIF.');
      }

      // Validar tamanho (5MB)
      const tamanhoMaximo = 5 * 1024 * 1024; // 5MB
      if (arquivo.size > tamanhoMaximo) {
        throw new Error('Arquivo muito grande. Tamanho máximo: 5MB.');
      }

      const formData = new FormData();
      formData.append('imagem', arquivo);
      formData.append('timestamp', Date.now().toString());
      formData.append('nomeOriginal', arquivo.name);

      const urlUpload = `${this.apiUrl}/api/upload/imagem`;
      console.log('🔗 URL do upload:', urlUpload);

      const resposta = await fetch(urlUpload, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Não definir Content-Type - o browser vai definir automaticamente com boundary para FormData
        },
        body: formData
      });

      // Verificar se a resposta é OK antes de tentar parsear JSON
      if (!resposta.ok) {
        let mensagemErro = `Erro ${resposta.status} no upload`;
        try {
          const erroData = await resposta.json();
          mensagemErro = erroData.message || mensagemErro;
        } catch (e) {
          // Se não conseguir parsear JSON, usar o status text
          mensagemErro = resposta.statusText || mensagemErro;
        }
        throw new Error(mensagemErro);
      }

      const dados = await resposta.json();

      if (dados.status === 'erro') {
        throw new Error(dados.message || 'Erro no upload da imagem');
      }

      console.log('✅ Upload realizado com sucesso:', dados.data?.url);
      return dados;

    } catch (error) {
      console.error('❌ Erro no upload:', error);
      
      // Tratamento específico para erros de rede
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Erro de conexão. Verifique se o servidor está rodando.');
      }
      
      throw error;
    }
  }

  // Método para converter imagem em base64 (útil para preview)
  async lerArquivoComoDataURL(arquivo) {
    return new Promise((resolve, reject) => {
      const leitor = new FileReader();
      leitor.onload = () => {
        console.log('📷 Imagem convertida para DataURL, tamanho:', leitor.result.length, 'bytes');
        resolve(leitor.result);
      };
      leitor.onerror = () => {
        console.error('❌ Erro ao ler arquivo como DataURL');
        reject(new Error('Não foi possível ler o arquivo de imagem'));
      };
      leitor.readAsDataURL(arquivo);
    });
  }

  // Método para validar imagem antes do upload
  validarImagem(arquivo) {
    const erros = [];

    if (!arquivo) {
      return {
        valido: false,
        erros: ['Nenhum arquivo selecionado']
      };
    }

    // Validar tipo
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!tiposPermitidos.includes(arquivo.type)) {
      erros.push('Tipo de arquivo não suportado. Use JPG, PNG, WebP ou GIF.');
    }

    // Validar tamanho
    const tamanhoMaximo = 5 * 1024 * 1024; // 5MB
    if (arquivo.size > tamanhoMaximo) {
      erros.push('Arquivo muito grande. Tamanho máximo: 5MB.');
    }

    // Validar nome do arquivo (opcional)
    if (arquivo.name.length > 100) {
      erros.push('Nome do arquivo muito longo. Máximo 100 caracteres.');
    }

    console.log('🔍 Validação da imagem:', {
      nome: arquivo.name,
      tipo: arquivo.type,
      tamanho: arquivo.size,
      valido: erros.length === 0,
      erros: erros
    });

    return {
      valido: erros.length === 0,
      erros
    };
  }

  // Método para obter extensão do arquivo
  obterExtensao(arquivo) {
    const nome = arquivo.name;
    return nome.slice((nome.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  // Método para gerar nome único para o arquivo
  gerarNomeUnico(arquivo) {
    const timestamp = Date.now();
    const extensao = this.obterExtensao(arquivo);
    const nomeBase = arquivo.name.replace(/\.[^/.]+$/, ""); // Remove extensão
    const nomeSanitizado = nomeBase.replace(/[^a-zA-Z0-9]/g, '_');
    return `${nomeSanitizado}_${timestamp}.${extensao}`;
  }
}

// Exportar tanto a classe quanto uma instância
export const servicoUploadImagem = new ServicoUploadImagem();
export default servicoUploadImagem;