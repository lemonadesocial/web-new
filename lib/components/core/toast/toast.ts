export type ToastType = 'success' | 'error';

export interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  dismiss: () => void;
}

let activeToast: ToastProps | null = null;
let listeners: ((toast: ToastProps | null) => void)[] = [];
let activeTimeout: NodeJS.Timeout | null = null;

const notifyListeners = () => {
  listeners.forEach(listener => listener(activeToast));
};

const createToast = (message: string, type: ToastType, duration = 5000) => {
  if (activeTimeout) {
    clearTimeout(activeTimeout);
    activeTimeout = null;
  }

  activeToast = { message, type, duration, dismiss: toast.dismiss };
  notifyListeners();

  if (duration !== Infinity) {
    activeTimeout = setTimeout(() => toast.dismiss(), duration);
  }
};

export const toast = {
  success: (message: string, duration = 5000) => {
    createToast(message, 'success', duration);
  },

  error: (message: string, duration = 5000) => {
    createToast(message, 'error', duration);
  },

  dismiss: () => {
    if (activeTimeout) {
      clearTimeout(activeTimeout);
      activeTimeout = null;
    }
    activeToast = null;
    notifyListeners();
  },

  subscribe: (listener: (toast: ToastProps | null) => void) => {
    listeners.push(listener);
    listener(activeToast);

    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }
};
