import { useLocation, Navigate, Link } from 'react-router-dom';
import { PurchaseProgress } from '../components/PurchaseProgress';
import { useEffect } from 'react';
import { useNotification } from '../hooks/useNotification';
import { Notification } from '../components/Notification';
import { Home, CheckCircle2, MapPin, Phone, Mail } from 'lucide-react';

interface OrderDetails {
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  customerInfo: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
  };
  date: string;
}

interface LocationState {
  orderId: string;
  orderDetails: OrderDetails;
  isGuest: boolean;
}

export function OrderConfirmation() {
  const location = useLocation();
  const state = location.state as LocationState;
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    if (state?.orderDetails) {
      showNotification('success', '¡Tu pedido ha sido confirmado! Te hemos enviado un correo con los detalles.');
    }
  }, [state?.orderDetails, showNotification]);

  if (!state?.orderDetails) {
    return <Navigate to="/" replace />;
  }

  const { customerInfo, items, total } = state.orderDetails;

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <PurchaseProgress currentStep="confirmation" />
        
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="mx-auto h-16 w-16 text-green-500 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                ¡Pedido Confirmado!
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Tu pedido #{state.orderId.slice(0, 8)} ha sido registrado exitosamente
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                  Detalles de Entrega
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-900 dark:text-white">{customerInfo.direccion}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-900 dark:text-white">{customerInfo.telefono}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-900 dark:text-white">{customerInfo.email}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                  Resumen del Pedido
                </h3>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-200 dark:border-zinc-700">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-900 dark:text-white">Total</span>
                      <span className="text-purple-500">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {state.isGuest && (
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Te hemos enviado un correo a {customerInfo.email} con los detalles de tu pedido.
                    Considera crear una cuenta para hacer seguimiento a tus pedidos.
                  </p>
                </div>
              )}

              <div className="flex justify-center pt-4">
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 rounded-full text-white bg-purple-500 hover:bg-purple-600 transition-colors"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
        
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