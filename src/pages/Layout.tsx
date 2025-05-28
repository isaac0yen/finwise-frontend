import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';

interface SidebarLink {
  name: string;
  path: string;
  icon: string;
}

// Create a context for user tag copying functionality
export const UserContext = createContext({
  copyUserTag: (_tag: string) => {},
  copySuccess: false
});

// Hook to use the user tag context
export const useUserTag = () => useContext(UserContext);

export default function Layout() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Function to copy user tag to clipboard
  const copyUserTag = (tag: string) => {
    navigator.clipboard.writeText(tag)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

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
    <UserContext.Provider value={{ copyUserTag, copySuccess }}>
      <div className="flex h-screen bg-gray-100">
        {/* Copy success notification */}
        {copySuccess && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
            User tag copied to clipboard!
          </div>
        )}
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
    </UserContext.Provider>
  );
}
