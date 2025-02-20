import {
  Spinner,
  Center,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

const LoginLoadingSpinner = () => {
  const color = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Center
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.900')}
      zIndex="overlay"
      role="status"
    >
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color={color}
          size="xl"
          role="progressbar"
        />
        <Text color={textColor} fontSize="sm" fontWeight="medium">
          Autenticando...
        </Text>
      </VStack>
    </Center>
  );
};

export default LoginLoadingSpinner; 