import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Avatar,
  Text,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  useColorModeValue,
  Button,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
  FiPlus,
  FiChevronDown,
} from 'react-icons/fi';

interface HeaderProps {
  leftElement?: ReactNode;
}

const Header = ({ leftElement }: HeaderProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      as="header"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={{ base: 4, md: 6 }}
      py={4}
      position="sticky"
      top={0}
      zIndex="sticky"
    >
      <Flex align="center" justify="space-between" maxW="1400px" mx="auto">
        <Flex align="center" flex={{ base: 1, md: 'auto' }}>
          {leftElement}
          <InputGroup maxW={{ base: '100%', md: '320px' }}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Buscar..."
              variant="filled"
              bg={useColorModeValue('gray.100', 'gray.700')}
              _hover={{ bg: useColorModeValue('gray.200', 'gray.600') }}
              _focus={{
                bg: useColorModeValue('gray.200', 'gray.600'),
                borderColor: 'brand.500',
              }}
            />
          </InputGroup>
        </Flex>

        <HStack spacing={4}>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FiBell />}
              variant="ghost"
              position="relative"
              aria-label="Notificações"
            >
              <Badge
                position="absolute"
                top="-1"
                right="-1"
                px={2}
                py={1}
                fontSize="xs"
                rounded="full"
                bg="red.500"
                color="white"
              >
                3
              </Badge>
            </MenuButton>
            <MenuList>
              <MenuItem>Nova mensagem</MenuItem>
              <MenuItem>Atualização disponível</MenuItem>
              <MenuItem>Novo relatório</MenuItem>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack spacing={3}>
                <Avatar
                  size="sm"
                  name="Walesson Silva"
                  src="https://bit.ly/broken-link"
                />
                <Text
                  display={{ base: 'none', md: 'flex' }}
                  fontSize="sm"
                  fontWeight="medium"
                >
                  Walesson Silva
                </Text>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem>Perfil</MenuItem>
              <MenuItem>Configurações</MenuItem>
              <MenuItem>Sair</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header; 