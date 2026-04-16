import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { TrendingUp, KeyRound, Mail } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', formData);
      toast.success(data.message || 'Login successful');
      login(data.data.user, data.data.accessToken);
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md trading-card p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-trading-primary/10 rounded-bl-full blur-2xl"></div>
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-12 h-12 bg-trading-dark border border-trading-border rounded-xl flex items-center justify-center mb-4 shadow-inner">
            <TrendingUp className="text-trading-primary w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-trading-textMuted text-sm text-center">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 w-5 h-5 text-trading-textMuted" />
            <input 
              type="email" required placeholder="Email Address"
              className="input-standard pl-11"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-3 w-5 h-5 text-trading-textMuted" />
            <input 
              type="password" required placeholder="Password"
              className="input-standard pl-11"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-6">
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-trading-textMuted">
          Don't have an account? <Link to="/register" className="text-trading-primary hover:text-trading-primaryHover transition-colors font-medium">Create one</Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
