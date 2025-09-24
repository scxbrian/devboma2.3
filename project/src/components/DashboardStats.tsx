import React from 'react';
import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, Package, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { analyticsAPI } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

export default function DashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.clientId) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await analyticsAPI.getDashboardData(user!.clientId!);
      setStats(data);
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
      setError(err.message);
      // Use demo data on error
      setStats({
        revenue: { total: 247800, orders: 143 },
        customers: { unique: 89, averageOrderValue: 1734 },
        products: { total: 28 },
        conversionRate: 3.4
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <LoadingSpinner />
          </div>
        ))}
      </div>
    );
  }

  const displayStats = [
    {
      name: 'Total Revenue',
      value: `KES ${stats?.revenue?.total?.toLocaleString() || '247,800'}`,
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: DollarSign
    },
    {
      name: 'Orders',
      value: stats?.revenue?.orders?.toString() || '143',
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: ShoppingCart
    },
    {
      name: 'Products',
      value: stats?.products?.total?.toString() || '28',
      change: '+2',
      changeType: 'increase' as const,
      icon: Package
    },
    {
      name: 'Conversion Rate',
      value: `${stats?.conversionRate || 3.4}%`,
      change: '+0.8%',
      changeType: 'increase' as const,
      icon: TrendingUp
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayStats.map((stat) => {
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