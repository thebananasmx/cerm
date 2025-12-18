
import { ToastType } from '../types';

export const toastService = {
  notify: (message: string, type: ToastType = 'info') => {
    const event = new CustomEvent('app-toast', {
      detail: { message, type, id: Math.random().toString(36).substr(2, 9) }
    });
    window.dispatchEvent(event);
  },
  error: (message: string) => toastService.notify(message, 'error'),
  success: (message: string) => toastService.notify(message, 'success'),
  info: (message: string) => toastService.notify(message, 'info'),
};
