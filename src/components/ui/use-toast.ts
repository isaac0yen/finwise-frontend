// src/components/ui/use-toast.ts

export type Toast = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

import { useToastContext } from "./toast-provider";

export function useToast() {
  return useToastContext();
}
