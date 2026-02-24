import { memo, useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import ChartWrapper from './ChartWrapper';

const COLORS = {
    'Food & Dining': '#ef4444',
    'Transportation': '#f59e0b',
    'Entertainment': '#ec4899',
    'Shopping': '#8b5cf6',
    'Bills & Utilities': '#10b981',
    'Healthcare': '#06b6d4',
    'Gym & Sports': '#3b82f6',
    'Education': '#6366f1',
    'Travel': '#14b8a6',
    'Other': '#6b7280',
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const ExpensesPieChart = memo(({ data, onPeriodChange }) => {
    const now = new Date();
    const thisMonth = capitalize(now.toLocaleString('es-ES', { month: 'long' }));
    const lastMonth = capitalize(new Date(now.getFullYear(), now.getMonth() - 1, 1).toLocaleString('es-ES', { month: 'long' }));
    const twoMonthsAgo = capitalize(new Date(now.getFullYear(), now.getMonth() - 2, 1).toLocaleString('es-ES', { month: 'long' }));

    const chartData = useMemo(
        () => data.map(item => ({
            name: item._id || item.name,
            value: Math.abs(item.total),
            percentage: item.percentage,
        })),
        [data]
    );

    const CustomTooltip = useCallback(({ active, payload }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                <p className="font-semibold text-gray-900">{payload[0].name}</p>
                <p className="text-sm text-gray-600">
                    €{payload[0].value.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500">{payload[0].payload.percentage}%</p>
            </div>
        );
    }, []);

    const handlePeriodChange = useCallback(
        (e) => onPeriodChange(e.target.value),
        [onPeriodChange]
    );

    // Calcular altura de leyenda según nº de categorías (2 columnas, ~20px por fila)
    const legendRows = Math.ceil(chartData.length / 2);
    const legendHeight = legendRows * 22 + 10;

    return (
        <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base lg:text-lg font-bold text-gray-900">Expenses by Category</h3>
                <select
                    onChange={handlePeriodChange}
                    className="text-xs lg:text-sm border border-gray-300 rounded-lg px-2 py-1.5 lg:px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="this-month">{thisMonth}</option>
                    <option value="last-month">{lastMonth}</option>
                    <option value="last-3-months">{twoMonthsAgo}</option>
                </select>
            </div>
            <ChartWrapper heightRatio={0.65} maxHeight={260}>
                {(width, height) => (
                    <PieChart width={width} height={height + legendHeight}>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy={height * 0.45}
                            innerRadius={height * 0.22}
                            outerRadius={height * 0.42}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#6b7280'} />
                            ))}
                        </Pie>
                        <Tooltip content={CustomTooltip} />
                        <Legend
                            verticalAlign="bottom"
                            height={legendHeight}
                            formatter={(value, entry) => (
                                <span style={{ fontSize: '11px', color: '#374151' }}>
                                    {value} ({entry.payload.percentage}%)
                                </span>
                            )}
                        />
                    </PieChart>
                )}
            </ChartWrapper>
        </div>
    );
});

export default ExpensesPieChart;