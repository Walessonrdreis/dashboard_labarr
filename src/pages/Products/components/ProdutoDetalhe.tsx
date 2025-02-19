import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Divider,
  Spinner,
  useToast,
  SimpleGrid,
} from '@chakra-ui/react';
import { FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Layout from '../../../components/Layout/Layout';
import Card from '../../../components/Card/Card';
import { OmieProduto } from '../../../types/omie';
import OmieApiService from '../../../services/omieApi';
import { formatCurrency } from '../../../utils/formatters';

const ProdutoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [produto, setProduto] = useState<OmieProduto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarProduto = async () => {
      try {
        setLoading(true);
        if (id) {
          const response = await OmieApiService.consultarProduto(Number(id));
          setProduto(response);
        }
      } catch (error: any) {
        toast({
          title: 'Erro ao carregar produto',
          description: error.description || 'Não foi possível carregar os detalhes do produto',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    carregarProduto();
  }, [id, toast]);

  const handleExcluir = async () => {
    if (!produto) return;

    try {
      await OmieApiService.excluirProduto(produto.codigo_produto);
      toast({
        title: 'Produto excluído',
        description: 'O produto foi excluído com sucesso',
        status: 'success',
        duration: 3000,
      });
      navigate('/products');
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir',
        description: error.description || 'Não foi possível excluir o produto',
        status: 'error',
        duration: 5000,
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
          <Spinner size="xl" color="brand.500" />
        </Box>
      </Layout>
    );
  }

  if (!produto) {
    return (
      <Layout>
        <Card title="Produto não encontrado">
          <VStack spacing={4} align="stretch">
            <Text>O produto solicitado não foi encontrado.</Text>
            <Button leftIcon={<FiArrowLeft />} onClick={() => navigate('/products')}>
              Voltar para lista
            </Button>
          </VStack>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            onClick={() => navigate('/products')}
          >
            Voltar para lista
          </Button>
          <HStack>
            <Button
              leftIcon={<FiEdit2 />}
              colorScheme="blue"
              onClick={() => navigate(`/products/edit/${produto.codigo_produto}`)}
            >
              Editar
            </Button>
            <Button
              leftIcon={<FiTrash2 />}
              colorScheme="red"
              onClick={handleExcluir}
            >
              Excluir
            </Button>
          </HStack>
        </HStack>

        <Card title="Detalhes do Produto">
          <VStack spacing={6} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Text color="gray.500" fontSize="sm">Código do Produto</Text>
                <Text fontSize="lg" fontWeight="medium">{produto.codigo_produto}</Text>
              </Box>
              
              {produto.codigo_produto_integracao && (
                <Box>
                  <Text color="gray.500" fontSize="sm">Código de Integração</Text>
                  <Text fontSize="lg" fontWeight="medium">{produto.codigo_produto_integracao}</Text>
                </Box>
              )}
            </SimpleGrid>

            <Box>
              <Text color="gray.500" fontSize="sm">Descrição</Text>
              <Text fontSize="lg" fontWeight="medium">{produto.descricao}</Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Text color="gray.500" fontSize="sm">Valor Unitário</Text>
                <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                  {formatCurrency(produto.valor_unitario)}
                </Text>
              </Box>

              <Box>
                <Text color="gray.500" fontSize="sm">Status</Text>
                <Badge
                  colorScheme="green"
                  fontSize="md"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  Ativo
                </Badge>
              </Box>
            </SimpleGrid>

            <Divider />

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Box>
                <Text color="gray.500" fontSize="sm">Unidade</Text>
                <Text fontSize="lg">{produto.unidade || 'UN'}</Text>
              </Box>
              
              <Box>
                <Text color="gray.500" fontSize="sm">NCM</Text>
                <Text fontSize="lg">{produto.ncm || 'Não informado'}</Text>
              </Box>

              <Box>
                <Text color="gray.500" fontSize="sm">EAN</Text>
                <Text fontSize="lg">{produto.ean || 'Não informado'}</Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </Card>
      </VStack>
    </Layout>
  );
};

export default ProdutoDetalhe; 