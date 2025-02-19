import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Button,
  Code,
  VStack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import OmieApiService from '../../../services/omieApi';

export default function OmieConnectionTest() {
  const [testResult, setTestResult] = useState<{
    success: boolean;
    data?: any;
    error?: string;
  } | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const testConnection = async () => {
    try {
      // Tenta buscar apenas 1 produto para testar a conexão
      const response = await OmieApiService.listarProdutos({
        pagina: 1,
        registros_por_pagina: 1,
      });

      setTestResult({
        success: true,
        data: response,
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.description || 'Erro ao conectar com a API do OMIE',
      });
    }
    onOpen();
  };

  return (
    <>
      <Button
        onClick={testConnection}
        size="sm"
        colorScheme={testResult?.success ? 'green' : 'blue'}
        leftIcon={testResult?.success ? <FiCheckCircle /> : <FiAlertCircle />}
      >
        Testar Conexão OMIE
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Resultado do Teste de Conexão</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {testResult && (
              <VStack spacing={4} align="stretch">
                {testResult.success ? (
                  <>
                    <Alert status="success">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>Conexão estabelecida com sucesso!</AlertTitle>
                        <AlertDescription>
                          A API do OMIE está respondendo corretamente.
                        </AlertDescription>
                      </Box>
                    </Alert>
                    
                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        Dados recebidos:
                      </Text>
                      <Box
                        bg="gray.50"
                        p={4}
                        borderRadius="md"
                        maxH="400px"
                        overflowY="auto"
                      >
                        <Code
                          display="block"
                          whiteSpace="pre"
                          children={JSON.stringify(testResult.data, null, 2)}
                        />
                      </Box>
                    </Box>

                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        Informações da resposta:
                      </Text>
                      <VStack align="stretch" spacing={2}>
                        <Text>
                          Total de registros:{' '}
                          <Code>{testResult.data.total_de_registros}</Code>
                        </Text>
                        <Text>
                          Página atual: <Code>{testResult.data.pagina}</Code>
                        </Text>
                        <Text>
                          Total de páginas:{' '}
                          <Code>{testResult.data.total_de_paginas}</Code>
                        </Text>
                      </VStack>
                    </Box>
                  </>
                ) : (
                  <Alert status="error">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Erro na conexão!</AlertTitle>
                      <AlertDescription>
                        {testResult.error}
                        <Box mt={2}>
                          <Text fontWeight="bold">Possíveis causas:</Text>
                          <Text>1. Credenciais incorretas no arquivo .env</Text>
                          <Text>2. Problemas de rede</Text>
                          <Text>3. API do OMIE indisponível</Text>
                        </Box>
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
} 