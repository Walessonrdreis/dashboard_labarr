import { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  VStack,
  Text,
  useForm,
} from '@chakra-ui/react';
import { User, UserFormData, UserRole, UserStatus } from '../../types/User';
import { LABELS, ERROR_MESSAGES, USER_ROLES, USER_STATUS } from '../../constants/userConstants';
import { validateEmail } from '../../utils/userHelpers';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: User | UserFormData) => void;
  user?: User;
  isLoading?: boolean;
  error?: string;
}

const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading = false,
  error,
}: UserFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<UserFormData>({
    defaultValues: {
      nome: '',
      email: '',
      cargo: 'USER' as UserRole,
      status: 'ACTIVE' as UserStatus,
    },
  });

  useEffect(() => {
    if (user) {
      setValue('nome', user.nome);
      setValue('email', user.email);
      setValue('cargo', user.cargo);
      setValue('status', user.status);
    }
  }, [user, setValue]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmitForm = (data: UserFormData) => {
    if (user) {
      onSubmit({ ...user, ...data });
    } else {
      onSubmit(data);
    }
  };

  const validateFormEmail = (value: string) => {
    if (!value) return ERROR_MESSAGES.REQUIRED_FIELD;
    if (!validateEmail(value)) return ERROR_MESSAGES.INVALID_EMAIL;
    return true;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {user ? LABELS.EDIT_USER : LABELS.ADD_USER}
        </ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit(onSubmitForm)}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.nome} isRequired>
                <FormLabel htmlFor="nome">{LABELS.NAME}</FormLabel>
                <Input
                  id="nome"
                  {...register('nome', {
                    required: ERROR_MESSAGES.REQUIRED_FIELD,
                  })}
                  isDisabled={isLoading}
                  aria-required="true"
                />
                <FormErrorMessage role="alert">
                  {errors.nome?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email} isRequired>
                <FormLabel htmlFor="email">{LABELS.EMAIL}</FormLabel>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: ERROR_MESSAGES.REQUIRED_FIELD,
                    validate: validateFormEmail,
                  })}
                  isDisabled={isLoading}
                  aria-required="true"
                />
                <FormErrorMessage role="alert">
                  {errors.email?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.cargo} isRequired>
                <FormLabel htmlFor="cargo">{LABELS.ROLE}</FormLabel>
                <Select
                  id="cargo"
                  {...register('cargo', {
                    required: ERROR_MESSAGES.REQUIRED_FIELD,
                  })}
                  isDisabled={isLoading}
                  aria-required="true"
                >
                  {Object.entries(USER_ROLES).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage role="alert">
                  {errors.cargo?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.status} isRequired>
                <FormLabel htmlFor="status">{LABELS.STATUS}</FormLabel>
                <Select
                  id="status"
                  {...register('status', {
                    required: ERROR_MESSAGES.REQUIRED_FIELD,
                  })}
                  isDisabled={isLoading}
                  aria-required="true"
                >
                  {Object.entries(USER_STATUS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage role="alert">
                  {errors.status?.message}
                </FormErrorMessage>
              </FormControl>

              {error && (
                <Text color="red.500" fontSize="sm" role="alert">
                  {error}
                </Text>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter gap={2}>
            <Button
              variant="ghost"
              onClick={onClose}
              isDisabled={isLoading}
            >
              {LABELS.CANCEL}
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              {LABELS.SAVE}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default UserFormModal; 