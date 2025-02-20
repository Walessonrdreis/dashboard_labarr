import React, { Component, ErrorInfo } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Container,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Code,
  Collapse,
} from '@chakra-ui/react';
import { FiRefreshCcw } from 'react-icons/fi';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      showDetails: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    
    // Aqui você pode adicionar integração com serviços de monitoramento de erros
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxW="container.xl" py={10}>
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="lg"
            p={8}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Ops! Algo deu errado
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Desculpe, ocorreu um erro inesperado. Nossa equipe foi notificada.
            </AlertDescription>

            <VStack spacing={4} mt={6}>
              <Button
                leftIcon={<FiRefreshCcw />}
                colorScheme="brand"
                onClick={this.handleReload}
              >
                Recarregar Página
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={this.toggleDetails}
              >
                {this.state.showDetails ? 'Ocultar' : 'Mostrar'} Detalhes Técnicos
              </Button>

              <Collapse in={this.state.showDetails}>
                <Box
                  mt={4}
                  p={4}
                  bg="gray.50"
                  borderRadius="md"
                  maxW="600px"
                  overflow="auto"
                >
                  <Text fontWeight="bold" mb={2}>
                    Erro:
                  </Text>
                  <Code display="block" whiteSpace="pre-wrap" p={2}>
                    {this.state.error?.toString()}
                  </Code>

                  {this.state.errorInfo && (
                    <>
                      <Text fontWeight="bold" mt={4} mb={2}>
                        Stack Trace:
                      </Text>
                      <Code display="block" whiteSpace="pre-wrap" p={2}>
                        {this.state.errorInfo.componentStack}
                      </Code>
                    </>
                  )}
                </Box>
              </Collapse>
            </VStack>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 