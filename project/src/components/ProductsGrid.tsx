import React from 'react';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { productsAPI } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

export default function ProductsGrid() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.clientId) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getProducts(user!.clientId!);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Use demo data on error
      setProducts([
        {
          id: 1,
          name: 'Premium T-Shirt',
          price: 1500,
          inventory_quantity: 25,
          images: ['https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=300']
        },
        {
          id: 2,
          name: 'Designer Mug',
          price: 1200,
          inventory_quantity: 15,
          images: ['https://images.pexels.com/photos/2005492/pexels-photo-2005492.jpeg?auto=compress&cs=tinysrgb&w=300']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const demoProducts = [
    {
      id: 1,
      name: 'Premium T-Shirt',
      price: 1500,
      stock: 25,
      sales: 45,
      image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 2,
      name: 'Designer Mug',
      price: 1200,
      stock: 15,
      sales: 32,
      image: 'https://images.pexels.com/photos/2005492/pexels-photo-2005492.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 3,
      name: 'Canvas Bag',
      price: 1800,
      stock: 8,
      sales: 28,
      image: 'https://images.pexels.com/photos/1232459/pexels-photo-1232459.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 4,
      name: 'Leather Wallet',
      price: 2500,
      stock: 12,
      sales: 18,
      image: 'https://images.pexels.com/photos/5816299/pexels-photo-5816299.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  const displayProducts = products.length > 0 ? products.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    stock: product.inventory_quantity,
    sales: Math.floor(Math.random() * 50), // Demo sales data
    image: product.images?.[0] || 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=300'
  })) : demoProducts;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Products</h2>
        <button className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-200 relative overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-lg font-bold text-blue-700 mb-2">
                KES {product.price.toLocaleString()}
              </p>
              
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>Stock: {product.stock}</span>
                <span>Sales: {product.sales}</span>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </button>
                <button className="flex-1 bg-gray-50 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-1">
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button className="bg-red-50 text-red-700 py-2 px-3 rounded text-sm font-medium hover:bg-red-100 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}