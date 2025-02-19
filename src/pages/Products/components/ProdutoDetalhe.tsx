import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Text,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  VStack,
  HStack,
  Divider,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import Layout from '../../../components/Layout/Layout';
import Card from '../../../components/Card/Card';
import { OmieProduto } from '../../../types/omie';
import OmieApiService from '../../../services/omieApi';
import { formatCurrency } from '../../../utils/formatters';

interface InfoProduto {
  dAlt: string;
  dInc: string;
  hAlt: string;
  hInc: string;
  uAlt: string;
  uInc: string;
}

interface RecomendacoesFiscais {
  cnpj_fabricante: string;
  cupom_fiscal: string;
  id_cest: string;
  id_preco_tabelado: number;
  indicador_escala: string;
  market_place: string;
  origem_mercadoria: string;
}

interface ProdutoDetalhado extends OmieProduto {
  aliquota_cofins: number;
  aliquota_ibpt: number;
  aliquota_icms: number;
  aliquota_pis: number;
  bloqueado: 'S' | 'N';
  bloquear_exclusao: 'S' | 'N';
  cest: string;
  cfop: string;
  codInt_familia: string;
  codigo_beneficio: string;
  csosn_icms: string;
  cst_cofins: string;
  cst_icms: string;
  cst_pis: string;
  descr_detalhada: string;
  dias_crossdocking: number;
  dias_garantia: number;
  exibir_descricao_nfe: 'S' | 'N';
  exibir_descricao_pedido: 'S' | 'N';
  info: InfoProduto;
  lead_time: number;
  motivo_deson_icms: string;
  obs_internas: string;
  per_icms_fcp: number;
  recomendacoes_fiscais: RecomendacoesFiscais;
  red_base_cofins: number;
  red_base_icms: number;
  red_base_pis: number;
  tipoItem: string;
}

const ProdutoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [produto, setProduto] = useState<ProdutoDetalhado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarProduto = async () => {
      try {
        setLoading(true);
        console.log('ID recebido do useParams:', id);
        
        if (!id) {
          throw new Error('Código do produto não fornecido');
        }

        const codigoProduto = Number(id);
        
        if (isNaN(codigoProduto)) {
          throw new Error('Código do produto inválido - não é um número');
        }

        console.log('Código do produto convertido:', codigoProduto, 'Tipo:', typeof codigoProduto);
        
        const data = await OmieApiService.consultarProduto(codigoProduto);
        console.log('Dados do produto recebidos:', data);
        
        if (!data) {
          throw new Error('Produto não encontrado');
        }
        
        setProduto(data as ProdutoDetalhado);
      } catch (err: any) {
        console.error('Erro ao carregar produto:', err);
        const errorMessage = err.description || err.message || 'Erro ao carregar dados do produto';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    carregarProduto();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
          <Spinner size="xl" color="brand.500" />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert status="error" mb={6} borderRadius="lg">
          <AlertIcon />
          <Box>
            <AlertTitle>Erro ao carregar produto</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
      </Layout>
    );
  }

  if (!produto) {
    return (
      <Layout>
        <Alert status="warning" mb={6} borderRadius="lg">
          <AlertIcon />
          <Box>
            <AlertTitle>Produto não encontrado</AlertTitle>
            <AlertDescription>O produto solicitado não foi encontrado.</AlertDescription>
          </Box>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <VStack spacing={6} align="stretch">
        <HStack>
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            onClick={() => navigate('/products')}
          >
            Voltar
          </Button>
        </HStack>

        <Card title={produto.descricao}>
          <VStack spacing={6} align="stretch">
            {/* Informações Básicas */}
            <Box>
              <Heading size="md" mb={4}>Informações Básicas</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                <Box>
                  <Text fontWeight="bold">Código</Text>
                  <Text>{produto.codigo}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Código do Produto</Text>
                  <Text>{produto.codigo_produto}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Valor Unitário</Text>
                  <Text color="brand.500" fontWeight="bold">
                    {formatCurrency(produto.valor_unitario)}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Marca</Text>
                  <Text>{produto.marca || '-'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Modelo</Text>
                  <Text>{produto.modelo || '-'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Unidade</Text>
                  <Text>{produto.unidade}</Text>
                </Box>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Dimensões e Peso */}
            <Box>
              <Heading size="md" mb={4}>Dimensões e Peso</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                <Box>
                  <Text fontWeight="bold">Altura</Text>
                  <Text>{produto.altura || '-'} cm</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Largura</Text>
                  <Text>{produto.largura || '-'} cm</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Profundidade</Text>
                  <Text>{produto.profundidade || '-'} cm</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Peso Líquido</Text>
                  <Text>{produto.peso_liq || '-'} kg</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Peso Bruto</Text>
                  <Text>{produto.peso_bruto || '-'} kg</Text>
                </Box>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Estoque */}
            <Box>
              <Heading size="md" mb={4}>Informações de Estoque</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                <Box>
                  <Text fontWeight="bold">Quantidade em Estoque</Text>
                  <Text>{produto.quantidade_estoque || 0}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Estoque Mínimo</Text>
                  <Text>{produto.estoque_minimo || 0}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Lead Time</Text>
                  <Text>{produto.lead_time || 0} dias</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Dias Crossdocking</Text>
                  <Text>{produto.dias_crossdocking || 0} dias</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Dias Garantia</Text>
                  <Text>{produto.dias_garantia || 0} dias</Text>
                </Box>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Informações Fiscais */}
            <Box>
              <Heading size="md" mb={4}>Informações Fiscais</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                <Box>
                  <Text fontWeight="bold">NCM</Text>
                  <Text>{produto.ncm || '-'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">CEST</Text>
                  <Text>{produto.cest || '-'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">CFOP</Text>
                  <Text>{produto.cfop || '-'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">EAN</Text>
                  <Text>{produto.ean || '-'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Tipo Item</Text>
                  <Text>{produto.tipoItem || '-'}</Text>
                </Box>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Alíquotas */}
            <Box>
              <Heading size="md" mb={4}>Alíquotas</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                <Box>
                  <Text fontWeight="bold">ICMS</Text>
                  <Text>{produto.aliquota_icms}%</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">PIS</Text>
                  <Text>{produto.aliquota_pis}%</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">COFINS</Text>
                  <Text>{produto.aliquota_cofins}%</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">IBPT</Text>
                  <Text>{produto.aliquota_ibpt}%</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">ICMS FCP</Text>
                  <Text>{produto.per_icms_fcp}%</Text>
                </Box>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Status */}
            <Box>
              <Heading size="md" mb={4}>Status</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                <Box>
                  <Text fontWeight="bold">Status</Text>
                  <Badge colorScheme={produto.inativo === 'N' ? 'green' : 'red'}>
                    {produto.inativo === 'N' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </Box>
                <Box>
                  <Text fontWeight="bold">Bloqueado</Text>
                  <Badge colorScheme={produto.bloqueado === 'N' ? 'green' : 'red'}>
                    {produto.bloqueado === 'N' ? 'Não' : 'Sim'}
                  </Badge>
                </Box>
                <Box>
                  <Text fontWeight="bold">Importado API</Text>
                  <Badge colorScheme={produto.importado_api === 'S' ? 'blue' : 'gray'}>
                    {produto.importado_api === 'S' ? 'Sim' : 'Não'}
                  </Badge>
                </Box>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Informações Adicionais */}
            <Box>
              <Heading size="md" mb={4}>Informações Adicionais</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text fontWeight="bold">Família</Text>
                  <Text>{produto.descricao_familia || '-'}</Text>
                  <Text fontSize="sm" color="gray.500">
                    Código: {produto.codigo_familia || '-'}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Código Integração</Text>
                  <Text>{produto.codigo_produto_integracao || '-'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Descrição Detalhada</Text>
                  <Text>{produto.descr_detalhada || '-'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Observações Internas</Text>
                  <Text>{produto.obs_internas || '-'}</Text>
                </Box>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Informações de Registro */}
            <Box>
              <Heading size="md" mb={4}>Informações de Registro</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text fontWeight="bold">Cadastrado em</Text>
                  <Text>{produto.info.dInc} às {produto.info.hInc}</Text>
                  <Text fontSize="sm" color="gray.500">
                    por {produto.info.uInc}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Última alteração</Text>
                  <Text>{produto.info.dAlt} às {produto.info.hAlt}</Text>
                  <Text fontSize="sm" color="gray.500">
                    por {produto.info.uAlt}
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Recomendações Fiscais */}
            <Box>
              <Heading size="md" mb={4}>Recomendações Fiscais</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text fontWeight="bold">CNPJ Fabricante</Text>
                  <Text>{produto.recomendacoes_fiscais.cnpj_fabricante || '-'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Cupom Fiscal</Text>
                  <Badge colorScheme={produto.recomendacoes_fiscais.cupom_fiscal === 'S' ? 'green' : 'red'}>
                    {produto.recomendacoes_fiscais.cupom_fiscal === 'S' ? 'Sim' : 'Não'}
                  </Badge>
                </Box>
                <Box>
                  <Text fontWeight="bold">Marketplace</Text>
                  <Badge colorScheme={produto.recomendacoes_fiscais.market_place === 'S' ? 'green' : 'red'}>
                    {produto.recomendacoes_fiscais.market_place === 'S' ? 'Sim' : 'Não'}
                  </Badge>
                </Box>
                <Box>
                  <Text fontWeight="bold">Origem da Mercadoria</Text>
                  <Text>{produto.recomendacoes_fiscais.origem_mercadoria || '-'}</Text>
                </Box>
              </SimpleGrid>
            </Box>
          </VStack>
        </Card>
      </VStack>
    </Layout>
  );
};

export default ProdutoDetalhe; 