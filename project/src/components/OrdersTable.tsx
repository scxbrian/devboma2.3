import React from 'react';
import { useState, useEffect } from 'react';
import { Eye, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

interface OrdersTableProps {
  limit?: number;
}

export default function OrdersTable({ limit }: OrdersTableProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.clientId) {
      fetchOrders();
    }
  }, [user, limit]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = limit ? { limit: limit.toString() } : {};
      const data = await ordersAPI.getOrders(user!.clientId!, params);
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      // Use demo data on error
      setOrders([
        {
          id: 'ORD-001',
          customer_name: 'Jane Doe',
          created_at: '2025-01-15',
          total_amount: 2500,
          status: 'completed',
          order_items: [{ quantity: 2 }]
        },
        {
          id: 'ORD-002',
          customer_name: 'John Smith',
          created_at: '2025-01-15',
          total_amount: 4800,
          status: 'processing',
          order_items: [{ quantity: 1 }]
        }
      ].slice(0, limit));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const demoOrders = [
    {
      id: 'ORD-001',
      customer: 'Jane Doe',
      date: '2025-01-15',
      total: 2500,
      status: 'completed',
      items: 2
    },
    {
      id: 'ORD-002',
      customer: 'John Smith',
      date: '2025-01-15',
      total: 4800,
      status: 'processing',
      items: 1
    },
    {
      id: 'ORD-003',
      customer: 'Mary Johnson',
      date: '2025-01-14',
      total: 1200,
      status: 'shipped',
      items: 3
    },
    {
      id: 'ORD-004',
      customer: 'Peter Wilson',
      date: '2025-01-14',
      total: 3600,
      status: 'completed',
      items: 2
    },
    {
      id: 'ORD-005',
      customer: 'Sarah Brown',
      date: '2025-01-13',
      total: 1800,
      status: 'pending',
      items: 1
    }
  ];

  const displayOrders = orders.length > 0 ? orders.map(order => ({
    id: order.order_number || order.id,
    customer: order.customer_name || 'Unknown Customer',
    date: new Date(order.created_at).toLocaleDateString(),
    total: order.total_amount,
    status: order.status,
    items: order.order_items?.length || 1
  })) : demoOrders;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-900">Order</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayOrders.map((order) => (
            <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-500">{order.items} items</p>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-900">{order.customer}</td>
              <td className="py-3 px-4 text-gray-600">{order.date}</td>
              <td className="py-3 px-4 font-medium text-gray-900">
                KES {order.total.toLocaleString()}
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <button className="text-blue-700 hover:text-blue-900 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}