import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Text,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  ButtonGroup,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiRefreshCcw,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { useOmieProdutos } from '../../hooks/useOmieProdutos';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/Card/Card';
import OmieConnectionTest from './components/OmieConnectionTest';
import { useDebounce } from '../../hooks/useDebounce';
import { formatCurrency } from '../../utils/formatters';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Debounce para a busca
  const debouncedSearch = useDebounce(searchTerm, 500);

  const {
    produtos,
    loading,
    error,
    totalRegistros,
    recarregarProdutos,
  } = useOmieProdutos({
    pagina: currentPage,
    registros_por_pagina: itemsPerPage,
    busca: debouncedSearch,
  });

  // Reset página quando mudar a busca
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const totalPages = Math.ceil(totalRegistros / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (error) {
    return (
      <Layout>
        <Alert status="error" mb={6} borderRadius="lg">
          <AlertIcon />
          <Box>
            <AlertTitle>Erro ao carregar produtos</AlertTitle>
            <AlertDescription>{error.description}</AlertDescription>
          </Box>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card 
        title="Lista de Produtos" 
        subtitle={`Mostrando ${totalRegistros ? (currentPage - 1) * itemsPerPage + 1 : 0} - ${Math.min(currentPage * itemsPerPage, totalRegistros)} de ${totalRegistros} produtos`}
      >
        <Stack spacing={6}>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <HStack maxW={{ base: '100%', md: '320px' }}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FiSearch color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </HStack>
            <HStack>
              <OmieConnectionTest />
              <Button
                leftIcon={<FiRefreshCcw />}
                onClick={recarregarProdutos}
                isLoading={loading}
              >
                Atualizar
              </Button>
            </HStack>
          </Flex>

          {loading ? (
            <Flex justify="center" align="center" py={8}>
              <Spinner size="xl" color="brand.500" />
            </Flex>
          ) : (
            <>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Código</Th>
                      <Th>Nome do Produto</Th>
                      <Th isNumeric>Valor Unitário</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {produtos.map((produto) => (
                      <Tr key={produto.codigo_produto}>
                        <Td width="100px">{produto.codigo_produto}</Td>
                        <Td>
                          <Text fontWeight="medium">{produto.descricao}</Text>
                          {produto.codigo_produto_integracao && (
                            <Text fontSize="sm" color="gray.500">
                              Cód. Integração: {produto.codigo_produto_integracao}
                            </Text>
                          )}
                        </Td>
                        <Td isNumeric fontWeight="medium" color="brand.500">
                          {formatCurrency(produto.valor_unitario)}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              <Flex justify="center" align="center" mt={4}>
                <ButtonGroup spacing={2}>
                  <Button
                    leftIcon={<FiChevronLeft />}
                    onClick={handlePrevPage}
                    isDisabled={currentPage === 1 || loading}
                    variant="outline"
                  >
                    Anterior
                  </Button>
                  <Text px={4} py={2}>
                    Página {currentPage} de {totalPages}
                  </Text>
                  <Button
                    rightIcon={<FiChevronRight />}
                    onClick={handleNextPage}
                    isDisabled={currentPage === totalPages || loading}
                    variant="outline"
                  >
                    Próxima
                  </Button>
                </ButtonGroup>
              </Flex>
            </>
          )}
        </Stack>
      </Card>
    </Layout>
  );
};

export default Products; 