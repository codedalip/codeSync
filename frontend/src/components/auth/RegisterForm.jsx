import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { Code2, UserPlus, Mail, Lock, User, AlertCircle, Loader2, X } from 'lucide-react';

const RegisterForm = ({ onSwitchToLogin, onSuccess, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();
  const { theme } = useThemeStore();

  const isLight = theme === 'light';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    const res = await register(name, email, password);
    if (res && res.success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className={`w-full border rounded-2xl p-6 sm:p-8 space-y-6 relative transition-colors shadow-2xl ${
      isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#121215] border-zinc-800 text-zinc-100'
    }`}>
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg border transition-colors ${
            isLight 
              ? 'text-zinc-500 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border-zinc-200' 
              : 'text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border-zinc-800'
          }`}
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl border mb-1 ${
          isLight ? 'bg-zinc-100 text-zinc-900 border-zinc-200' : 'bg-zinc-800 text-white border-zinc-700'
        }`}>
          <Code2 className="w-6 h-6" />
        </div>
        <h1 className={`text-2xl font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>Create your account</h1>
        <p className={`text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Join CodeSync for real-time collaborative coding</p>
      </div>

      {error && (
        <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-zinc-600' : 'text-zinc-300'}`}>
            Full Name
          </label>
          <div className="relative">
            <User className={`w-4 h-4 absolute left-3 top-3 ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`} />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                clearError();
                setName(e.target.value);
              }}
              placeholder="Rahul Kumar"
              className={`w-full border text-sm pl-9 pr-3 py-2.5 rounded-lg transition-colors focus:outline-none ${
                isLight 
                  ? 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900 placeholder-zinc-400' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600 placeholder-zinc-600'
              }`}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-zinc-600' : 'text-zinc-300'}`}>
            Email Address
          </label>
          <div className="relative">
            <Mail className={`w-4 h-4 absolute left-3 top-3 ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                clearError();
                setEmail(e.target.value);
              }}
              placeholder="developer@codesync.io"
              className={`w-full border text-sm pl-9 pr-3 py-2.5 rounded-lg transition-colors focus:outline-none ${
                isLight 
                  ? 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900 placeholder-zinc-400' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600 placeholder-zinc-600'
              }`}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-zinc-600' : 'text-zinc-300'}`}>
            Password
          </label>
          <div className="relative">
            <Lock className={`w-4 h-4 absolute left-3 top-3 ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`} />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => {
                clearError();
                setPassword(e.target.value);
              }}
              placeholder="Minimum 6 characters"
              className={`w-full border text-sm pl-9 pr-3 py-2.5 rounded-lg transition-colors focus:outline-none ${
                isLight 
                  ? 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-900 placeholder-zinc-400' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600 placeholder-zinc-600'
              }`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full font-bold py-2.5 rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50 ${
            isLight 
              ? 'bg-zinc-900 hover:bg-zinc-800 text-white' 
              : 'bg-white hover:bg-zinc-200 text-zinc-900'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Register Account</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-1">
        <p className={`text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className={`font-semibold hover:underline ${isLight ? 'text-zinc-900' : 'text-white'}`}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
