import Layout from '../../components/Layout/Layout';
import Card from '../../components/Card/Card';
import Chart from '../../components/Chart/Chart';

const Analytics = () => {
  const visitasData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    values: [150, 230, 180, 290, 200, 140, 120],
  };

  const conversaoData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
    values: [15, 18, 22, 20, 25],
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Visitas Hoje">
            <div className="text-3xl font-bold text-blue-600">1,543</div>
            <p className="text-gray-500">+15% vs ontem</p>
          </Card>

          <Card title="Tempo Médio">
            <div className="text-3xl font-bold text-green-600">5m 32s</div>
            <p className="text-gray-500">-2% vs ontem</p>
          </Card>

          <Card title="Taxa de Rejeição">
            <div className="text-3xl font-bold text-red-600">32%</div>
            <p className="text-gray-500">+5% vs ontem</p>
          </Card>

          <Card title="Conversões">
            <div className="text-3xl font-bold text-purple-600">89</div>
            <p className="text-gray-500">+12% vs ontem</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart
            data={visitasData}
            type="line"
            title="Visitas por Dia da Semana"
          />

          <Chart
            data={conversaoData}
            type="bar"
            title="Taxa de Conversão Mensal (%)"
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card title="Análise Detalhada">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Páginas mais visitadas</span>
                <span className="text-gray-900 font-medium">Visitas</span>
              </div>
              {[
                { pagina: '/dashboard', visitas: 523 },
                { pagina: '/produtos', visitas: 429 },
                { pagina: '/sobre', visitas: 328 },
              ].map((item) => (
                <div key={item.pagina} className="flex justify-between items-center border-b pb-2">
                  <span className="text-blue-600">{item.pagina}</span>
                  <span className="font-medium">{item.visitas}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics; 