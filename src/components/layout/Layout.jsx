import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="h-screen flex overflow-hidden bg-gray-50">
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-20 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}
            <div className={`
                fixed inset-y-0 left-0 z-30 lg:static lg:z-auto
                transform transition-transform duration-300
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <Header onMenuClick={() => setMobileOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default Layout;