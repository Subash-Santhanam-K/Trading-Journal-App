import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-trading-dark">
      {/* Sidebar minimal */}
      <aside className="w-64 bg-trading-card border-r border-trading-border flex flex-col">
        <div className="p-6 flex items-center space-x-3">
          <TrendingUp className="text-trading-primary w-8 h-8" />
          <span className="text-white font-bold text-xl tracking-tight">PrimeTrade</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link 
            to="/dashboard" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === '/dashboard' 
                ? 'bg-trading-primary/10 text-trading-primary' 
                : 'text-trading-textMuted hover:bg-trading-border hover:text-trading-text'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-trading-border">
          <button 
            onClick={logout}
            className="flex items-center space-x-3 text-trading-textMuted hover:text-trading-red transition-colors w-full px-4 py-3 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-trading-card border-b border-trading-border flex items-center justify-end px-8 shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-trading-primary/20 flex items-center justify-center text-trading-primary font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-trading-text text-sm font-medium">{user?.email}</span>
          </div>
        </header>

        {/* Dynamic Canvas */}
        <div className="flex-1 overflow-auto p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
