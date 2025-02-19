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
  Input,
  SimpleGrid,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { OmieProduto } from '../../../types/omie';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (produto: OmieProduto | Omit<OmieProduto, 'codigo_produto'>) => Promise<void>;
  product?: OmieProduto | null;
}

const ProductModal = ({ isOpen, onClose, onSave, product }: ProductModalProps) => {
  const toast = useToast();
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<OmieProduto>();

  useEffect(() => {
    if (product) {
      Object.entries(product).forEach(([key, value]) => {
        setValue(key as keyof OmieProduto, value);
      });
    } else {
      reset({
        descricao: '',
        unidade: 'UN',
        valor_unitario: 0,
        quantidade_estoque: 0,
        estoque_minimo: 0,
      });
    }
  }, [product, setValue, reset]);

  const onSubmit = async (data: OmieProduto) => {
    try {
      await onSave(data);
      onClose();
      reset();
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Ocorreu um erro ao salvar o produto.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            {product ? 'Editar Produto' : 'Novo Produto'}
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Descrição</FormLabel>
                <Input
                  {...register('descricao', { required: 'Campo obrigatório' })}
                  placeholder="Digite a descrição do produto"
                />
              </FormControl>

              <SimpleGrid columns={2} spacing={4} w="100%">
                <FormControl isRequired>
                  <FormLabel>Unidade</FormLabel>
                  <Input
                    {...register('unidade', { required: 'Campo obrigatório' })}
                    placeholder="UN"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Valor Unitário</FormLabel>
                  <NumberInput min={0} precision={2}>
                    <NumberInputField
                      {...register('valor_unitario', {
                        required: 'Campo obrigatório',
                        min: 0,
                      })}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={2} spacing={4} w="100%">
                <FormControl>
                  <FormLabel>Código EAN</FormLabel>
                  <Input
                    {...register('codigo_ean')}
                    placeholder="Digite o código EAN"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>NCM</FormLabel>
                  <Input
                    {...register('ncm')}
                    placeholder="Digite o NCM"
                  />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={2} spacing={4} w="100%">
                <FormControl>
                  <FormLabel>Quantidade em Estoque</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      {...register('quantidade_estoque', { min: 0 })}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Estoque Mínimo</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      {...register('estoque_minimo', { min: 0 })}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={3} spacing={4} w="100%">
                <FormControl>
                  <FormLabel>Altura (cm)</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      {...register('altura', { min: 0 })}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Largura (cm)</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      {...register('largura', { min: 0 })}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Profundidade (cm)</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      {...register('profundidade', { min: 0 })}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              isLoading={isSubmitting}
            >
              Salvar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ProductModal; 