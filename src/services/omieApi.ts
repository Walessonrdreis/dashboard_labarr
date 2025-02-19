import axios from 'axios';
import { OmieProduto, OmieProdutoListaResponse, OmieProdutoFiltros, OmieError, OmieProdutoResumido } from '../types/omie';

const omieApi = axios.create({
  baseURL: '/api/omie',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar credenciais da API
omieApi.interceptors.request.use((config) => {
  const appKey = import.meta.env.VITE_OMIE_APP_KEY;
  const appSecret = import.meta.env.VITE_OMIE_APP_SECRET;

  if (!appKey || !appSecret) {
    throw new Error('Credenciais da API do OMIE não configuradas');
  }

  // Log da requisição para debug
  console.log('Request Config:', {
    url: config.url,
    method: config.method,
    data: config.data,
  });

  return config;
});

// Interceptor para tratamento de erros
omieApi.interceptors.response.use(
  (response) => {
    // Log da resposta para debug
    console.log('Response:', response.data);
    return response;
  },
  (error) => {
    // Log detalhado do erro
    console.error('Erro na requisição:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config,
    });

    if (error.response) {
      const omieError: OmieError = {
        code: error.response.status.toString(),
        description: error.response.data?.faultstring || 'Erro desconhecido ao acessar a API do OMIE',
        referer: error.config?.url,
      };
      return Promise.reject(omieError);
    }
    
    return Promise.reject({
      code: 'NETWORK_ERROR',
      description: 'Erro de conexão com a API do OMIE',
    });
  }
);

export const OmieApiService = {
  // Listar produtos resumidos (apenas nome e valor)
  listarProdutos: async (filtros: OmieProdutoFiltros = {}): Promise<OmieProdutoListaResponse> => {
    try {
      const response = await omieApi.post('/geral/produtos/', {
        call: 'ListarProdutos',
        app_key: import.meta.env.VITE_OMIE_APP_KEY,
        app_secret: import.meta.env.VITE_OMIE_APP_SECRET,
        param: [{
          pagina: filtros.pagina || 1,
          registros_por_pagina: filtros.registros_por_pagina || 50,
          apenas_importado_api: filtros.apenas_importado_api || "N",
          filtrar_apenas_omiepdv: "N"
        }]
      });

      console.log('Resposta da API ListarProdutos:', response.data);
      
      // Verificar se a estrutura da resposta está correta
      const produtos = response.data.produto_servico_resumido;
      if (produtos && Array.isArray(produtos)) {
        produtos.forEach((produto: OmieProdutoResumido) => {
          console.log('Produto:', produto.codigo_produto);
          console.log('Imagens:', produto.imagens);
        });
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      throw error;
    }
  },

  // Consultar produto detalhado
  consultarProduto: async (codigoProduto: number): Promise<OmieProduto> => {
    try {
      if (!codigoProduto || isNaN(codigoProduto)) {
        throw new Error('Código do produto inválido');
      }

      console.log('Consultando produto - Código:', codigoProduto, 'Tipo:', typeof codigoProduto);

      // Vamos direto para a consulta do produto
      const response = await omieApi.post('/geral/produtos/', {
        call: 'ConsultarProduto',
        app_key: import.meta.env.VITE_OMIE_APP_KEY,
        app_secret: import.meta.env.VITE_OMIE_APP_SECRET,
        param: [{
          codigo_produto: codigoProduto
        }]
      });

      console.log('Resposta da API:', {
        status: response.status,
        data: response.data
      });

      if (!response.data) {
        throw new Error('Produto não encontrado ou resposta inválida da API');
      }

      return response.data;
    } catch (error: unknown) {
      console.error('Erro ao consultar produto:', {
        error,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      throw error;
    }
  },

  // Incluir produto
  incluirProduto: async (produto: Omit<OmieProduto, 'codigo_produto'>): Promise<{ codigo_produto: number }> => {
    const response = await omieApi.post('/geral/produtos/', {
      call: 'IncluirProduto',
      app_key: import.meta.env.VITE_OMIE_APP_KEY,
      app_secret: import.meta.env.VITE_OMIE_APP_SECRET,
      param: [{
        produto_servico_cadastro: produto,
      }]
    });
    return response.data;
  },

  // Alterar produto
  alterarProduto: async (produto: OmieProduto): Promise<{ codigo_produto: number }> => {
    const response = await omieApi.post('/geral/produtos/', {
      call: 'AlterarProduto',
      app_key: import.meta.env.VITE_OMIE_APP_KEY,
      app_secret: import.meta.env.VITE_OMIE_APP_SECRET,
      param: [{
        produto_servico_cadastro: produto,
      }]
    });
    return response.data;
  },

  // Excluir produto
  excluirProduto: async (codigoProduto: number): Promise<void> => {
    await omieApi.post('/geral/produtos/', {
      call: 'ExcluirProduto',
      app_key: import.meta.env.VITE_OMIE_APP_KEY,
      app_secret: import.meta.env.VITE_OMIE_APP_SECRET,
      param: [{
        codigo_produto: codigoProduto,
      }]
    });
  },
};

export default OmieApiService; 