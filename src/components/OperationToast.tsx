import { useCampStore } from '../store/campStore';
import { X, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

export function OperationToast() {
  const operationErrors = useCampStore((s) => s.operationErrors);
  const removeOperationError = useCampStore((s) => s.removeOperationError);
  const clearOperationErrors = useCampStore((s) => s.clearOperationErrors);

  useEffect(() => {
    if (operationErrors.length === 0) return;
    const timer = setTimeout(() => {
      clearOperationErrors();
    }, 3000);
    return () => clearTimeout(timer);
  }, [operationErrors, clearOperationErrors]);

  if (operationErrors.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={18} className="text-amber-500" />;
      case 'info':
        return <Info size={18} className="text-blue-500" />;
      default:
        return <AlertCircle size={18} className="text-red-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-red-50 border-red-200';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 w-80">
      {operationErrors.map((error) => (
        <div
          key={error.id}
          className={`
            relative p-3 rounded-xl border shadow-lg animate-slide-in-right
            ${getBgColor(error.type)}
          `}
        >
          <button
            onClick={() => removeOperationError(error.id)}
            className="absolute top-2 right-2 p-0.5 hover:bg-black/5 rounded transition-colors cursor-pointer"
          >
            <X size={12} className="text-gray-500" />
          </button>
          <div className="flex items-start gap-2 pr-4">
            {getIcon(error.type)}
            <p className="text-sm text-gray-700">{error.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
