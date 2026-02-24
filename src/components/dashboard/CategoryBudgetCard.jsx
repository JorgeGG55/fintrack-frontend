const CategoryBudgetCard = ({ category, spent, budget, icon, color }) => {
    const percentage = (spent / budget) * 100;
    const remaining = budget - spent;

    const getProgressColor = () => {
        if (percentage >= 90) return 'bg-red-500';
        if (percentage >= 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getTextColor = () => {
        if (percentage >= 90) return 'text-red-600';
        if (percentage >= 75) return 'text-yellow-600';
        return 'text-green-600';
    };

    return (
        <div className="bg-white rounded-xl p-4 lg:p-5 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 lg:p-2.5 rounded-lg ${color} shrink-0`}>
                    <span className="text-lg lg:text-xl">{icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm lg:text-base truncate">{category}</h4>
                    <p className="text-lg lg:text-2xl font-bold text-gray-900">
                        €{spent.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            <div className="space-y-1.5 lg:space-y-2">
                <div className="flex justify-between text-xs lg:text-sm">
                    <span className={`font-medium ${getTextColor()}`}>
                        {percentage.toFixed(0)}% of budget
                    </span>
                    <span className="text-gray-500">
                        €{remaining.toFixed(2)} left
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 lg:h-2">
                    <div
                        className={`h-1.5 lg:h-2 rounded-full transition-all ${getProgressColor()}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CategoryBudgetCard;