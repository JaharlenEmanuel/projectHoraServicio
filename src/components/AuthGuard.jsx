// components/SimpleAuthGuard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkAuth } from '../services/auth';

const SimpleAuthGuard = ({ children, requiredRole = null }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            try {
                const { isAuthenticated, isAdmin } = await checkAuth();

                if (!isAuthenticated) {
                    navigate('/login', { replace: true });
                    return;
                }

                if (requiredRole === 'admin' && !isAdmin) {
                    setError('No tienes permisos de administrador');
                } else if (requiredRole === 'student' && isAdmin) {
                    setError('Los administradores no pueden acceder a esta sección');
                }
            } catch (err) {
                navigate('/login', { replace: true });
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [navigate, requiredRole]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
                    <div className="text-red-500 text-5xl mb-4 text-center">⛔</div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Acceso Restringido</h2>
                    <p className="text-gray-600 text-center mb-6">{error}</p>
                    <button
                        onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/servicios')}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Ir a mi área correspondiente
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

export default SimpleAuthGuard;