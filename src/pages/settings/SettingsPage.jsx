import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services';
import {
    User, Mail, Lock, Trash2, LogOut,
    Loader2, AlertTriangle, Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [passwordLoading, setPasswordLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handlePasswordChange = async () => {
        setPasswordLoading(true);
        try {
            await authService.forgotPassword(user.email);
            toast.success('Password reset email sent! Check your inbox.');
        } catch {
            toast.error('Error sending reset email');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) { toast.error('Please enter your password'); return; }
        setDeleteLoading(true);
        try {
            await authService.deleteAccount(deletePassword);
            toast.success('Account deleted successfully');
            logout();
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Error deleting account');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div className="max-w-2xl mx-auto space-y-4 lg:space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-100">
                    <h2 className="text-base lg:text-lg font-bold text-gray-900">Profile</h2>
                    <p className="text-xs lg:text-sm text-gray-500">Your account information</p>
                </div>
                <div className="p-4 lg:p-6">
                    <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-linear-to-br border from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-primary-600 text-xl lg:text-2xl font-bold shrink-0">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-lg lg:text-xl font-bold text-gray-900 truncate">{user?.name}</h3>
                            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {[
                            { icon: User, label: 'Full Name', value: user?.name },
                            { icon: Mail, label: 'Email', value: user?.email },
                            {
                                icon: Shield, label: 'Member since',
                                value: user?.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
                                    : 'N/A'
                            },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-3 p-3 lg:p-4 bg-gray-50 rounded-lg">
                                <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500">{label}</p>
                                    <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-100">
                    <h2 className="text-base lg:text-lg font-bold text-gray-900">Change Password</h2>
                    <p className="text-xs lg:text-sm text-gray-500">We'll send you a reset link to your email</p>
                </div>
                <div className="p-4 lg:p-6">
                    <div className="flex items-start gap-3 p-3 lg:p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                        <Lock className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-xs lg:text-sm text-blue-800">
                            For security, we'll send a password reset link to{' '}
                            <strong className="break-all">{user?.email}</strong>
                        </p>
                    </div>
                    <button
                        onClick={handlePasswordChange}
                        disabled={passwordLoading}
                        className="btn btn-primary flex items-center gap-2 text-sm"
                    >
                        {passwordLoading ? (
                            <><Loader2 className="h-4 w-4 animate-spin" />Sending...</>
                        ) : (
                            <><Mail className="h-4 w-4" />Send Reset Link</>
                        )}
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-100">
                    <h2 className="text-base lg:text-lg font-bold text-gray-900">Session</h2>
                    <p className="text-xs lg:text-sm text-gray-500">Manage your current session</p>
                </div>
                <div className="p-4 lg:p-6">
                    <button onClick={handleLogout} className="btn btn-secondary flex items-center gap-2 text-sm">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
                <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-red-100 bg-red-50">
                    <h2 className="text-base lg:text-lg font-bold text-red-700 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 lg:h-5 lg:w-5" />
                        Danger Zone
                    </h2>
                    <p className="text-xs lg:text-sm text-red-600">Irreversible actions — proceed with caution</p>
                </div>
                <div className="p-4 lg:p-6">
                    {!showDeleteConfirm ? (
                        <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <p className="font-medium text-gray-900 text-sm lg:text-base">Delete Account</p>
                                <p className="text-xs lg:text-sm text-gray-500">Permanently delete your account and all your data</p>
                            </div>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="btn btn-primary flex items-center gap-1.5 text-sm shrink-0"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-3 lg:p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm font-medium text-red-800 mb-1">⚠️ This action cannot be undone</p>
                                <p className="text-xs lg:text-sm text-red-700">
                                    All your transactions, budgets and data will be permanently deleted.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm your password to continue
                                </label>
                                <input
                                    type="password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); }}
                                    className="flex-1 btn btn-secondary text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteLoading || !deletePassword}
                                    className="flex-1 btn btn-primary flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                                >
                                    {deleteLoading ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" />Deleting...</>
                                    ) : (
                                        <><Trash2 className="h-4 w-4" />Confirm Delete</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;