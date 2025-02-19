import { useState, useEffect } from 'react';
import { OmieProduto, OmieProdutoFiltros, OmieError } from '../types/omie';
import OmieApiService from '../services/omieApi';

interface UseProdutosParams extends OmieProdutoFiltros {
  busca?: string;
}

export const useOmieProdutos = (params?: UseProdutosParams) => {
  const [produtos, setProdutos] = useState<OmieProduto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<OmieError | null>(null);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const buscarProdutos = async (filtros?: UseProdutosParams) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Buscando produtos com filtros:', filtros);
      
      const response = await OmieApiService.listarProdutos({
        ...params,
        ...filtros,
        filtrar_apenas_descricao: filtros?.busca ? 'S' : 'N',
        descricao: filtros?.busca || '',
      });
      
      console.log('Resposta da listagem de produtos:', response);
      
      setProdutos(response.produto_servico_cadastro);
      setTotalRegistros(response.total_de_registros);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError(err as OmieError);
      setProdutos([]);
      setTotalRegistros(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarProdutos(params);
  }, [
    params?.pagina, 
    params?.registros_por_pagina,
    params?.busca
  ]);

  const recarregarProdutos = () => {
    buscarProdutos(params);
  };

  return {
    produtos,
    loading,
    error,
    totalRegistros,
    recarregarProdutos,
  };
}; 