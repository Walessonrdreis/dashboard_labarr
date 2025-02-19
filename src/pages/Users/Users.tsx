import { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Table from '../../components/Table/Table';
import Card from '../../components/Card/Card';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockUsers = [
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      cargo: 'Administrador',
      status: 'Ativo',
      ultimoAcesso: '2024-02-19',
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria@exemplo.com',
      cargo: 'Usuário',
      status: 'Ativo',
      ultimoAcesso: '2024-02-18',
    },
    {
      id: 3,
      nome: 'Pedro Costa',
      email: 'pedro@exemplo.com',
      cargo: 'Usuário',
      status: 'Inativo',
      ultimoAcesso: '2024-02-15',
    },
  ];

  const columns = [
    { key: 'nome', title: 'Nome' },
    { key: 'email', title: 'E-mail' },
    { key: 'cargo', title: 'Cargo' },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === 'Ativo'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: 'ultimoAcesso', title: 'Último Acesso' },
    {
      key: 'acoes',
      title: 'Ações',
      render: () => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800">Editar</button>
          <button className="text-red-600 hover:text-red-800">Remover</button>
        </div>
      ),
    },
  ];

  const filteredUsers = mockUsers.filter((user) =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Usuários</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Adicionar Usuário
          </button>
        </div>

        <Card title="Gerenciar Usuários">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar usuários..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Table
            columns={columns}
            data={filteredUsers}
          />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Total de Usuários">
            <div className="text-3xl font-bold text-blue-600">{mockUsers.length}</div>
          </Card>
          
          <Card title="Usuários Ativos">
            <div className="text-3xl font-bold text-green-600">
              {mockUsers.filter((user) => user.status === 'Ativo').length}
            </div>
          </Card>
          
          <Card title="Usuários Inativos">
            <div className="text-3xl font-bold text-red-600">
              {mockUsers.filter((user) => user.status === 'Inativo').length}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Users; 