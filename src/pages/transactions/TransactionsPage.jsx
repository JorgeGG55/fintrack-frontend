import { useState, useEffect, useMemo } from 'react';
import { Search, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { transactionService, categoryService } from '../../services';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import TransactionFiltersModal from './TransactionModal';
import GeneratingState from '../../components/ui/GeneratingState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ITEMS_PER_PAGE = 10;

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(
        new URLSearchParams(window.location.search).has('generating')
    );
    const [showFiltersModal, setShowFiltersModal] = useState(false);
    const [filters, setFilters] = useState({ search: '', category: '', type: '', startDate: '', endDate: '' });
    const [dateSort, setDateSort] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchCategories();
        fetchTransactions();
    }, []);

    useEffect(() => {
        if (!isGenerating) return;
        const interval = setInterval(async () => {
            try {
                const res = await transactionService.getAll();
                if (res.data?.length > 0) {
                    setIsGenerating(false);
                    setTransactions(res.data);
                    clearInterval(interval);
                }
            } catch (error) {
                console.error('Error en polling:', error);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [isGenerating]);

    useEffect(() => { setCurrentPage(1); }, [filters, dateSort]);

    const fetchCategories = async () => {
        const res = await categoryService.getAll();
        setCategories(res.data);
    };

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await transactionService.getAll();
            setTransactions(res.data);
            if (!res.data || res.data.length === 0) setIsGenerating(true);
        } catch {
            toast.error('Error al cargar transacciones');
        } finally {
            setLoading(false);
        }
    };

    const activeFiltersCount = [filters.category, filters.type, filters.startDate, filters.endDate]
        .filter(Boolean).length;

    const clearFilters = () => {
        setFilters({ search: '', category: '', type: '', startDate: '', endDate: '' });
    };

    const filteredTransactions = useMemo(() => {
        let result = transactions.filter((t) => {
            const matchesSearch = t.description.toLowerCase().includes(filters.search.toLowerCase());
            const matchesCategory = !filters.category || t.category === filters.category;
            const matchesType = !filters.type || t.type === filters.type;
            const transactionDate = new Date(t.date);
            transactionDate.setHours(0, 0, 0, 0);
            const start = filters.startDate ? new Date(filters.startDate) : null;
            const end = filters.endDate ? new Date(filters.endDate) : null;
            if (start) start.setHours(0, 0, 0, 0);
            if (end) end.setHours(23, 59, 59, 999);
            return matchesSearch && matchesCategory && matchesType &&
                (!start || transactionDate >= start) && (!end || transactionDate <= end);
        });
        result.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateSort === 'asc' ? dateA - dateB : dateB - dateA;
        });
        return result;
    }, [transactions, filters, dateSort]);

    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
    const paginatedTransactions = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredTransactions, currentPage]);

    const getCategoryIcon = (category) => {
        const icons = {
            'Food & Dining': '🍔', 'Transportation': '🚗', 'Entertainment': '🎮',
            'Shopping': '🛍️', 'Bills & Utilities': '⚡', 'Healthcare': '🏥',
            'Gym & Sports': '💪', 'Education': '📚', 'Travel': '✈️',
            'Salary': '💰', 'Freelance': '💼', 'Investments': '📈', 'Other': '📦',
        };
        return icons[category] || '📦';
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Food & Dining': 'bg-red-50 text-red-600', 'Transportation': 'bg-purple-50 text-purple-600',
            'Entertainment': 'bg-pink-50 text-pink-600', 'Shopping': 'bg-indigo-50 text-indigo-600',
            'Bills & Utilities': 'bg-green-50 text-green-600', 'Healthcare': 'bg-cyan-50 text-cyan-600',
            'Gym & Sports': 'bg-blue-50 text-blue-600', 'Salary': 'bg-emerald-50 text-emerald-600',
        };
        return colors[category] || 'bg-gray-50 text-gray-600';
    };

    if (loading) return <LoadingSpinner />;

    if (isGenerating) {
        return <GeneratingState page="transactions" message="Generating your sample transactions..." />;
    }

    return (
        <div className="space-y-4 max-w-7xl mx-auto">
            <div className="bg-white rounded-xl p-4">
                <div className="flex gap-2 sm:hidden">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search transaction..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full pl-9 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <button
                        onClick={() => setShowFiltersModal(true)}
                        className="relative flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filtros
                        {activeFiltersCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>
                </div>
                <div className="hidden sm:flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search transaction..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full pl-9 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <select
                        className="w-40 py-2 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none"
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                        <option value="">All categories</option>
                        {categories.map((c) => (
                            <option key={c._id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                    <select
                        className="w-32 py-2 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none"
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    >
                        <option value="">All types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                    <input
                        type="date"
                        className="w-36 py-2 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none"
                        value={filters.startDate}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    />
                    <input
                        type="date"
                        className="w-36 py-2 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none"
                        value={filters.endDate}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    />
                </div>
                {activeFiltersCount > 0 && (
                    <div className="flex items-center gap-2 mt-3 sm:hidden">
                        <span className="text-xs text-gray-500">{activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} activo{activeFiltersCount > 1 ? 's' : ''}</span>
                        <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 underline">
                            Limpiar
                        </button>
                    </div>
                )}
            </div>
            <TransactionFiltersModal
                isOpen={showFiltersModal}
                onClose={() => setShowFiltersModal(false)}
                filters={filters}
                setFilters={setFilters}
                categories={categories}
                onClear={clearFilters}
            />
            <div className="bg-white rounded-xl">
                {paginatedTransactions.length === 0 ? (
                    <div className="py-16 text-center text-gray-400">No transactions found</div>
                ) : (
                    <>
                        <div className="sm:hidden divide-y divide-gray-50">
                            {paginatedTransactions.map((t) => (
                                <div key={t._id || t.id} className="flex items-center gap-3 px-4 py-3">
                                    <div className={`p-2 rounded-lg shrink-0 ${getCategoryColor(t.category)}`}>
                                        <span className="text-base">{getCategoryIcon(t.category)}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{t.description}</p>
                                        <p className="text-xs text-gray-400">
                                            {t.category} · {format(new Date(t.date), 'dd MMM yyyy', { locale: es })}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className={`text-sm font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                            {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                                        </p>
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {t.type}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="hidden sm:block px-4">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-xs text-gray-400">
                                        <th className="py-3 text-left">Description</th>
                                        <th className="py-3 text-left">Category</th>
                                        <th
                                            className="py-3 text-left cursor-pointer select-none"
                                            onClick={() => setDateSort(dateSort === 'asc' ? 'desc' : 'asc')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Date
                                                {dateSort === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                            </div>
                                        </th>
                                        <th className="py-3 text-left w-24">Type</th>
                                        <th className="py-3 text-right w-28">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedTransactions.map((t) => (
                                        <tr key={t._id || t.id} className="hover:bg-gray-50 border-t border-gray-50">
                                            <td className="py-3">
                                                <div className="flex gap-2 items-center">
                                                    <div className={`p-1.5 rounded-lg shrink-0 ${getCategoryColor(t.category)}`}>
                                                        {getCategoryIcon(t.category)}
                                                    </div>
                                                    <span className="text-sm font-medium line-clamp-1">{t.description}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 text-sm text-gray-600">{t.category}</td>
                                            <td className="py-3 text-sm text-gray-500">
                                                {format(new Date(t.date), 'dd MMM yyyy', { locale: es })}
                                            </td>
                                            <td className="py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {t.type}
                                                </span>
                                            </td>
                                            <td className="py-3 text-right font-semibold">
                                                <span className={t.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                                                    {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between px-4 py-4 text-sm border-t border-gray-50">
                            <button
                                onClick={() => setCurrentPage((p) => p - 1)}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border cursor-pointer disabled:opacity-40 hover:bg-gray-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Prev</span>
                            </button>
                            <span className="text-gray-500 text-xs sm:text-sm">
                                Página {currentPage} / {totalPages || 1}
                            </span>
                            <button
                                onClick={() => setCurrentPage((p) => p + 1)}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border cursor-pointer disabled:opacity-40 hover:bg-gray-50"
                            >
                                <span className="hidden sm:inline">Next</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TransactionsPage;