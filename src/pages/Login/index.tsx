import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import LoginForm from './components/LoginForm';

const Login = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box minH="100vh" bg={bgColor} py={10}>
      <Container maxW="container.sm">
        <VStack spacing={8} bg={cardBgColor} p={8} borderRadius="xl" boxShadow="lg">
          <Image
            src="/logo.png"
            alt="Dashboard Lab"
            width="200px"
            mb={4}
          />
          
          <VStack spacing={2} textAlign="center">
            <Heading size="xl">Bem-vindo de volta!</Heading>
            <Text color="gray.500">
              Faça login para acessar o painel administrativo
            </Text>
          </VStack>

          <LoginForm />
        </VStack>
      </Container>
    </Box>
  );
};

export default Login; 