import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface SidebarLink {
  name: string;
  path: string;
  icon: string;
}

export default function Layout() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const links: SidebarLink[] = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Deposit', path: '/deposit', icon: '💰' },
    { name: 'Withdraw', path: '/withdraw', icon: '💸' },
    { name: 'Transfer', path: '/transfer', icon: '↗️' },
    { name: 'Transactions', path: '/transactions', icon: '📝' },
    { name: 'Token Marketplace', path: '/tokens/marketplace', icon: '🏛️' },
    { name: 'Token Portfolio', path: '/tokens/portfolio', icon: '📈' },
    { name: 'Token Transactions', path: '/tokens/transactions', icon: '🔄' },
  ];

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-purple-600">FinWise</h1>
        </div>
        <nav className="mt-6">
          <ul>
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-purple-600 ${
                    location.pathname === link.path ? 'bg-purple-50 text-purple-600 border-r-4 border-purple-600' : ''
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="flex items-center text-gray-600 hover:text-purple-600"
          >
            <span className="mr-3">🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
