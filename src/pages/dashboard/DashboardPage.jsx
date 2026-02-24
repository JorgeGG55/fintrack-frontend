import { useEffect, useState, useCallback } from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { transactionService } from '../../services';
import StatCard from '../../components/dashboard/StatCard';
import ExpensesPieChart from '../../components/dashboard/ExpensesPieChart';
import MonthlyEvolutionChart from '../../components/dashboard/MonthlyEvolutionChart';
import CategoryBudgetCard from '../../components/dashboard/CategoryBudgetCard';
import RecentTransactions from '../../components/dashboard/RecentTransactions';
import toast from 'react-hot-toast';

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const now = new Date();
    const [pieChartPeriod, setPieChartPeriod] = useState({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (!isGenerating) return;
        const interval = setInterval(async () => {
            try {
                const transactionsData = await transactionService.getAll({ limit: 10, page: 1 });
                if (transactionsData.data?.length > 0) {
                    setIsGenerating(false);
                    fetchDashboardData();
                    clearInterval(interval);
                }
            } catch (error) {
                console.error('Error en polling:', error);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [isGenerating]);

    useEffect(() => {
        if (stats) fetchPieChartData();
    }, [pieChartPeriod]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsData, transactionsData] = await Promise.all([
                transactionService.getStats(),
                transactionService.getAll({ limit: 10, page: 1 }),
            ]);
            setStats(statsData.data);
            setTransactions(transactionsData.data);
            if (!transactionsData.data || transactionsData.data.length === 0) {
                setIsGenerating(true);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Error al cargar datos del dashboard');
        } finally {
            setLoading(false);
        }
    };

    const fetchPieChartData = async () => {
        try {
            const statsData = await transactionService.getStats(pieChartPeriod.month, pieChartPeriod.year);
            setStats(prevStats => ({
                ...prevStats,
                byCategory: statsData.data.byCategory,
                period: statsData.data.period,
            }));
        } catch (error) {
            toast.error('Error al actualizar gráfico');
        }
    };

    const handlePeriodChange = (value) => {
        const now = new Date();
        switch (value) {
            case 'this-month':
                setPieChartPeriod({ month: now.getMonth() + 1, year: now.getFullYear() });
                break;
            case 'last-month':
                const lm = new Date(now); lm.setMonth(lm.getMonth() - 1);
                setPieChartPeriod({ month: lm.getMonth() + 1, year: lm.getFullYear() });
                break;
            case 'last-3-months':
                const tm = new Date(now); tm.setMonth(tm.getMonth() - 2);
                setPieChartPeriod({ month: tm.getMonth() + 1, year: tm.getFullYear() });
                break;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (isGenerating || !stats) {
        return (
            <div className="space-y-4 lg:space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 shrink-0"></div>
                    <div>
                        <p className="font-medium text-blue-900 text-sm lg:text-base">Generando tus datos de ejemplo...</p>
                        <p className="text-xs lg:text-sm text-blue-600">Esto puede tardar hasta un minuto. La página se actualizará sola.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100 animate-pulse">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                                <div className="h-4 w-12 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100 animate-pulse h-64 lg:h-80">
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
                            <div className="h-48 bg-gray-100 rounded-lg"></div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-xl p-4 lg:p-5 border border-gray-100 animate-pulse">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                                <div className="flex-1">
                                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full"></div>
                        </div>
                    ))}
                </div>
                <RecentTransactions transactions={[]} isGenerating={true} />
            </div>
        );
    }

    const expensesData = stats.byCategory
        .filter(cat => cat.total < 0)
        .map(cat => ({
            ...cat,
            total: Math.abs(cat.total),
            percentage: ((Math.abs(cat.total) / stats.period.expenses) * 100).toFixed(1),
        }));

    const monthlyData = [
        { month: 'Oct', income: 2500, expenses: 1200 },
        { month: 'Nov', income: 2500, expenses: 1450 },
        { month: 'Dec', income: 2800, expenses: 1350 },
        { month: 'Jan', income: 2500, expenses: 1280 },
        { month: 'Feb', income: 2500, expenses: 1100 },
        { month: 'Mar', income: 2500, expenses: stats.period.expenses },
    ];

    const topCategories = expensesData.slice(0, 4);

    const getCategoryIcon = (category) => {
        const icons = { 'Food & Dining': '🍔', 'Transportation': '🚗', 'Entertainment': '🎮', 'Shopping': '🛍️', 'Bills & Utilities': '⚡', 'Healthcare': '🏥', 'Gym & Sports': '💪' };
        return icons[category] || '📦';
    };

    const getCategoryColor = (category) => {
        const colors = { 'Food & Dining': 'bg-red-50', 'Transportation': 'bg-purple-50', 'Entertainment': 'bg-orange-50', 'Shopping': 'bg-green-50' };
        return colors[category] || 'bg-gray-50';
    };

    return (
        <div className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-6">
                <StatCard title="Total Balance" amount={stats.overall.balance} percentage={2.5} icon={Wallet} color="blue" />
                <StatCard title="Monthly Income" amount={stats.period.income} percentage={8.2} icon={TrendingUp} color="green" />
                <StatCard title="Monthly Expenses" amount={stats.period.expenses} percentage={-2.1} icon={TrendingDown} color="red" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <ExpensesPieChart data={expensesData} onPeriodChange={handlePeriodChange} />
                <MonthlyEvolutionChart data={monthlyData} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {topCategories.map((cat) => (
                    <CategoryBudgetCard
                        key={cat._id}
                        category={cat._id}
                        spent={cat.total}
                        budget={cat.total * 1.2}
                        icon={getCategoryIcon(cat._id)}
                        color={getCategoryColor(cat._id)}
                    />
                ))}
            </div>
            <RecentTransactions transactions={transactions} isGenerating={isGenerating} />
        </div>
    );
};

export default DashboardPage;