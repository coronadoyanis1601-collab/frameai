import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { Eye, LayoutDashboard, Users, ShoppingBag, LogOut, LogIn } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-beige-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-dark-900 rounded-xl flex items-center justify-center">
                <Eye className="w-4 h-4 text-gold-400" />
              </div>
              <span className="font-serif text-xl font-semibold text-dark-900">Frame<span className="text-gold-500">AI</span></span>
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-1">
              {user ? (
                <>
                  <Link to="/dashboard" className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'bg-dark-900 text-white' : 'text-dark-600 hover:bg-beige-100'}`}>
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden sm:block">Dashboard</span>
                  </Link>
                  <Link to="/clients" className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${location.pathname === '/clients' ? 'bg-dark-900 text-white' : 'text-dark-600 hover:bg-beige-100'}`}>
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:block">Clients</span>
                  </Link>
                  <Link to="/boutique" className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${location.pathname === '/boutique' ? 'bg-dark-900 text-white' : 'text-dark-600 hover:bg-beige-100'}`}>
                    <ShoppingBag className="w-4 h-4" />
                    <span className="hidden sm:block">Boutique</span>
                  </Link>
                  <Link to="/upload" className="btn-gold ml-2 !py-2 !px-4">
                    Nouvelle analyse
                  </Link>
                  <button onClick={logout} className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm text-dark-600 hover:bg-beige-100 ml-1">
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors text-dark-600 hover:bg-beige-100`}>
                    <LogIn className="w-4 h-4" />
                    Connexion
                  </Link>
                  <Link to="/upload" className="btn-primary ml-2 !py-2 !px-4">
                    Lancer une analyse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
