import { ReactNode } from 'react';
import {
  Box,
  Heading,
  useColorModeValue,
  BoxProps,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import { FiMoreVertical } from 'react-icons/fi';

interface CardProps extends BoxProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  isGradient?: boolean;
}

const Card = ({
  title,
  subtitle,
  icon,
  action,
  children,
  isGradient = false,
  ...rest
}: CardProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box
      bg={isGradient ? 'none' : bgColor}
      bgGradient={isGradient ? 'linear(to-r, brand.500, accent.500)' : undefined}
      color={isGradient ? 'white' : 'inherit'}
      borderRadius="xl"
      boxShadow="lg"
      border="1px solid"
      borderColor={isGradient ? 'transparent' : borderColor}
      p={6}
      position="relative"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'xl',
      }}
      {...rest}
    >
      <HStack justify="space-between" mb={subtitle ? 1 : 4}>
        <HStack spacing={3}>
          {icon && (
            <Box
              p={2}
              borderRadius="lg"
              bg={isGradient ? 'whiteAlpha.200' : 'brand.50'}
              color={isGradient ? 'white' : 'brand.500'}
            >
              {icon}
            </Box>
          )}
          <Box>
            <Heading
              as="h2"
              size="md"
              fontWeight="semibold"
              color={isGradient ? 'white' : 'gray.700'}
            >
              {title}
            </Heading>
            {subtitle && (
              <Text
                fontSize="sm"
                color={isGradient ? 'whiteAlpha.800' : 'gray.500'}
                mt={1}
              >
                {subtitle}
              </Text>
            )}
          </Box>
        </HStack>
        {action || (
          <Icon
            as={FiMoreVertical}
            cursor="pointer"
            opacity={0.5}
            _hover={{ opacity: 1 }}
            transition="opacity 0.2s"
          />
        )}
      </HStack>
      {children}
    </Box>
  );
};

export default Card; 