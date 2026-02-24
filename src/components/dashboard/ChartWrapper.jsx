import { useRef, useEffect, useState } from 'react';

const ChartWrapper = ({ children, heightRatio = 0.6, maxHeight = 300 }) => {
    const ref = useRef(null);
    const [dims, setDims] = useState({ width: 500, height: 300 });
    const timerRef = useRef(null);

    useEffect(() => {
        if (!ref.current) return;
        const observer = new ResizeObserver(entries => {
            // Cancelar el timer anterior
            clearTimeout(timerRef.current);
            // Esperar 150ms antes de actualizar para evitar lag al redimensionar
            timerRef.current = setTimeout(() => {
                const { width } = entries[0].contentRect;
                setDims({ width, height: Math.min(width * heightRatio, maxHeight) });
            }, 150);
        });
        observer.observe(ref.current);
        return () => {
            observer.disconnect();
            clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <div ref={ref} className="w-full">
            {children(dims.width, dims.height)}
        </div>
    );
};

export default ChartWrapper;