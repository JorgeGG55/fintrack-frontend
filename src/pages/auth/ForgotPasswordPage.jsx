import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.forgotPassword(email);
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al enviar el email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-primary-500 via-primary-600 to-secondary-500 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">

                    <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-5">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Login
                    </Link>

                    {!sent ? (
                        <>
                            <div className="text-center mb-6 sm:mb-8">
                                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full mb-3">
                                    <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
                                </div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                    Forgot your password?
                                </h1>
                                <p className="text-gray-600 text-sm">
                                    No worries! Enter your email and we'll send you a reset link.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                            className="w-full bg-transparent pl-9 placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm"
                                            placeholder="Email"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn btn-primary flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" />Sending...</>
                                    ) : (
                                        <><Mail className="h-4 w-4" />Send Reset Link</>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-2">
                            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4">
                                <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Check your email!</h2>
                            <p className="text-gray-600 text-sm mb-1">We sent a password reset link to:</p>
                            <p className="font-semibold text-gray-900 mb-4 break-all">{email}</p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left mb-4">
                                <p className="text-sm text-blue-800">
                                    <strong>💡 Tip:</strong> The link expires in <strong>1 hour</strong>. Check your spam folder if you don't see it.
                                </p>
                            </div>
                            <button
                                onClick={() => { setSent(false); setEmail(''); }}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Didn't receive it? Send again
                            </button>
                        </div>
                    )}

                    <div className="mt-5 text-center">
                        <p className="text-gray-600 text-sm">
                            Remember your password?{' '}
                            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
                        </p>
                    </div>
                </div>

                <p className="text-center mt-4 text-gray-500 font-medium text-xs sm:text-sm">
                    © 2025 FinTrack. Portfolio project by Jorge Gravel.
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;