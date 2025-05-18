import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Wallet, 
  ArrowUpDown, 
  ArrowDownUp, 
  CreditCard, 
  LogOut, 
  Settings,
  BarChart4
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, path, active }) => (
  <Link 
    to={path} 
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-primary/10 text-primary' 
        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
    }`}
  >
    <div className="flex-shrink-0">{icon}</div>
    <span className="font-medium">{label}</span>
  </Link>
);

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Wallet size={20} />, label: 'Wallet', path: '/wallet' },
    { icon: <ArrowUpDown size={20} />, label: 'Transactions', path: '/transactions' },
    { icon: <CreditCard size={20} />, label: 'Deposit', path: '/deposit' },
    { icon: <ArrowDownUp size={20} />, label: 'Withdrawal', path: '/withdrawal' },
    { icon: <BarChart4 size={20} />, label: 'Market', path: '/market' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 h-screen bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">FinWise</h2>
      </div>
      
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            active={currentPath === item.path}
          />
        ))}
      </div>
      
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
