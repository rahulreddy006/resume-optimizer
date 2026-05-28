import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      const loginRes = await api.post('/auth/login', { email: formData.email, password: formData.password });
      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('user', JSON.stringify(loginRes.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Account details may be invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50/50 px-4">
      <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600"></div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h2>
          <p className="text-sm text-slate-500 mt-1">Get instant evaluation metrics for your candidates.</p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg mb-6 font-medium">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none mt-2 shadow-sm"
          >
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Already have an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;