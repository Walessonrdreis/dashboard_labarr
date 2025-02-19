import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, Spinner, Center } from '@chakra-ui/react';
import { theme } from './theme';

// Lazy loading dos componentes
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics/Analytics'));
const Users = lazy(() => import('./pages/Users/Users'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const Products = lazy(() => import('./pages/Products/Products'));

// Componente de loading
const Loading = () => (
  <Center h="100vh">
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="brand.500"
      size="xl"
    />
  </Center>
);

function App() {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </Suspense>
      </Router>
    </ChakraProvider>
  );
}

export default App;
