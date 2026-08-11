import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layers, Sparkles, CheckCircle } from 'lucide-react';
import { ToastContainer } from '../ui/Toast';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../../store/slices/uiSlice';

export function AuthLayout() {
  const toasts = useSelector((state) => state.ui.toasts);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-2xl text-slate-900 tracking-tight">SkillForage</span>
        </Link>
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-700">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>AI-Powered Adaptive Learning Engine</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-card border border-slate-200/90 rounded-2xl">
          <Outlet />
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SkillForage. Academic AI Learning System.</p>
        </div>
      </div>

      <ToastContainer toasts={toasts} onClose={(id) => dispatch(removeToast(id))} />
    </div>
  );
}
