import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarCollapsed: false,
    mobileMenuOpen: false,
    toasts: [],
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    addToast: (state, action) => {
      const toast = {
        id: `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        ...action.payload,
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { toggleSidebar, setMobileMenuOpen, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
