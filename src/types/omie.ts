export interface OmieProduto {
  codigo_produto: number;
  codigo_produto_integracao?: string;
  descricao: string;
  valor_unitario: number;
}

export interface OmieProdutoResumido {
  codigo_produto: number;
  codigo_produto_integracao: string;
  descricao: string;
  valor_unitario: number;
  codigo: string;
}

export interface OmieProdutoListaResponse {
  pagina: number;
  total_de_paginas: number;
  registros: number;
  total_de_registros: number;
  produto_servico_resumido: OmieProdutoResumido[];
}

export interface OmieProdutoFiltros {
  pagina?: number;
  registros_por_pagina?: number;
  apenas_importado_api?: 'S' | 'N';
  filtrar_apenas_descricao?: 'S' | 'N';
  descricao?: string;
}

export interface OmieError {
  code: string;
  description: string;
  referer?: string;
  fatal?: boolean;
} 