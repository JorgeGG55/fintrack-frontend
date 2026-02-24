import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Lock, ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };
        if (password.length < 6) return { strength: 1, label: 'Too short', color: 'bg-red-500' };
        if (password.length < 8) return { strength: 2, label: 'Weak', color: 'bg-orange-500' };
        if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { strength: 3, label: 'Fair', color: 'bg-yellow-500' };
        return { strength: 4, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
        if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setLoading(true);
        try {
            await authService.resetPassword(token, formData.password);
            setSuccess(true);
            toast.success('Password updated successfully!');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid or expired token');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-linear-to-br from-primary-500 via-primary-600 to-secondary-500 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center">
                    <div className="text-5xl mb-4">❌</div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Invalid Link</h2>
                    <p className="text-gray-600 text-sm mb-6">This reset link is invalid or has expired.</p>
                    <Link to="/forgot-password" className="btn btn-primary">Request New Link</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-primary-500 via-primary-600 to-secondary-500 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">

                    {!success ? (
                        <>
                            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-5">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Login
                            </Link>
                            <div className="text-center mb-5 sm:mb-8">
                                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full mb-3">
                                    <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
                                </div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Create new password</h1>
                                <p className="text-gray-600 text-sm">Your new password must be different from your previous one.</p>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">{error}</p>
                                    {error.includes('expired') && (
                                        <Link to="/forgot-password" className="text-sm text-red-700 font-medium underline mt-1 block">
                                            Request a new reset link →
                                        </Link>
                                    )}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full bg-transparent pl-9 pr-10 placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm"
                                            placeholder="Minimum 6 characters"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {formData.password && (
                                        <div className="mt-2 space-y-1">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4].map((level) => (
                                                    <div key={level} className={`h-1 flex-1 rounded-full transition-colors ${level <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'}`} />
                                                ))}
                                            </div>
                                            <p className={`text-xs font-medium ${passwordStrength.strength <= 1 ? 'text-red-600' : passwordStrength.strength === 2 ? 'text-orange-600' : passwordStrength.strength === 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                                                {passwordStrength.label}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirm ? 'text' : 'password'}
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full bg-transparent pl-9 pr-10 placeholder:text-slate-400 text-slate-700 text-sm border rounded-md px-3 py-2 focus:outline-none hover:border-slate-300 shadow-sm ${formData.confirmPassword && formData.password !== formData.confirmPassword
                                                ? 'border-red-400 focus:border-red-400'
                                                : formData.confirmPassword && formData.password === formData.confirmPassword
                                                    ? 'border-green-400 focus:border-green-400'
                                                    : 'border-slate-200 focus:border-slate-400'
                                                }`}
                                            placeholder="Repeat your password"
                                        />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {formData.confirmPassword && (
                                        <p className={`text-xs mt-1 font-medium ${formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                                            {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || formData.password !== formData.confirmPassword}
                                    className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" />Updating...</>
                                    ) : (
                                        <><Lock className="h-4 w-4" />Update Password</>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4">
                                <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Password updated!</h2>
                            <p className="text-gray-600 text-sm mb-6">
                                Your password has been changed successfully. Redirecting to dashboard...
                            </p>
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500" />
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-center mt-4 text-gray-500 font-medium text-xs sm:text-sm">
                    © 2025 FinTrack. Portfolio project by Jorge Gravel.
                </p>
            </div>
        </div>
    );
};

export default ResetPasswordPage;