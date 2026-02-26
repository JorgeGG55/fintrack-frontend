import { X } from 'lucide-react';

const TransactionFiltersModal = ({ isOpen, onClose, filters, setFilters, categories, onClear }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center h-full p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white w-full sm:max-w-md rounded-2xl sm:rounded-2xl p-6 z-10 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Filtros</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoría</label>
                        <select
                            className="w-full py-2.5 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c.name}>{c.icon} {c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { value: '', label: 'Todos' },
                                { value: 'income', label: 'Ingresos' },
                                { value: 'expense', label: 'Gastos' },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setFilters({ ...filters, type: option.value })}
                                    className={`py-2 px-3 text-sm rounded-lg border transition-colors ${filters.type === option.value
                                        ? 'bg-primary-50 border-primary-500 text-primary-700 font-medium'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Rango de fechas</label>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Desde</p>
                                <input
                                    type="date"
                                    className="w-full py-2 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Hasta</p>
                                <input
                                    type="date"
                                    className="w-full py-2 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    value={filters.endDate}
                                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClear}
                        className="flex-1 py-2.5 px-4 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Limpiar
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 px-4 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Aplicar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionFiltersModal;