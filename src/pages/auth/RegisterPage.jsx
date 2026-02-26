import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
        if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setLoading(true);
        try {
            await register({ name: formData.name, email: formData.email, password: formData.password });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Error creating account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-r from-primary-500 via-primary-600 to-secondary-500 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-6 pt-0 sm:p-8">
                    <div className="text-center mb-4 sm:mb-5 flex flex-col items-center gap-1 sm:gap-2">
                        <img src="/fintrack.png" className="h-14 w-14 sm:h-20 sm:w-20" alt="FinTrack" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create account</h1>
                        <p className="text-sm sm:text-base text-gray-600">Join and start managing your finances</p>
                    </div>

                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs sm:text-sm text-blue-800">
                            ✨ <strong>Demo data included:</strong> When you sign up you'll get 3 months of sample transactions to explore the app immediately.
                        </p>
                    </div>

                    {error && (
                        <div key={error} className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-shake">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange}
                                    className="w-full bg-transparent pl-8 placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="Full name" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange}
                                    className="w-full bg-transparent pl-8 placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="your@email.com" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange}
                                    className="w-full bg-transparent pl-8 placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="Minimum 6 characters" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange}
                                    className="w-full bg-transparent pl-8 placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="Repeat your password" />
                            </div>
                        </div>

                        <div className="flex items-center justify-center pt-1">
                            <button type="submit" disabled={loading}
                                className="btn btn-primary flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto">
                                {loading ? (
                                    <><Loader2 className="h-5 w-5 animate-spin" />Creating account...</>
                                ) : (
                                    <><UserPlus className="h-5 w-5" />Create Account</>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-sm sm:text-base text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
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

export default RegisterPage;