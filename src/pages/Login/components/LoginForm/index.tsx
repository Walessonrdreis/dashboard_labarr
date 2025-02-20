import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormErrorMessage,
  Checkbox,
  HStack,
  Link,
} from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/helpers';
import { LABELS, PLACEHOLDERS, ERROR_MESSAGES } from '../../utils/constants';
import LoginLoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';

const LoginForm = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validação
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);

    if (emailValidationError || passwordValidationError) {
      return;
    }

    await login({ email, password });
  };

  if (isLoading) {
    return <LoginLoadingSpinner />;
  }

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={4}>
        <FormControl isInvalid={!!emailError} id="email">
          <FormLabel>{LABELS.EMAIL}</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={PLACEHOLDERS.EMAIL}
          />
          {emailError && (
            <FormErrorMessage role="alert">{emailError}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!passwordError} id="password">
          <FormLabel>{LABELS.PASSWORD}</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={PLACEHOLDERS.PASSWORD}
          />
          {passwordError && (
            <FormErrorMessage role="alert">{passwordError}</FormErrorMessage>
          )}
        </FormControl>

        <HStack justify="space-between" width="100%">
          <Checkbox
            isChecked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          >
            {LABELS.REMEMBER_ME}
          </Checkbox>
          <Link color="brand.500" fontSize="sm">
            {LABELS.FORGOT_PASSWORD}
          </Link>
        </HStack>

        {error && <ErrorMessage message={error} role="alert" />}

        <Button
          type="submit"
          colorScheme="brand"
          width="100%"
          isLoading={isLoading}
          loadingText="Entrando..."
        >
          {LABELS.LOGIN_BUTTON}
        </Button>
      </VStack>
    </Box>
  );
};

export default LoginForm; 