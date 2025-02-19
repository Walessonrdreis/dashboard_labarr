import { useState, useEffect } from 'react';
import { OmieProdutoResumido, OmieProdutoFiltros, OmieError } from '../types/omie';
import OmieApiService from '../services/omieApi';

interface UseProdutosParams extends OmieProdutoFiltros {
  busca?: string;
}

export const useOmieProdutos = (params?: UseProdutosParams) => {
  const [produtos, setProdutos] = useState<OmieProdutoResumido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<OmieError | null>(null);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const buscarProdutos = async (filtros?: UseProdutosParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await OmieApiService.listarProdutos({
        ...params,
        ...filtros,
        filtrar_apenas_descricao: filtros?.busca ? 'S' : 'N',
        descricao: filtros?.busca || '',
      });
      
      setProdutos(response.produto_servico_resumido);
      setTotalRegistros(response.total_de_registros);
    } catch (err) {
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