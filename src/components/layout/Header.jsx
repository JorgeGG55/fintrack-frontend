import { Search, Bell, Plus, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

const Header = ({ onMenuClick }) => {
    const { user } = useAuth();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');

    const getPageInfo = () => {
        const path = location.pathname;
        const titles = {
            '/dashboard': { title: 'Dashboard', subtitle: `Welcome back, ${user?.name?.split(' ')[0]}` },
            '/transactions': { title: 'Transactions', subtitle: 'Manage your income and expenses' },
            '/categories': { title: 'Categories', subtitle: 'Organize your transactions' },
            '/budgets': { title: 'Budgets', subtitle: 'Track your spending limits' },
            '/settings': { title: 'Settings', subtitle: 'Manage your account' },
        };
        return titles[path] || titles['/dashboard'];
    };

    const pageInfo = getPageInfo();

    return (
        <header className="h-14 lg:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-base lg:text-xl font-bold text-gray-900 leading-tight">{pageInfo.title}</h1>
                    <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">{pageInfo.subtitle}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
                <div className="relative hidden md:block">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-48 lg:w-64 text-sm"
                    />
                </div>
                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="btn btn-primary flex items-center gap-1.5 text-sm px-3 py-2 lg:px-4">
                    <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span className="hidden sm:inline">Add Transaction</span>
                </button>
            </div>
        </header>
    );
};

export default Header;