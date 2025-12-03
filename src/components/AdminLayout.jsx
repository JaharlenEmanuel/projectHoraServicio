import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { checkAuth } from '../services/auth';

const AdminLayout = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const verifyAuth = async () => {
            setLoading(true);
            try {
                console.log('Verifying authentication for admin...');

                // Primero verificamos la autenticación
                const authData = await checkAuth();
                const { isAuthenticated, isAdmin, user } = authData;

                console.log('Auth result:', { isAuthenticated, isAdmin, user });

                if (!isAuthenticated) {
                    console.log('Not authenticated, redirecting to login');
                    navigate('/login', { replace: true });
                    return;
                }

                if (!isAdmin) {
                    console.log('User is not admin:', user);
                    setAuthError('No tienes permisos de administrador');
                    setLoading(false);
                    return;
                }

                // Si tenemos usuario pero queremos datos más actualizados
                if (user) {
                    setUser(user);
                } else {
                    // Intentamos obtener perfil
                    const profileResult = await getProfile();
                    if (profileResult.success) {
                        setUser(profileResult.user);
                    } else {
                        setUser(authData.user);
                    }
                }

                setAuthError('');
            } catch (error) {
                console.error('Error de autenticación:', error);
                navigate('/login', { replace: true });
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, [navigate, location.pathname]);

    const handleLogout = () => {
        authLogout();
    };

    const menuItems = [
        { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/admin/users', icon: '👥', label: 'Usuarios' },
        { path: '/admin/reports', icon: '📋', label: 'Reportes' },
        { path: '/admin/categories', icon: '📂', label: 'Categorías' },
        { path: '/admin/profile', icon: '👤', label: 'Mi Perfil' },
    ];

    const isActive = (path) => location.pathname.startsWith(path);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-700">Verificando autenticación...</p>
                    <p className="text-sm text-gray-500 mt-2">Esperando respuesta del servidor</p>
                </div>
            </div>
        );
    }

    if (authError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
                    <div className="text-red-500 text-5xl mb-4 text-center">⛔</div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Acceso Restringido</h2>
                    <p className="text-gray-600 text-center mb-6">{authError}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Volver al Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold">F</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">FUNVAL Admin</h2>
                            <p className="text-xs text-gray-500">Horas de Servicio</p>
                        </div>
                    </div>

                    <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium text-gray-800 truncate">{user?.name || 'Administrador'}</p>
                        <p className="text-xs text-gray-600 truncate">{user?.email || 'admin@funval.com'}</p>
                        <div className="flex items-center mt-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-xs text-green-600 font-medium">Conectado</span>
                        </div>
                    </div>
                </div>

                <nav className="p-4 flex-1">
                    <p className="text-xs uppercase text-gray-400 font-semibold mb-3 px-3">Menú Principal</p>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-3 py-3 mb-1 rounded-lg transition-all ${isActive(item.path)
                                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-500'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <span className="text-xl mr-3">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                            {isActive(item.path) && (
                                <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                        </Link>
                    ))}

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <span className="text-xl mr-3">🚪</span>
                            <span className="font-medium">Cerrar Sesión</span>
                        </button>
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <p className="text-xs text-center text-gray-500">© 2024 FUNVAL • v1.0.0</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex justify-between items-center px-6 py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
                            </h1>
                            <p className="text-gray-600">Panel de control administrativo</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                                <span className="text-xl">🔔</span>
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                            </button>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800 truncate max-w-xs">{user?.name || 'Admin'}</p>
                                    <p className="text-xs text-gray-500">Administrador</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-gray-50 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;