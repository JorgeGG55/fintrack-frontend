import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, amount, percentage, icon: Icon, color }) => {
    const isPositive = percentage >= 0;

    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        red: 'bg-red-50 text-red-600',
    };

    return (
        <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className={`p-2.5 lg:p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                </div>
                <div className={`flex items-center gap-1 text-xs lg:text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4" /> : <TrendingDown className="h-3 w-3 lg:h-4 lg:w-4" />}
                    <span>{isPositive ? '+' : ''}{percentage}%</span>
                </div>
            </div>
            <div>
                <p className="text-xs lg:text-sm text-gray-600 mb-1">{title}</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                    €{amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
        </div>
    );
};

export default StatCard;