"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, X, Info } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

// Simple global toast store
let toastListeners: Array<(toasts: ToastMessage[]) => void> = [];
let toasts: ToastMessage[] = [];

function notify(listeners: typeof toastListeners) {
  listeners.forEach((fn) => fn([...toasts]));
}

export const toast = {
  success: (title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    toasts = [...toasts, { id, type: "success", title, message }];
    notify(toastListeners);
    setTimeout(() => toast.dismiss(id), 4000);
  },
  error: (title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    toasts = [...toasts, { id, type: "error", title, message }];
    notify(toastListeners);
    setTimeout(() => toast.dismiss(id), 5000);
  },
  warning: (title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    toasts = [...toasts, { id, type: "warning", title, message }];
    notify(toastListeners);
    setTimeout(() => toast.dismiss(id), 4000);
  },
  info: (title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    toasts = [...toasts, { id, type: "info", title, message }];
    notify(toastListeners);
    setTimeout(() => toast.dismiss(id), 3500);
  },
  dismiss: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    notify(toastListeners);
  },
};

const ICONS: Record<ToastType, React.ComponentType<any>> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const STYLES: Record<ToastType, string> = {
  success: "border-emerald-200 bg-white text-emerald-600",
  error:   "border-rose-200 bg-white text-rose-600",
  warning: "border-amber-200 bg-white text-amber-600",
  info:    "border-blue-200 bg-white text-blue-600",
};

const TITLE_STYLES: Record<ToastType, string> = {
  success: "text-gray-900",
  error:   "text-gray-900",
  warning: "text-gray-900",
  info:    "text-gray-900",
};

export default function ToastContainer() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const fn = (t: ToastMessage[]) => setMessages(t);
    toastListeners.push(fn);
    return () => { toastListeners = toastListeners.filter((l) => l !== fn); };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 min-w-[300px] max-w-[380px]">
      <AnimatePresence>
        {messages.map((msg) => {
          const Icon = ICONS[msg.type];
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`flex items-start gap-3 p-4 rounded-2xl border shadow-popup ${STYLES[msg.type]}`}
            >
              <Icon className="w-4.5 h-4.5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${TITLE_STYLES[msg.type]}`}>{msg.title}</p>
                {msg.message && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{msg.message}</p>}
              </div>
              <button
                onClick={() => toast.dismiss(msg.id)}
                className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
