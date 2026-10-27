import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface DemoModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function DemoModal({ open, title, onClose, children }: DemoModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(open);
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="panel relative w-full max-w-2xl p-5 md:p-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white p-2 text-slate-600"
          aria-label="Cerrar modal"
        >
          <X size={18} />
        </button>
        <h2 className="pr-8 text-2xl font-extrabold text-slate-900">{title}</h2>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
