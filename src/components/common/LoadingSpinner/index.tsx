import {
  Spinner,
  SpinnerProps,
  Center,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

interface LoadingSpinnerProps extends SpinnerProps {
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = ({ text, fullScreen, ...props }: LoadingSpinnerProps) => {
  const color = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const content = (
    <VStack spacing={4}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color={color}
        size="xl"
        {...props}
      />
      {text && (
        <Text color={textColor} fontSize="sm" fontWeight="medium">
          {text}
        </Text>
      )}
    </VStack>
  );

  if (fullScreen) {
    return (
      <Center
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.900')}
        zIndex="overlay"
      >
        {content}
      </Center>
    );
  }

  return <Center py={4}>{content}</Center>;
};

export default LoadingSpinner; 