import React from 'react';
import { Eye, Edit, Building } from 'lucide-react';

export default function ClientsTable() {
  const clients = [
    {
      id: 1,
      name: 'Artisan Crafts',
      email: 'contact@artisancrafts.co.ke',
      tier: 'Boma Shop',
      status: 'Active',
      joinDate: '2025-01-10',
      revenue: 156000
    },
    {
      id: 2,
      name: 'Tech Startup Kenya',
      email: 'info@techstartke.com',
      tier: 'Boma Titan',
      status: 'Active',
      joinDate: '2024-12-15',
      revenue: 499000
    },
    {
      id: 3,
      name: 'Wellness Hub',
      email: 'hello@wellnesshub.co.ke',
      tier: 'Boma Prime',
      status: 'Active',
      joinDate: '2024-12-20',
      revenue: 299000
    },
    {
      id: 4,
      name: 'Local Restaurant',
      email: 'orders@localrest.co.ke',
      tier: 'Boma Core',
      status: 'Development',
      joinDate: '2025-01-12',
      revenue: 145000
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Boma Shop':
        return 'bg-yellow-100 text-yellow-800';
      case 'Boma Titan':
        return 'bg-purple-100 text-purple-800';
      case 'Boma Prime':
        return 'bg-blue-100 text-blue-800';
      case 'Boma Core':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Development':
        return 'bg-blue-100 text-blue-800';
      case 'Suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-900">Client</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Tier</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Join Date</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-gray-900">{client.name}</p>
                  <p className="text-sm text-gray-500">{client.email}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(client.tier)}`}>
                  {client.tier}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                  {client.status}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-600">{client.joinDate}</td>
              <td className="py-3 px-4 font-medium text-green-600">
                KES {client.revenue.toLocaleString()}
              </td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  <button className="text-blue-700 hover:text-blue-900 transition-colors" title="View Details">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-700 hover:text-gray-900 transition-colors" title="Edit Client">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-green-700 hover:text-green-900 transition-colors" title="View Shop">
                    <Building className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}