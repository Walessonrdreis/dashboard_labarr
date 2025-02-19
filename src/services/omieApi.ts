import axios from 'axios';
import { OmieProduto, OmieProdutoListaResponse, OmieProdutoFiltros, OmieError } from '../types/omie';

const omieApi = axios.create({
  baseURL: import.meta.env.VITE_OMIE_API_URL || 'https://app.omie.com.br/api/v1',
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

  config.data = {
    ...config.data,
    app_key: appKey,
    app_secret: appSecret,
  };

  return config;
});

// Interceptor para tratamento de erros
omieApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const omieError: OmieError = error.response?.data?.error || {
      code: 'UNKNOWN_ERROR',
      description: 'Erro desconhecido ao acessar a API do OMIE',
    };

    return Promise.reject(omieError);
  }
);

export const OmieApiService = {
  // Listar produtos resumidos (apenas nome e valor)
  listarProdutos: async (filtros: OmieProdutoFiltros = {}): Promise<OmieProdutoListaResponse> => {
    try {
      const response = await omieApi.post('/geral/produtos/', {
        call: 'ListarProdutosResumido',
        app_key: import.meta.env.VITE_OMIE_APP_KEY,
        app_secret: import.meta.env.VITE_OMIE_APP_SECRET,
        param: [{
          pagina: filtros.pagina || 1,
          registros_por_pagina: filtros.registros_por_pagina || 50,
          apenas_importado_api: "N",
          filtrar_apenas_descricao: filtros.filtrar_apenas_descricao || "N",
          descricao: filtros.descricao || "",
        }]
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Consultar produto detalhado
  consultarProduto: async (codigoProduto: number): Promise<OmieProduto> => {
    const response = await omieApi.post('/geral/produtos/', {
      call: 'ConsultarProduto',
      param: [{
        codigo_produto: codigoProduto,
      }],
    });
    return response.data.produto_servico_cadastro;
  },

  // Incluir produto
  incluirProduto: async (produto: Omit<OmieProduto, 'codigo_produto'>): Promise<{ codigo_produto: number }> => {
    const response = await omieApi.post('/geral/produtos/', {
      call: 'IncluirProduto',
      param: [{
        produto_servico_cadastro: produto,
      }],
    });
    return response.data;
  },

  // Alterar produto
  alterarProduto: async (produto: OmieProduto): Promise<{ codigo_produto: number }> => {
    const response = await omieApi.post('/geral/produtos/', {
      call: 'AlterarProduto',
      param: [{
        produto_servico_cadastro: produto,
      }],
    });
    return response.data;
  },

  // Excluir produto
  excluirProduto: async (codigoProduto: number): Promise<void> => {
    await omieApi.post('/geral/produtos/', {
      call: 'ExcluirProduto',
      param: [{
        codigo_produto: codigoProduto,
      }],
    });
  },
};

export default OmieApiService; 