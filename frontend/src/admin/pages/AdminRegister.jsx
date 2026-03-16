// src/admin/pages/AdminRegister.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import adminApi from '../services/adminApi';

export default function AdminRegister() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminApi.post('/register/', form);
      alert('Account created successfully! Please sign in.');
      navigate('/admin/login', { replace: true });
    } catch (err) {
      if (err.response?.data) {
        const firstError = Object.values(err.response.data)[0];
        setError(
          Array.isArray(firstError) ? firstError[0] : 'Registration failed. Please check your details.'
        );
      } else {
        setError('Network error. Please try again later.');
      }
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
              Create Admin Account
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Set up secure access to the management panel
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-950/60 border border-red-800/50 text-red-300 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-gray-800/60 border border-gray-700 rounded-xl 
                       text-white placeholder-gray-500 
                       focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 
                       outline-none transition-all duration-200"
              required
              autoFocus
            />

            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-gray-800/60 border border-gray-700 rounded-xl 
                       text-white placeholder-gray-500 
                       focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 
                       outline-none transition-all duration-200"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-gray-800/60 border border-gray-700 rounded-xl 
                       text-white placeholder-gray-500 
                       focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 
                       outline-none transition-all duration-200"
              required
            />

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
                flex items-center justify-center gap-2 mt-2
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have access?{' '}
            <Link
              to="/admin/login"
              className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}