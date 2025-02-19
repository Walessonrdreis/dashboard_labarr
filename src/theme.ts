import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  colors: {
    brand: {
      50: '#E5F7FF',
      100: '#B8EAFF',
      200: '#8ADDFF',
      300: '#5CD0FF',
      400: '#2EC3FF',
      500: '#00B6FF',
      600: '#0092CC',
      700: '#006D99',
      800: '#004966',
      900: '#002433',
    },
    accent: {
      50: '#FFE5F2',
      100: '#FFB8D9',
      200: '#FF8AC0',
      300: '#FF5CA7',
      400: '#FF2E8E',
      500: '#FF0075',
      600: '#CC005D',
      700: '#990046',
      800: '#66002E',
      900: '#330017',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'lg',
      },
      defaultProps: {
        colorScheme: 'brand',
        size: 'md',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          boxShadow: 'lg',
          bg: 'white',
          overflow: 'hidden',
          transition: 'all 0.2s',
          _hover: {
            boxShadow: 'xl',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    Link: {
      baseStyle: {
        transition: 'all 0.2s',
        _hover: {
          textDecoration: 'none',
        },
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'brand.500',
      },
      variants: {
        filled: {
          field: {
            borderRadius: 'lg',
            bg: 'gray.50',
            _hover: {
              bg: 'gray.100',
            },
            _focus: {
              bg: 'white',
            },
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  layerStyles: {
    card: {
      bg: 'white',
      borderRadius: 'xl',
      boxShadow: 'lg',
      p: 6,
    },
    gradientBg: {
      bgGradient: 'linear(to-r, brand.500, accent.500)',
      color: 'white',
    },
  },
  textStyles: {
    h1: {
      fontSize: ['2xl', '3xl', '4xl'],
      fontWeight: 'bold',
      lineHeight: 'shorter',
      letterSpacing: 'tight',
    },
    h2: {
      fontSize: ['xl', '2xl'],
      fontWeight: 'semibold',
      lineHeight: 'short',
    },
    subtitle: {
      fontSize: 'md',
      fontWeight: 'medium',
      color: 'gray.600',
    },
  },
}); 