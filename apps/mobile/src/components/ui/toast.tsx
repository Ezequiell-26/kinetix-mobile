"use client"

import * as React from "react"
import { toast as sonnerToast } from "sonner"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"

type ToastType = "success" | "error" | "info" | "warning"

interface ToastOptions {
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      duration: options?.duration || 4000,
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      action: options?.action,
    })
  },
  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      duration: options?.duration || 6000,
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      action: options?.action,
    })
  },
  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      duration: options?.duration || 4000,
      icon: <Info className="h-5 w-5 text-blue-500" />,
      action: options?.action,
    })
  },
  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      duration: options?.duration || 5000,
      icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      action: options?.action,
    })
  },
  dismiss: (toastId: string | number) => {
    sonnerToast.dismiss(toastId)
  },
}

export { Toaster } from "sonner"
