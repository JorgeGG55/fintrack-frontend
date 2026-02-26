import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, PieChart, Target, Zap } from 'lucide-react';
import { useEffect } from 'react';

const LandingPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) navigate('/dashboard');
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen bg-linear-to-r from-primary-50 to-secondary-50">
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        <div className="flex items-center gap-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                                <img src="/fintrack-logo.png" alt="FinTrack logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-lg sm:text-2xl font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text">
                                FinTrack
                            </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link to="/login" className="btn btn-secondary text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
                                Sign In
                            </Link>
                            <Link to="/register" className="btn btn-primary text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
                <div className="text-center">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
                        Take control of your
                        <span className="block bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text">
                            personal finances
                        </span>
                    </h1>
                    <p className="text-base sm:text-xl text-gray-600 mt-4 sm:mt-10 max-w-3xl mx-auto px-2">
                        Track your expenses, set budgets and reach your financial goals with FinTrack. Simple, intuitive and powerful.
                    </p>
                    <div className="flex justify-center items-center py-6 sm:py-10">
                        <Link to="/register" className="btn shadow-lg btn-primary px-6 py-3 sm:px-8 sm:py-4 rounded-lg transition-colors btn-lg flex items-center gap-2">
                            Get Started Now
                        </Link>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 sm:px-6 sm:py-3">
                        <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-blue-800 text-left">
                            <strong>Includes 3 months of demo data!</strong>{' '}
                            <span className="hidden sm:inline">Explore the app immediately</span>
                        </span>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
                    Everything you need to manage your money
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
                    <FeatureCard
                        icon={<PieChart className="h-7 w-7 sm:h-8 sm:w-8" />}
                        title="Clear Visualization"
                        description="Intuitive charts that show you exactly where your money goes"
                    />
                    <FeatureCard
                        icon={<Target className="h-7 w-7 sm:h-8 sm:w-8" />}
                        title="Smart Budgets"
                        description="Set limits by category and get alerts before you overspend"
                    />
                    <FeatureCard
                        icon={<TrendingUp className="h-7 w-7 sm:h-8 sm:w-8" />}
                        title="Detailed Analysis"
                        description="Understand your spending patterns and make better decisions"
                    />
                </div>
            </section>

            <section className="bg-linear-to-r from-primary-600 to-secondary-600 py-12 sm:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
                        Ready to take control?
                    </h2>
                    <p className="text-base sm:text-xl mb-6 sm:mb-8 opacity-90">
                        Join thousands of people already managing their finances smartly
                    </p>
                    <p className="mt-4 text-xs sm:text-sm opacity-75">
                        No credit card required • Demo data included
                    </p>
                </div>
            </section>

            <footer className="bg-white/80 border-t border-gray-200 py-6 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 flex items-center justify-center">
                                <img src="/fintrack-logo.png" alt="FinTrack logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-lg font-bold from-primary-600 to-secondary-600">FinTrack</span>
                        </div>
                        <div className="text-gray-600 text-xs sm:text-sm text-center">
                            © 2025 FinTrack. Portfolio project by Jorge Gravel.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow flex sm:flex-col items-start gap-4 sm:gap-0">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-primary-100 rounded-lg text-primary-600 sm:mb-4 shrink-0">
            {icon}
        </div>
        <div>
            <h3 className="text-lg sm:text-xl font-bold sm:mb-2">{title}</h3>
            <p className="text-gray-600 text-sm sm:text-base">{description}</p>
        </div>
    </div>
);

export default LandingPage;