const SKELETONS = {
    recentTransactions: () => (
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
    ),
    dashboard: () => (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100 animate-pulse">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {[1, 2].map(i => (
                    <div key={i} className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100 animate-pulse h-64 lg:h-80">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
                        <div className="h-48 bg-gray-100 rounded-lg"></div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-xl p-4 lg:p-5 border border-gray-100 animate-pulse">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                            <div className="flex-1">
                                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full"></div>
                    </div>
                ))}
            </div>
        </>
    ),

    transactions: () => (
        <>
            <div className="bg-white rounded-xl p-4 animate-pulse space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-8 bg-gray-100 rounded-lg"></div>)}
            </div>
            <div className="bg-white rounded-xl p-4 space-y-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="h-9 w-9 bg-gray-200 rounded-lg shrink-0"></div>
                        <div className="flex-1 space-y-1.5">
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                        </div>
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        </>
    ),

    budgets: () => (
        <>
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
        </>
    ),
};

const GeneratingState = ({ page, message }) => {
    const SkeletonLayout = SKELETONS[page];

    return (
        <div className="space-y-4 lg:space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 shrink-0"></div>
                <div>
                    <p className="font-medium text-blue-900 text-sm lg:text-base">
                        {message || 'Generating your demo data...'}
                    </p>
                    <p className="text-xs lg:text-sm text-blue-600">
                        This may take up to a minute. The page will refresh automatically.
                    </p>
                </div>
            </div>
            {SkeletonLayout && <SkeletonLayout />}
        </div>
    );
};

GeneratingState.Skeleton = ({ page }) => {
    const SkeletonLayout = SKELETONS[page];
    return SkeletonLayout ? <SkeletonLayout /> : null;
};

export default GeneratingState;