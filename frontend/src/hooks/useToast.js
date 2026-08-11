import { useDispatch } from 'react-redux';
import { addToast, removeToast } from '../store/slices/uiSlice';

export function useToast() {
  const dispatch = useDispatch();

  const toast = ({ title, message, type = 'info', duration = 4000 }) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    dispatch(addToast({ id, title, message, type }));

    if (duration > 0) {
      setTimeout(() => {
        dispatch(removeToast(id));
      }, duration);
    }
  };

  return {
    toast,
    success: (title, message) => toast({ title, message, type: 'success' }),
    error: (title, message) => toast({ title, message, type: 'error' }),
    warning: (title, message) => toast({ title, message, type: 'warning' }),
    info: (title, message) => toast({ title, message, type: 'info' }),
    dismiss: (id) => dispatch(removeToast(id)),
  };
}
