// src/components/ui/toast-provider.tsx
import { createContext, useCallback, useContext } from "react";
import type { ReactNode } from "react";
import type { Toast } from "./use-toast";

interface ToastContextType {
  toast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  // Minimal: just log to console, or plug in your own UI
  const toast = useCallback((toastData: Omit<Toast, "id">) => {
    // You can implement your own toast logic here
    console.log("Toast: ", toastData);
    // TODO: Integrate with a real toast UI
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
    </ToastContext.Provider>
  );
};

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
