import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock } from 'lucide-react';

interface LoginProps {
  showToast: (message: string, type: 'success' | 'error') => void;
}

const Login: React.FC<LoginProps> = ({ showToast }) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (adminId === '1234' && password === '1234') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('adminId', adminId);
        showToast('Login successfully ✅', 'success');

        // 👉 stop loading BEFORE navigating
        setLoading(false);
        navigate('/admin-dashboard');
      } else {
        showToast('Invalid credentials ❌', 'error');
        setLoading(false); // 👉 make sure to reset here too
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-yellow-200">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Portal</h1>
            <p className="text-gray-600">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="adminId" className="block text-sm font-medium text-gray-700 mb-2">
                Admin ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="adminId"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="Enter admin ID"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Demo Credentials:</p>
            <p>ID:1234 | Password:1234</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
