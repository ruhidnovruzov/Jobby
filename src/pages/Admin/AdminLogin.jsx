import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { post } from '../../api/service';
import { LogIn, AlertCircle, Loader } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // API-yə login sorğusu göndəririk
      const response = await post('/auth/login', {
        email: email.trim(),
        password,
      });

      const { token, user } = response.data;

      if (!token) {
        setError('Token alınamadı. Xahiş edirik yenidən cəhd edin.');
        return;
      }

      // AuthContext-ə login məlumatlarını yazırıq
      login(token, user?.role || 'admin', user?.name || user?.email || 'Admin');

      // /admin-dashboard-a yönləndiririk
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('Login xətası:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Email və ya parol yanlışdır'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-600 mt-2">İdarəçi kimi daxil olun</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800 font-medium">Xəta</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Adresi
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Parol
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Yüklənir...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Daxil Ol</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Bu səhifə yalnız idarəçilər üçün nəzərdə tutulmuşdur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
