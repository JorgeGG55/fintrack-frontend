import { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import { budgetService, categoryService, transactionService } from '../../services';
import toast from 'react-hot-toast';
import GeneratingState from '../../components/ui/GeneratingState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CATEGORY_ICONS = {
    'Food & Dining': '🍔', 'Transportation': '🚗', 'Entertainment': '🎮',
    'Shopping': '🛍️', 'Bills & Utilities': '⚡', 'Healthcare': '🏥',
    'Gym & Sports': '💪', 'Education': '📚', 'Travel': '✈️', 'Other': '📦',
};

const getBudgetStatus = (spent, budget) => {
    const p = (spent / budget) * 100;
    if (p >= 100) return { color: 'red', text: 'Over budget', icon: AlertCircle };
    if (p >= 90) return { color: 'yellow', text: 'Almost there', icon: TrendingUp };
    if (p >= 75) return { color: 'orange', text: 'On track', icon: TrendingUp };
    return { color: 'green', text: 'Healthy', icon: TrendingUp };
};

const getProgressColor = (p) => {
    if (p >= 100) return 'bg-red-500';
    if (p >= 90) return 'bg-yellow-500';
    if (p >= 75) return 'bg-orange-500';
    return 'bg-green-500';
};

const MonthSelect = ({ value, months, onChange, size = 'base' }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-transparent border border-gray-200 rounded-lg px-3 py-2 text-${size} font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer hover:border-gray-300 transition-colors`}
    >
        {months.map(({ month, year }) => {
            const key = `${year}-${String(month).padStart(2, '0')}`;
            return (
                <option key={key} value={key}>
                    {new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                </option>
            );
        })}
    </select>
);

const BudgetsPage = () => {
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState({});
    const [availableMonths, setAvailableMonths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());

    useEffect(() => {
        fetchAvailableMonths();
        categoryService.getAll('expense').catch(() => { });
    }, []);

    useEffect(() => {
        if (availableMonths.length > 0) fetchData();
    }, [selectedMonth, selectedYear, availableMonths.length]);

    // Polling cuando está generando
    useEffect(() => {
        if (!isGenerating) return;
        const interval = setInterval(async () => {
            try {
                const res = await budgetService.getAll();
                if (res.data?.length > 0) {
                    clearInterval(interval);
                    setIsGenerating(false);
                    processAvailableMonths(res.data);
                }
            } catch { /* silent */ }
        }, 8000);
        return () => clearInterval(interval);
    }, [isGenerating]);

    const fetchAvailableMonths = async () => {
        try {
            setLoading(true);
            const res = await budgetService.getAll();
            const allBudgets = res.data || [];

            if (!allBudgets.length) {
                setIsGenerating(true);
            } else {
                processAvailableMonths(allBudgets);
            }
        } catch {
            toast.error('Error loading budgets');
        } finally {
            setLoading(false);
        }
    };

    const processAvailableMonths = (allBudgets) => {
        const monthsMap = new Map();
        allBudgets.forEach(b => {
            const key = `${b.year}-${String(b.month).padStart(2, '0')}`;
            if (!monthsMap.has(key)) monthsMap.set(key, { month: b.month, year: b.year });
        });
        const months = [...monthsMap.values()].sort((a, b) =>
            b.year !== a.year ? b.year - a.year : b.month - a.month
        );
        setAvailableMonths(months);
        if (months.length > 0) {
            setSelectedMonth(months[0].month);
            setSelectedYear(months[0].year);
        }
    };

    const fetchData = async () => {
        try {
            const [budgetsRes, statsRes] = await Promise.all([
                budgetService.getAll({ month: selectedMonth, year: selectedYear }),
                transactionService.getStats(selectedMonth, selectedYear),
            ]);
            setBudgets(budgetsRes.data || []);
            const expensesMap = {};
            statsRes.data?.byCategory?.forEach(cat => {
                if (cat.total < 0) expensesMap[cat._id] = Math.abs(cat.total);
            });
            setExpenses(expensesMap);
        } catch {
            toast.error('Error loading budgets');
        }
    };

    const handleMonthSelect = (value) => {
        const [year, month] = value.split('-').map(Number);
        setSelectedMonth(month);
        setSelectedYear(year);
    };

    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + (expenses[b.category] || 0), 0);
    const totalRemaining = totalBudget - totalSpent;
    const selectedKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
    const fmt = (n) => n.toLocaleString('es-ES', { minimumFractionDigits: 2 });

    if (loading) return <LoadingSpinner />;
    if (isGenerating) return <GeneratingState page="budgets" message="Generating your sample budgets..." />;

    if (!availableMonths.length) {
        return (
            <div className="bg-white rounded-xl p-8 sm:p-12 border border-gray-100 text-center">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No budgets yet</h3>
                <p className="text-gray-600">Start by creating your first budget to track your spending</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 lg:space-y-6">

            {/* Mobile: selector + stats */}
            <div className="lg:hidden space-y-3">
                <div className="bg-white rounded-xl p-3 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-primary-600" />
                        <span className="text-xs text-gray-600 font-medium">Select Period</span>
                    </div>
                    <MonthSelect value={selectedKey} months={availableMonths} onChange={handleMonthSelect} size="sm" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-600 mb-1">Total Budget</p>
                        <p className="text-base font-bold text-gray-900">€{fmt(totalBudget)}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-600 mb-1">Total Spent</p>
                        <p className="text-base font-bold text-red-600">€{fmt(totalSpent)}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-600 mb-1">Remaining</p>
                        <p className={`text-base font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>€{fmt(totalRemaining)}</p>
                    </div>
                </div>
            </div>

            {/* Desktop: selector + stats en fila */}
            <div className="hidden lg:grid grid-cols-4 gap-6 mb-5">
                <div className="bg-white rounded-xl p-6 border border-gray-100 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-primary-600" />
                        <span className="text-sm text-gray-600 font-medium">Period</span>
                    </div>
                    <MonthSelect value={selectedKey} months={availableMonths} onChange={handleMonthSelect} />
                </div>
                {[
                    { label: 'Total Budget', value: `€${fmt(totalBudget)}`, color: 'text-gray-900' },
                    { label: 'Total Spent', value: `€${fmt(totalSpent)}`, color: 'text-red-600' },
                    { label: 'Remaining', value: `€${fmt(totalRemaining)}`, color: totalRemaining >= 0 ? 'text-green-600' : 'text-red-600' },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white rounded-xl p-6 border border-gray-100">
                        <p className="text-sm text-gray-600 mb-1">{label}</p>
                        <p className={`text-3xl font-bold ${color}`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Tarjetas de presupuesto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {budgets.map((budget) => {
                    const spent = expenses[budget.category] || 0;
                    const percentage = (spent / budget.amount) * 100;
                    const remaining = budget.amount - spent;
                    const status = getBudgetStatus(spent, budget.amount);
                    const StatusIcon = status.icon;

                    return (
                        <div key={budget.id} className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-3 lg:mb-4">
                                <div className="flex items-center gap-2 lg:gap-3">
                                    <div className="text-2xl lg:text-3xl">{CATEGORY_ICONS[budget.category] || '📦'}</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm lg:text-base">{budget.category}</h3>
                                        <p className="text-xs text-gray-500 capitalize">{budget.period}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1 text-xs lg:text-sm font-medium text-${status.color}-600`}>
                                    <StatusIcon className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                                    <span className="hidden sm:inline">{status.text}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xl lg:text-2xl font-bold text-gray-900">€{fmt(spent)}</p>
                                    <p className="text-xs text-gray-500">of €{fmt(budget.amount)}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs lg:text-sm">
                                        <span className="text-gray-500">{percentage.toFixed(0)}% used</span>
                                        <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                                            €{Math.abs(remaining).toFixed(2)} {remaining >= 0 ? 'left' : 'over'}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 lg:h-3">
                                        <div
                                            className={`h-2 lg:h-3 rounded-full transition-all ${getProgressColor(percentage)}`}
                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BudgetsPage;