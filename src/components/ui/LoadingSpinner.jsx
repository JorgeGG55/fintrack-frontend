const LoadingSpinner = ({ size = 'lg' }) => {
    const sizes = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className="flex items-center justify-center h-96">
            <div className={`animate-spin rounded-full border-b-2 border-primary-500 ${sizes[size]}`} />
        </div>
    );
};

export default LoadingSpinner;