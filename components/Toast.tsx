
import React, { useEffect, useState } from 'react';
import { CheckIcon } from './icons/ActionIcons';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        // Allow time for fade-out animation before calling onClose
        setTimeout(onClose, 300);
      }, 2700); // Message visible for 2.7s

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      aria-live="assertive"
    >
      <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-full backdrop-blur-xl px-4 py-2 text-white text-sm shadow-lg">
        <CheckIcon />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
