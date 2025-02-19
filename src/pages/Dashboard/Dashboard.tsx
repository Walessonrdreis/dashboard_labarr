import Layout from '../../components/Layout/Layout';
import Card from '../../components/Card/Card';
import Chart from '../../components/Chart/Chart';
import Table from '../../components/Table/Table';

const Dashboard = () => {
  const mockChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
    values: [30, 45, 60, 35, 70],
  };

  const mockTableData = [
    { id: 1, nome: 'João Silva', status: 'Ativo', acesso: 'Admin' },
    { id: 2, nome: 'Maria Santos', status: 'Ativo', acesso: 'Usuário' },
    { id: 3, nome: 'Pedro Costa', status: 'Inativo', acesso: 'Usuário' },
  ];

  const columns = [
    { key: 'nome', title: 'Nome' },
    { key: 'status', title: 'Status' },
    { key: 'acesso', title: 'Nível de Acesso' },
  ];

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Total de Usuários">
          <div className="text-3xl font-bold text-blue-600">1,234</div>
          <p className="text-gray-500">+12% desde o último mês</p>
        </Card>
        
        <Card title="Acessos">
          <div className="text-3xl font-bold text-green-600">5,678</div>
          <p className="text-gray-500">+8% desde o último mês</p>
        </Card>
        
        <Card title="Taxa de Conversão">
          <div className="text-3xl font-bold text-purple-600">23%</div>
          <p className="text-gray-500">+5% desde o último mês</p>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart
          data={mockChartData}
          type="line"
          title="Análise de Desempenho"
        />
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Usuários Recentes
          </h2>
          <Table
            columns={columns}
            data={mockTableData}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 