'use client';
import React, { useEffect, useState } from 'react';

import { toast, ToastProps, ToastType } from './toast';

interface ToastTypeConfig {
  bgColor: string;
  Icon: React.ReactNode;
}

const TOAST_TYPES: Record<ToastType, ToastTypeConfig> = {
  success: {
    bgColor: 'bg-success-500',
    Icon: <i className="icon-check" />
  },
  error: {
    bgColor: 'bg-danger-500',
    Icon: <i className="icon-error" />
  }
};

const Toast: React.FC<{ toast: ToastProps }> = ({ toast }) => {
  const { message, type } = toast;
  const { bgColor, Icon } = TOAST_TYPES[type];

  return (
    <div
      className={`max-w-md w-full rounded-sm ${bgColor} text-white p-3 shadow-lg flex items-center gap-3.5 animate-fade-in`}
      style={{ boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.36)' }}
    >
      {Icon}
      <p className="flex-1 font-medium">{message}</p>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const [activeToast, setActiveToast] = useState<ToastProps | null>(null);

  useEffect(() => {
    const unsubscribe = toast.subscribe(setActiveToast);
    return unsubscribe;
  }, []);

  if (!activeToast) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-100000 flex flex-col items-center w-full max-w-md">
      <Toast toast={activeToast} />
    </div>
  );
};
