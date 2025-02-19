import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  VStack,
  Heading,
  Link,
  Icon,
  Text,
  HStack,
  Flex,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiUsers,
  FiSettings,
  FiPieChart,
  FiBell,
  FiPackage,
} from 'react-icons/fi';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: FiHome },
  { path: '/products', label: 'Produtos', icon: FiPackage },
  { path: '/analytics', label: 'Analytics', icon: FiTrendingUp },
  { path: '/users', label: 'Usuários', icon: FiUsers },
  { path: '/settings', label: 'Configurações', icon: FiSettings },
];

const Sidebar = () => {
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box
      w="64"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      h="100vh"
      position="sticky"
      top="0"
    >
      <Flex
        h="20"
        alignItems="center"
        justifyContent="center"
        borderBottom="1px"
        borderColor={borderColor}
        bgGradient="linear(to-r, brand.500, accent.500)"
        color="white"
      >
        <Heading size="lg" fontWeight="bold">
          Dashboard Lab
        </Heading>
      </Flex>

      <VStack spacing={1} align="stretch" mt={6}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            as={RouterLink}
            to={item.path}
            px={6}
            py={3}
            display="block"
            color={location.pathname === item.path ? 'brand.500' : 'gray.600'}
            _hover={{
              bg: 'gray.50',
              color: 'brand.500',
              transform: 'translateX(4px)',
            }}
            transition="all 0.2s"
            bg={location.pathname === item.path ? 'brand.50' : 'transparent'}
            position="relative"
            _before={{
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              bg: location.pathname === item.path ? 'brand.500' : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            <HStack spacing={3}>
              <Icon
                as={item.icon}
                fontSize="xl"
                transition="all 0.2s"
                _groupHover={{ transform: 'scale(1.1)' }}
              />
              <Text fontWeight={location.pathname === item.path ? 'semibold' : 'medium'}>
                {item.label}
              </Text>
            </HStack>
          </Link>
        ))}
      </VStack>

      <Divider my={6} borderColor={borderColor} />

      <Box px={6}>
        <Text fontSize="sm" color="gray.500" mb={2} fontWeight="medium">
          Atalhos
        </Text>
        <VStack spacing={3} align="stretch">
          <HStack
            p={3}
            bg="gray.50"
            rounded="lg"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ bg: 'gray.100' }}
          >
            <Icon as={FiPieChart} color="brand.500" />
            <Text fontSize="sm" fontWeight="medium">
              Relatórios
            </Text>
          </HStack>
          <HStack
            p={3}
            bg="gray.50"
            rounded="lg"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ bg: 'gray.100' }}
          >
            <Icon as={FiBell} color="accent.500" />
            <Text fontSize="sm" fontWeight="medium">
              Notificações
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default Sidebar; 