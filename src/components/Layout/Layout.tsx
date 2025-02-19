import { ReactNode, useState } from 'react';
import {
  Flex,
  Box,
  IconButton,
  useBreakpointValue,
  useColorModeValue,
  Drawer,
  DrawerContent,
  DrawerOverlay,
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const onClose = () => setSidebarOpen(false);

  return (
    <Flex h="100vh" bg={bgColor} overflow="hidden">
      {isDesktop ? (
        <Sidebar />
      ) : (
        <Drawer isOpen={isSidebarOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <Sidebar />
          </DrawerContent>
        </Drawer>
      )}

      <Flex direction="column" flex="1" overflow="hidden">
        <Header
          leftElement={
            !isDesktop && (
              <IconButton
                aria-label="Menu"
                icon={<FiMenu />}
                variant="ghost"
                onClick={() => setSidebarOpen(true)}
                mr={4}
              />
            )
          }
        />
        <Box
          flex="1"
          overflowX="hidden"
          overflowY="auto"
          p={{ base: 4, md: 6, lg: 8 }}
          bg={bgColor}
        >
          <Box maxW="1400px" mx="auto">
            {children}
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout; 