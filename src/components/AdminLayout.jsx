import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { checkAuth, logout, getProfile } from '../services/auth';

const AdminLayout = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Nuevo estado para sidebar móvil
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const verifyAuth = async () => {
            setLoading(true);
            try {
                // ... (código existente de verificación de auth) ...
                console.log('Verifying authentication for admin...');

                // Verificar autenticación usando checkAuth
                const authData = await checkAuth();
                const { isAuthenticated, isAdmin, user } = authData;

                if (!isAuthenticated) {
                    navigate('/login', { replace: true });
                    return;
                }

                if (!isAdmin) {
                    setAuthError('No tienes permisos de administrador');
                    setLoading(false);
                    return;
                }

                if (user) {
                    setUser(user);
                    localStorage.setItem('user', JSON.stringify(user));
                } else {
                    try {
                        const profileResponse = await getProfile();
                        if (profileResponse.data) {
                            const userData = profileResponse.data;
                            setUser(userData);
                            localStorage.setItem('user', JSON.stringify(userData));
                        }
                    } catch (profileError) {
                        console.error('Error getting profile:', profileError);
                        if (authData.user) {
                            setUser(authData.user);
                        }
                    }
                }
                setAuthError('');
            } catch (error) {
                console.error('Error de autenticación completo:', error);
                localStorage.removeItem('user');
                sessionStorage.clear();
                navigate('/login', { replace: true });
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, [navigate, location.pathname]);

    // Cerrar sidebar al cambiar de ruta en móvil
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_data');
            localStorage.removeItem('login_timestamp');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const menuItems = [
        { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/admin/users', icon: '👥', label: 'Usuarios' },
        { path: '/admin/reports', icon: '📋', label: 'Reportes' },
        { path: '/admin/categories', icon: '📂', label: 'Categorías' },
        { path: '/profile', icon: '👤', label: 'Mi Perfil' },
    ];

    const isActive = (path) => {
        if (path === '/profile') {
            return location.pathname === '/profile';
        }
        return location.pathname.startsWith(path);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-700">Verificando autenticación...</p>
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
                    <button onClick={() => navigate('/login')} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Volver al Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed lg:static inset-y-0 left-0 z-30
                    w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold">F</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">FUNVAL Admin</h2>
                            <p className="text-xs text-gray-500">Horas de Servicio</p>
                        </div>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-3 bg-blue-50 mx-4 mt-4 rounded-lg">
                    <p className="font-medium text-gray-800 truncate">{user?.name || 'Administrador'}</p>
                    <p className="text-xs text-gray-600 truncate">{user?.email || 'admin@funval.com'}</p>
                    <div className="flex items-center mt-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-xs text-green-600 font-medium">Conectado</span>
                    </div>
                </div>

                <nav className="p-4 flex-1 overflow-y-auto">
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
                            className="flex items-center w-full px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                        >
                            <span className="font-medium">Cerrar Sesión</span>
                        </button>
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <p className="text-xs text-center text-gray-500">© 2025 FUNVAL</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex justify-between items-center px-4 md:px-6 py-4">
                        <div className="flex items-center">
                            {/* Hamburger Menu Button */}
                            <button
                                className="mr-4 lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-800 truncate">
                                    {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-linear-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="hidden md:block">
                                <p className="font-medium text-gray-800 truncate max-w-xs">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-gray-500">Administrador</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;