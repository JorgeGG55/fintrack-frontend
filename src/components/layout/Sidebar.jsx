import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    ArrowLeftRight,
    FolderOpen,
    Target,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNavClick = () => {
        if (setMobileOpen) setMobileOpen(false);
    };

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Transactions', icon: ArrowLeftRight, path: '/transactions' },
        { name: 'Categories', icon: FolderOpen, path: '/categories' },
        { name: 'Budgets', icon: Target, path: '/budgets' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <div className={`
            ${collapsed ? 'w-20' : 'w-64'}
            h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative
        `}>
            <div className="h-14 lg:h-16 flex items-center justify-between px-4 border-b border-gray-200 shrink-0">
                {!collapsed && (
                    <NavLink to="/dashboard" className="flex items-center gap-2" onClick={handleNavClick}>
                        <div className="flex items-center gap-2">
                            <img src="/fintrack-logo.png" alt="FinTrack" className="w-8 h-8 object-contain" />
                            <span className="text-xl font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text">
                                FinTrack
                            </span>
                        </div>

                    </NavLink>
                )}
                {collapsed && (
                    <img src="/fintrack-logo.png" alt="FinTrack" className="w-8 h-8 object-contain mx-auto" />
                )}
            </div>
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50 transition-colors z-10 cursor-pointer items-center justify-center"
            >
                {collapsed ? (
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                ) : (
                    <ChevronLeft className="h-4 w-4 text-gray-600" />
                )}
            </button>
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
                <ul className="space-y-1">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive
                                        ? 'bg-primary-50 text-primary-600 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`
                                }
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                {!collapsed && <span>{item.name}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="border-t border-gray-200 p-3 lg:p-4 shrink-0">
                {!collapsed ? (
                    <>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 lg:w-10 lg:h-10 border bg-linear-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-primary-600 font-medium shrink-0">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm cursor-pointer text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Log out</span>
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center p-2 cursor-pointer text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Sidebar;