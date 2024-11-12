import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cart-store';
import { useAuthStore } from '../store/auth-store';
import { createOrder } from '../lib/firebase';
import { comunasRM } from '../data/comunas';
import { PurchaseProgress } from '../components/PurchaseProgress';
import { Notification } from '../components/Notification';
import { useNotification } from '../hooks/useNotification';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface CustomerInfo {
  nombre: string;
  rut: string;
  email: string;
  telefono: string;
  direccion: string;
  comuna: string;
}

export function Checkout() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const cartTotal = getTotal();
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const { notification, showNotification, hideNotification } = useNotification();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    nombre: '',
    rut: '',
    email: user?.email || '',
    telefono: '',
    direccion: '',
    comuna: '',
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields: (keyof CustomerInfo)[] = ['nombre', 'rut', 'email', 'telefono', 'direccion', 'comuna'];
    for (const field of requiredFields) {
      if (!customerInfo[field]) {
        showNotification('error', `Por favor, complete el campo ${field}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: cartTotal,
        userEmail: customerInfo.email,
        customerInfo,
        date: new Date().toISOString(),
      };

      const orderId = await createOrder(orderData);
      clearCart();
      navigate('/order-confirmation', {
        state: {
          orderId,
          orderDetails: orderData,
          isGuest: !isAuthenticated,
        },
      });
    } catch (error) {
      console.error('Error al procesar la orden:', error);
      showNotification('error', 'Error al procesar la orden. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number | undefined): string => {
    if (typeof price !== 'number') return 'CLP 0';
    return price.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <PurchaseProgress currentStep="checkout" />

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white dark:bg-zinc-900 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Información de Envío
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={customerInfo.nombre}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="rut" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  RUT
                </label>
                <input
                  type="text"
                  id="rut"
                  name="rut"
                  value={customerInfo.rut}
                  onChange={handleInputChange}
                  placeholder="12.345.678-9"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={customerInfo.telefono}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dirección
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={customerInfo.direccion}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="comuna" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Comuna
                </label>
                <select
                  id="comuna"
                  name="comuna"
                  value={customerInfo.comuna}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-zinc-800 dark:text-white"
                >
                  <option value="">Selecciona una comuna</option>
                  {comunasRM.map((comuna) => (
                    <option key={comuna} value={comuna}>
                      {comuna}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Resumen del Pedido
            </h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">{item.name}</p>
                      <p className="text-gray-500 dark:text-gray-400">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-purple-500 font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-200 dark:border-zinc-700">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    Total a pagar
                  </span>
                  <span className="text-2xl font-bold text-purple-500">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="px-6 py-3 rounded-full text-purple-500 bg-white dark:bg-zinc-900 border-2 border-purple-500 hover:bg-purple-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Volver al Carrito
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-full text-white bg-purple-500 hover:bg-purple-600 transition-colors"
            >
              Confirmar Pedido
            </button>
          </div>
        </form>

        <Notification
          type={notification.type}
          message={notification.message}
          show={notification.show}
          onClose={hideNotification}
        />
      </div>
    </div>
  );
}