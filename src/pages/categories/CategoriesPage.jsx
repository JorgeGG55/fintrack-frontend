import { useState, useEffect } from 'react';
import { categoryService } from '../../services';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoryService.getAll();
            setCategories(response.data);
        } catch {
            toast.error('Error loading categories');
        } finally {
            setLoading(false);
        }
    };

    const filtered = categories.filter(cat => {
        if (filter === 'all') return true;
        return cat.type === filter || cat.type === 'both';
    });

    const expenseCount = categories.filter(c => c.type === 'expense' || c.type === 'both').length;
    const incomeCount = categories.filter(c => c.type === 'income' || c.type === 'both').length;

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-3 gap-3 lg:gap-4">
                <div className="bg-white rounded-xl p-3 lg:p-5 border border-gray-100 text-center">
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">{categories.length}</p>
                    <p className="text-xs lg:text-sm text-gray-500 mt-1">Total</p>
                </div>
                <div className="bg-white rounded-xl p-3 lg:p-5 border border-gray-100 text-center">
                    <p className="text-2xl lg:text-3xl font-bold text-red-500">{expenseCount}</p>
                    <p className="text-xs lg:text-sm text-gray-500 mt-1">Expenses</p>
                </div>
                <div className="bg-white rounded-xl p-3 lg:p-5 border border-gray-100 text-center">
                    <p className="text-2xl lg:text-3xl font-bold text-green-500">{incomeCount}</p>
                    <p className="text-xs lg:text-sm text-gray-500 mt-1">Income</p>
                </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-1 flex gap-1 w-full sm:w-fit">
                {[
                    { value: 'all', label: '🗂 All' },
                    { value: 'expense', label: '💸 Expenses' },
                    { value: 'income', label: '💰 Income' },
                ].map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setFilter(tab.value)}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all ${filter === tab.value
                            ? 'bg-gray-100 text-primary-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                {filtered.map(category => (
                    <div
                        key={category._id}
                        className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center gap-2 lg:gap-3 mb-3">
                            <div
                                className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-xl lg:text-2xl shrink-0"
                                style={{ backgroundColor: `${category.color}20` }}
                            >
                                {category.icon}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-gray-900 text-sm truncate">{category.name}</h3>
                                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${category.type === 'expense'
                                    ? 'bg-red-100 text-red-700'
                                    : category.type === 'income'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {category.type}
                                </span>
                            </div>
                        </div>
                        <div className="h-1 rounded-full" style={{ backgroundColor: category.color }} />
                    </div>
                ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <span className="text-blue-500 text-lg shrink-0">ℹ️</span>
                <div>
                    <p className="text-sm font-medium text-blue-900">Global Categories</p>
                    <p className="text-xs lg:text-sm text-blue-700 mt-0.5">
                        Categories are predefined and shared across all users. They are automatically assigned to your transactions by our AI when generating demo data.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;