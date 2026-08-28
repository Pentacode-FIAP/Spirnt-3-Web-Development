import { useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function Toast({ message, tipo = 'erro', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${tipo === 'sucesso' ? 'toast-sucesso' : ''}`}>
      {tipo === 'sucesso' ? (
        <CheckCircle2 size={16} strokeWidth={2} />
      ) : (
        <AlertCircle size={16} strokeWidth={2} />
      )}
      <span>{message}</span>
    </div>
  );
}
