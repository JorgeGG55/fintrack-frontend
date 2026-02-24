import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center">
                <div className="mb-6">
                    <span className="text-7xl sm:text-9xl">😕</span>
                </div>
                <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-3">404</h1>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-3">
                    Página no encontrada
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-md mx-auto">
                    Lo sentimos, la página que buscas no existe o ha sido movida.
                </p>
                <div className="flex gap-3 justify-center">
                    <Link to="/" className="btn btn-primary flex items-center gap-2 text-sm sm:text-base">
                        <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                        Volver al inicio
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="btn btn-secondary flex items-center gap-2 text-sm sm:text-base"
                    >
                        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        Volver atrás
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;