"use client";

import { Check } from "lucide-react";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

type Toast = { id: number; text: string };
const ToastContext = createContext<(text: string) => void>(() => {});

/** Small message at the bottom of the screen, e.g. "Reminders sent to 3 members". */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(1);
  const show = useCallback((text: string) => {
    const id = next.current++;
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6">
        {toasts.map((t) => (
          <div key={t.id} className="flex max-w-md items-center gap-2.5 rounded-xl bg-ink px-4 py-3 text-[15px] text-white shadow-lg">
            <Check aria-hidden className="size-4 shrink-0 text-accent" strokeWidth={2.4} />
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
