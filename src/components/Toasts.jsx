import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

const ToastViewport = ({ toasts, onDismiss }) => (
  <div aria-live="polite" className="toast-viewport">
    {toasts.map((toast) => (
      <button
        key={toast.id}
        type="button"
        className={`toast toast-${toast.type}`}
        onClick={() => onDismiss(toast.id)}
      >
        {toast.message}
      </button>
    ))}
  </div>
);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissToast = (id) =>
    setToasts((prev) => prev.filter((toast) => toast.id !== id));

  const showToast = (message, type = "success") => {
    setToasts((prev) => [...prev, { id: uuidv4(), message, type }]);
  };

  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => dismissToast(toast.id), 3000)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};