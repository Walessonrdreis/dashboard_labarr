export interface ImagemProduto {
  url_imagem: string;
}

export interface OmieProduto {
  codigo_produto: number;
  codigo_produto_integracao?: string;
  codigo?: string;
  descricao: string;
  unidade: string;
  ncm?: string;
  ean?: string;
  valor_unitario: number;
  codigo_familia?: number;
  descricao_familia?: string;
  marca?: string;
  modelo?: string;
  altura?: number;
  largura?: number;
  profundidade?: number;
  peso_liq?: number;
  peso_bruto?: number;
  estoque_minimo?: number;
  estoque_maximo?: number;
  obs?: string;
  quantidade_estoque?: number;
  importado_api?: "S" | "N";
  inativo?: "S" | "N";
  imagens?: ImagemProduto[];
}

export interface OmieProdutoResumido {
  codigo_produto: number;
  codigo_produto_integracao: string;
  descricao: string;
  valor_unitario: number;
  codigo: string;
  imagens?: ImagemProduto[];
}

export interface OmieProdutoListaResponse {
  pagina: number;
  total_de_paginas: number;
  registros: number;
  total_de_registros: number;
  produto_servico_cadastro: OmieProduto[];
}

export interface OmieProdutoFiltros {
  pagina?: number;
  registros_por_pagina?: number;
  apenas_importado_api?: 'S' | 'N';
  descricao?: string;
}

export interface OmieError {
  code: string;
  description: string;
  referer?: string;
  fatal?: boolean;
} 