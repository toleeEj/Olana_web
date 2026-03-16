// src/admin/pages/AdminLogin.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import adminApi from '../services/adminApi';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await adminApi.post('/token/', { username, password });
      localStorage.setItem('accessToken', res.data.access);
      localStorage.setItem('refreshToken', res.data.refresh);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) setError('Invalid username or password');
      else if (status === 400) setError('Please complete all fields correctly');
      else setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/70 backdrop-blur-sm border border-emerald-900/40 rounded-2xl shadow-2xl shadow-black/40 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-400 tracking-tight">
              Dr. Olana Admin
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Secure access to management panel
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-950/60 border border-red-800/50 text-red-300 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-800/60 border border-gray-700 rounded-xl 
                         text-white placeholder-gray-500 
                         focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 
                         outline-none transition-all duration-200"
                required
                autoFocus
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-800/60 border border-gray-700 rounded-xl 
                         text-white placeholder-gray-500 
                         focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 
                         outline-none transition-all duration-200"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-400">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 
                           text-emerald-600 focus:ring-emerald-600/30"
                />
                <span className="ml-2">Remember me</span>
              </label>

              <a
                href="#"
                className="text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3.5 px-4 font-medium rounded-xl text-white
                bg-gradient-to-r from-emerald-700 to-emerald-600
                hover:from-emerald-600 hover:to-emerald-500
                active:from-emerald-800 active:to-emerald-700
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 shadow-md shadow-emerald-900/30
                flex items-center justify-center gap-2
              `}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have access?{' '}
            <Link
              to="/admin/register"
              className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
            >
              Request admin account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}