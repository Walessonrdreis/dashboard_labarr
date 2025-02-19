import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Code,
  Flex,
  Text,
  useToast,
  IconButton,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiCopy, FiDownload } from 'react-icons/fi';

interface LogViewerProps {
  logs: string[];
  title?: string;
  maxHeight?: string;
  downloadFileName?: string;
}

const LogViewer = ({
  logs,
  title = 'Logs do Sistema',
  maxHeight = '400px',
  downloadFileName = 'system-logs.txt',
}: LogViewerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const logContentRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleCopy = async () => {
    if (logContentRef.current) {
      try {
        const text = logs.join('\n');
        await navigator.clipboard.writeText(text);
        toast({
          title: 'Logs copiados!',
          description: 'O conteúdo foi copiado para a área de transferência.',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Erro ao copiar',
          description: 'Não foi possível copiar o conteúdo.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  const handleDownload = () => {
    const text = logs.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      overflow="hidden"
    >
      <Flex
        justify="space-between"
        align="center"
        p={4}
        borderBottom="1px solid"
        borderColor={borderColor}
        bg={bgColor}
      >
        <Text fontWeight="medium">{title}</Text>
        <Flex gap={2}>
          <Tooltip label="Copiar logs">
            <IconButton
              aria-label="Copiar logs"
              icon={<FiCopy />}
              size="sm"
              onClick={handleCopy}
            />
          </Tooltip>
          <Tooltip label="Download logs">
            <IconButton
              aria-label="Download logs"
              icon={<FiDownload />}
              size="sm"
              onClick={handleDownload}
            />
          </Tooltip>
        </Flex>
      </Flex>

      <Box
        ref={logContentRef}
        p={4}
        maxH={maxHeight}
        overflowY="auto"
        bg={useColorModeValue('gray.50', 'gray.900')}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        position="relative"
        css={{
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: useColorModeValue('gray.100', 'gray.800'),
          },
          '&::-webkit-scrollbar-thumb': {
            background: useColorModeValue('gray.300', 'gray.600'),
            borderRadius: '4px',
          },
        }}
      >
        <Code
          display="block"
          whiteSpace="pre"
          fontFamily="monospace"
          fontSize="sm"
          p={0}
          bg="transparent"
        >
          {logs.map((log, index) => (
            <Text key={index} py={0.5}>
              {log}
            </Text>
          ))}
        </Code>
      </Box>
    </Box>
  );
};

export default LogViewer; 