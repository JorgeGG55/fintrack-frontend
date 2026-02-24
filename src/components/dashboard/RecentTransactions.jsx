import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { NavLink } from 'react-router-dom';

const RecentTransactions = ({ transactions, isGenerating }) => {
    const getCategoryIcon = (category) => {
        const icons = {
            'Food & Dining': '🍔', 'Transportation': '🚗', 'Entertainment': '🎮',
            'Shopping': '🛍️', 'Bills & Utilities': '⚡', 'Healthcare': '🏥',
            'Gym & Sports': '💪', 'Salary': '💰', 'Freelance': '💼', 'Other': '📦',
        };
        return icons[category] || '📦';
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Food & Dining': 'bg-red-50 text-red-600', 'Transportation': 'bg-purple-50 text-purple-600',
            'Entertainment': 'bg-orange-50 text-orange-600', 'Shopping': 'bg-green-50 text-green-600',
            'Salary': 'bg-blue-50 text-blue-600',
        };
        return colors[category] || 'bg-gray-50 text-gray-600';
    };

    if (isGenerating || !transactions || transactions.length === 0) {
        return (
            <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900">Recent Transactions</h3>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center gap-3 p-2 lg:p-3 animate-pulse">
                            <div className="h-9 w-9 lg:h-10 lg:w-10 bg-gray-200 rounded-lg shrink-0"></div>
                            <div className="flex-1">
                                <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                                <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                            </div>
                            <div className="h-4 w-14 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base lg:text-lg font-bold text-gray-900">Recent Transactions</h3>
                <NavLink to="/transactions">
                    <button className="text-xs lg:text-sm text-primary-600 cursor-pointer transition-colors hover:bg-gray-200 rounded-lg px-2 py-1 lg:px-3">
                        View All
                    </button>
                </NavLink>
            </div>

            <div className="space-y-1 lg:space-y-2">
                {transactions.slice(0, 10).map((transaction) => (
                    <div
                        key={transaction.id}
                        className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    >
                        <div className={`p-2 lg:p-2.5 rounded-lg shrink-0 ${getCategoryColor(transaction.category)}`}>
                            <span className="text-base lg:text-xl">{getCategoryIcon(transaction.category)}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate text-sm lg:text-base">
                                {transaction.description}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {transaction.category} • {format(new Date(transaction.date), 'PP', { locale: es })}
                            </p>
                        </div>

                        <div className="text-right shrink-0">
                            <p className={`font-bold text-sm lg:text-base ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.type === 'income' ? '+' : '-'}€{Math.abs(transaction.amount).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">{transaction.paymentMethod}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentTransactions;