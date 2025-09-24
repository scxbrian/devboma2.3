import React from 'react';
import { Users, Building, DollarSign, TrendingUp } from 'lucide-react';

export default function AdminStats() {
  const stats = [
    {
      name: 'Total Revenue',
      value: 'KES 1,247,800',
      change: '+18.2%',
      changeType: 'increase' as const,
      icon: DollarSign
    },
    {
      name: 'Active Clients',
      value: '23',
      change: '+3',
      changeType: 'increase' as const,
      icon: Users
    },
    {
      name: 'Live Shops',
      value: '8',
      change: '+2',
      changeType: 'increase' as const,
      icon: Building
    },
    {
      name: 'Monthly Growth',
      value: '24.5%',
      change: '+4.2%',
      changeType: 'increase' as const,
      icon: TrendingUp
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-blue-700" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}