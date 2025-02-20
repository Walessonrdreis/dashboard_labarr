import { Spinner, Center, Text, VStack } from '@chakra-ui/react';
import { LABELS } from '../../../pages/Users/constants/userConstants';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = LABELS.LOADING }: LoadingSpinnerProps) => {
  return (
    <Center py={8}>
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text color="gray.600">{message}</Text>
      </VStack>
    </Center>
  );
};

export default LoadingSpinner; 