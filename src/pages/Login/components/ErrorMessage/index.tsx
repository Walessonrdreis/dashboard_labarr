import {
  Alert,
  AlertIcon,
  AlertDescription,
  useColorModeValue,
} from '@chakra-ui/react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  const bgColor = useColorModeValue('red.50', 'red.900');
  const textColor = useColorModeValue('red.600', 'red.200');

  return (
    <Alert
      status="error"
      variant="subtle"
      bg={bgColor}
      rounded="md"
      alignItems="center"
    >
      <AlertIcon color={textColor} />
      <AlertDescription color={textColor}>{message}</AlertDescription>
    </Alert>
  );
};

export default ErrorMessage; 