import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-6">
      <div className="max-w-md w-full space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">Please enter your details to sign in.</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm font-semibold bg-red-50 p-3 text-center">{error}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-widest uppercase mb-2">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-200 focus:border-black outline-none transition-colors text-sm"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-widest uppercase mb-2">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-200 focus:border-black outline-none transition-colors text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2D3748] hover:bg-black text-white py-4 text-xs font-bold tracking-[0.2em] transition-colors uppercase mt-8"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-xs font-medium text-gray-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-black font-bold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
