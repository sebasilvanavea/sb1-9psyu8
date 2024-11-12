import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/auth-store';

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email || !db) {
        setOrders([]);
        return;
      }

      try {
        const q = query(
          collection(db, 'orders'),
          where('userEmail', '==', user.email)
        );

        const querySnapshot = await getDocs(q);
        const orderData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];

        setOrders(orderData);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('No se pudieron cargar los pedidos. Por favor, intenta más tarde.');
      }
    };

    fetchOrders();
  }, [user]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">No tienes pedidos anteriores</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pedido #{order.id.slice(0, 8)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(order.date).toLocaleDateString()}
              </p>
            </div>
            <span className="px-3 py-1 text-sm rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              {order.status}
            </span>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-zinc-700">
            {order.items.map((item, index) => (
              <div key={index} className="py-3 flex justify-between">
                <div>
                  <p className="text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <p className="text-purple-600">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
            <div className="flex justify-between">
              <span className="font-medium text-gray-900 dark:text-white">Total</span>
              <span className="font-bold text-purple-600">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}