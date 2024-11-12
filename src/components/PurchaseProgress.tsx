import { cn } from '../lib/utils';
import { ShoppingCart, CreditCard, CheckCircle } from 'lucide-react';

interface PurchaseProgressProps {
  currentStep: 'cart' | 'checkout' | 'confirmation';
}

const steps = [
  { id: 'cart', label: 'Carrito', icon: ShoppingCart },
  { id: 'checkout', label: 'Pago', icon: CreditCard },
  { id: 'confirmation', label: 'Confirmación', icon: CheckCircle },
];

export function PurchaseProgress({ currentStep }: PurchaseProgressProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="relative">
        {/* Progress bar */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-zinc-700 -translate-y-1/2" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-purple-500 -translate-y-1/2 transition-all duration-500"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isActive = index <= currentStepIndex;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={cn(
                  "flex flex-col items-center",
                  isActive ? "text-purple-500" : "text-gray-400 dark:text-gray-600"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500",
                    isActive
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200 dark:bg-zinc-700"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="mt-2 text-sm font-medium">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}