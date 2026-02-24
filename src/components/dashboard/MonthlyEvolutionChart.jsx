import { memo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ChartWrapper from './ChartWrapper';

const LEGEND_HEIGHT = 30;

const MonthlyEvolutionChart = memo(({ data }) => {
    const CustomTooltip = useCallback(({ active, payload }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                <p className="font-semibold text-gray-900 mb-2">{payload[0].payload.month}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-gray-600">{entry.name}:</span>
                        <span className="font-semibold">
                            €{Math.abs(entry.value).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                ))}
            </div>
        );
    }, []);

    return (
        <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h3 className="text-base lg:text-lg font-bold text-gray-900">Monthly Evolution</h3>
                <select className="text-xs lg:text-sm border border-gray-300 rounded-lg px-2 py-1.5 lg:px-3 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>Last 6 Months</option>
                    <option>Last 12 Months</option>
                    <option>This Year</option>
                </select>
            </div>
            <ChartWrapper heightRatio={0.55} maxHeight={260}>
                {(width, height) => (
                    <LineChart width={width} height={height + LEGEND_HEIGHT} data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '11px' }} />
                        <YAxis stroke="#6b7280" style={{ fontSize: '11px' }} tickFormatter={(v) => `€${v}`} width={45} />
                        <Tooltip content={CustomTooltip} />
                        <Legend
                            verticalAlign="bottom"
                            height={LEGEND_HEIGHT}
                            iconType="circle"
                            wrapperStyle={{ fontSize: '12px' }}
                        />
                        <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" dot={{ fill: '#10b981', r: 3 }} activeDot={{ r: 5 }} />
                        <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" dot={{ fill: '#ef4444', r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                )}
            </ChartWrapper>
        </div>
    );
});

export default MonthlyEvolutionChart;