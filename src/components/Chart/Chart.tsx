interface ChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  type: 'bar' | 'line';
  title: string;
}

const Chart = ({ data, type, title }: ChartProps) => {
  // Aqui você pode integrar uma biblioteca de gráficos como Chart.js ou Recharts
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500">
          Componente de gráfico - Implementar integração com biblioteca de gráficos
        </p>
      </div>
    </div>
  );
};

export default Chart; 