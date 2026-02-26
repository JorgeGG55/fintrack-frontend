import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Error signing in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-r from-primary-500 via-primary-600 to-secondary-500 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
                    <div className="text-center mb-5 sm:mb-8 flex flex-col items-center gap-1 sm:gap-2">
                        <img src="/fintrack.png" className="h-16 w-16 sm:h-24 sm:w-24" alt="FinTrack" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome to FinTrack</h1>
                        <p className="text-sm sm:text-base text-gray-600">Sign in to manage your finances</p>
                    </div>

                    {error && (
                        <div key={error} className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-shake">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email" name="email" type="email" required
                                    value={formData.email} onChange={handleChange}
                                    className="w-full bg-transparent pl-8 placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="Email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password" name="password" type="password" required
                                    value={formData.password} onChange={handleChange}
                                    className="w-full bg-transparent pl-8 placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                Forgot your password?
                            </Link>
                        </div>

                        <div className="flex items-center justify-center">
                            <button type="submit" disabled={loading}
                                className="btn btn-primary flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto">
                                {loading ? (
                                    <><Loader2 className="h-5 w-5 animate-spin" />Signing in...</>
                                ) : (
                                    <><LogIn className="h-5 w-5" />Sign In</>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-5 text-center">
                        <p className="text-sm sm:text-base text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">Sign up for free</Link>
                        </p>
                    </div>
                </div>
                <p className="text-center mt-4 text-primary-600 font-medium text-xs sm:text-sm">
                    © 2025 FinTrack. Portfolio project by Jorge Gravel.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;