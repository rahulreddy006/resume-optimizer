import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('accessToken');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <Link to="/dashboard" className="text-lg font-semibold tracking-tight text-slate-900">
          Resume<span className="text-indigo-600 font-bold">Optimizer</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {token && (
            <div className="flex space-x-1">
              <Link to="/dashboard" className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${isActive('/dashboard') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}>Dashboard</Link>
              <Link to="/upload" className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${isActive('/upload') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}>New Analysis</Link>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {token ? (
            <button onClick={handleLogout} className="text-sm font-medium text-slate-600 hover:text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-all">Sign out</button>
          ) : (
            <div className="space-x-3">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2">Sign in</Link>
              <Link to="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700">Get started</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-4 shadow-lg absolute w-full">
          {token ? (
            <>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 hover:text-indigo-600">Dashboard</Link>
              <Link to="/upload" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 hover:text-indigo-600">New Analysis</Link>
              <button onClick={handleLogout} className="block w-full text-left text-sm font-medium text-red-600 hover:text-red-700 pt-2 border-t border-slate-100">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 hover:text-indigo-600">Sign in</Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-indigo-600">Get started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;