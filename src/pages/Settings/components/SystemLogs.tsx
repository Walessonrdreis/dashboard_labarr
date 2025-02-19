import { useState, useEffect } from 'react';
import { Box, Heading, Button, HStack } from '@chakra-ui/react';
import LogViewer from '../../../components/LogViewer/LogViewer';

const SystemLogs = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [autoUpdate, setAutoUpdate] = useState(false);

  // Simulação de logs do sistema
  const generateLog = () => {
    const actions = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
    const components = ['Sistema', 'Banco de Dados', 'API', 'Cache', 'Autenticação'];
    const messages = [
      'Iniciando processo',
      'Operação concluída com sucesso',
      'Falha na conexão',
      'Tentativa de reconexão',
      'Cache atualizado',
      'Sessão expirada',
      'Novo usuário registrado',
    ];

    const timestamp = new Date().toISOString();
    const action = actions[Math.floor(Math.random() * actions.length)];
    const component = components[Math.floor(Math.random() * components.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];

    return `[${timestamp}] [${action}] [${component}] - ${message}`;
  };

  const addNewLog = () => {
    const newLog = generateLog();
    setLogs(prevLogs => [...prevLogs, newLog].slice(-100)); // Mantém apenas os últimos 100 logs
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoUpdate) {
      // Adiciona um novo log a cada 2 segundos
      interval = setInterval(addNewLog, 2000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoUpdate]);

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Heading size="md">Logs do Sistema</Heading>
        <HStack>
          <Button
            size="sm"
            colorScheme={autoUpdate ? 'red' : 'brand'}
            onClick={() => setAutoUpdate(!autoUpdate)}
          >
            {autoUpdate ? 'Parar Atualização' : 'Atualização Automática'}
          </Button>
          <Button
            size="sm"
            onClick={addNewLog}
          >
            Adicionar Log
          </Button>
        </HStack>
      </HStack>

      <LogViewer
        logs={logs}
        title="Logs do Sistema"
        maxHeight="500px"
        downloadFileName="system-logs.txt"
      />
    </Box>
  );
};

export default SystemLogs; 