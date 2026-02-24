import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, TrendingUp, AlertCircle } from 'lucide-react';
import { budgetService, categoryService, transactionService } from '../../services';
import toast from 'react-hot-toast';

const BudgetsPage = () => {
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [expenses, setExpenses] = useState({});
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);

    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());

    useEffect(() => { fetchData(); }, [selectedMonth, selectedYear]);

    useEffect(() => {
        if (!isGenerating) return;
        const interval = setInterval(async () => {
            try {
                const budgetsResponse = await budgetService.getAll({ month: selectedMonth, year: selectedYear });
                if (budgetsResponse.data?.length > 0) {
                    setIsGenerating(false);
                    fetchData();
                    clearInterval(interval);
                }
            } catch (error) {
                console.error('Error en polling:', error);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [isGenerating]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const budgetsResponse = await budgetService.getAll({ month: selectedMonth, year: selectedYear });
            setBudgets(budgetsResponse.data);
            const categoriesResponse = await categoryService.getAll('expense');
            setCategories(categoriesResponse.data);
            const statsResponse = await transactionService.getStats(selectedMonth, selectedYear);
            const expensesMap = {};
            statsResponse.data.byCategory.forEach(cat => {
                if (cat.total < 0) expensesMap[cat._id] = Math.abs(cat.total);
            });
            setExpenses(expensesMap);
            if (!budgetsResponse.data || budgetsResponse.data.length === 0) setIsGenerating(true);
        } catch (error) {
            toast.error('Error al cargar presupuestos');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este presupuesto?')) return;
        try {
            await budgetService.delete(id);
            toast.success('Presupuesto eliminado');
            fetchData();
        } catch {
            toast.error('Error al eliminar presupuesto');
        }
    };

    const getBudgetStatus = (spent, budget) => {
        const percentage = (spent / budget) * 100;
        if (percentage >= 100) return { color: 'red', text: 'Over budget', icon: AlertCircle };
        if (percentage >= 90) return { color: 'yellow', text: 'Almost there', icon: TrendingUp };
        if (percentage >= 75) return { color: 'orange', text: 'On track', icon: TrendingUp };
        return { color: 'green', text: 'Healthy', icon: TrendingUp };
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 100) return 'bg-red-500';
        if (percentage >= 90) return 'bg-yellow-500';
        if (percentage >= 75) return 'bg-orange-500';
        return 'bg-green-500';
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'Food & Dining': '🍔', 'Transportation': '🚗', 'Entertainment': '🎮',
            'Shopping': '🛍️', 'Bills & Utilities': '⚡', 'Healthcare': '🏥',
            'Gym & Sports': '💪', 'Education': '📚', 'Travel': '✈️', 'Other': '📦',
        };
        return icons[category] || '📦';
    };

    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + (expenses[b.category] || 0), 0);
    const totalRemaining = totalBudget - totalSpent;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (isGenerating) {
        return (
            <div className="space-y-4 lg:space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 shrink-0"></div>
                    <div>
                        <p className="font-medium text-blue-900 text-sm lg:text-base">Generando tus presupuestos de ejemplo...</p>
                        <p className="text-xs lg:text-sm text-blue-600">Esto puede tardar hasta un minuto. La página se actualizará sola.</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
                    <div className="flex gap-3 items-center">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-8 w-28 bg-gray-200 rounded-lg"></div>
                        <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3 lg:gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100 animate-pulse">
                            <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                            <div className="h-7 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100 animate-pulse">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
                            <div className="h-2 w-full bg-gray-200 rounded-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 lg:space-y-6">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex flex-wrap items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 shrink-0">Select Period:</label>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="input flex-1 sm:flex-none sm:w-36"
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(2024, i).toLocaleString('es-ES', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="input w-24"
                    >
                        {Array.from({ length: 5 }, (_, i) => {
                            const year = now.getFullYear() - 2 + i;
                            return <option key={year} value={year}>{year}</option>;
                        })}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3 lg:gap-6">
                <div className="bg-white rounded-xl p-3 lg:p-6 border border-gray-100">
                    <p className="text-xs lg:text-sm text-gray-600 mb-1">Total Budget</p>
                    <p className="text-lg lg:text-3xl font-bold text-gray-900">
                        €{totalBudget.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-white rounded-xl p-3 lg:p-6 border border-gray-100">
                    <p className="text-xs lg:text-sm text-gray-600 mb-1">Total Spent</p>
                    <p className="text-lg lg:text-3xl font-bold text-red-600">
                        €{totalSpent.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-white rounded-xl p-3 lg:p-6 border border-gray-100">
                    <p className="text-xs lg:text-sm text-gray-600 mb-1">Remaining</p>
                    <p className={`text-lg lg:text-3xl font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        €{totalRemaining.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
            {budgets.length === 0 ? (
                <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
                    <div className="text-6xl mb-4">💰</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No budgets yet</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
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
                                        <div className="text-2xl lg:text-3xl">{getCategoryIcon(budget.category)}</div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm lg:text-base">{budget.category}</h3>
                                            <p className="text-xs text-gray-500 capitalize">{budget.period}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 lg:gap-2">
                                        <button onClick={() => { setEditingBudget(budget); setShowModal(true); }} className="text-gray-400 hover:text-primary-600 p-1">
                                            <Edit2 className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                                        </button>
                                        <button onClick={() => handleDelete(budget.id)} className="text-gray-400 hover:text-red-600 p-1">
                                            <Trash2 className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-baseline">
                                        <div>
                                            <p className="text-xl lg:text-2xl font-bold text-gray-900">
                                                €{spent.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                of €{budget.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                        <div className={`flex items-center gap-1 text-xs lg:text-sm font-medium text-${status.color}-600`}>
                                            <StatusIcon className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                                            <span>{status.text}</span>
                                        </div>
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
            )}
        </div>
    );
};

export default BudgetsPage;