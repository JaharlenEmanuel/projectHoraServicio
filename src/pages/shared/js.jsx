import React, { useState, useEffect } from 'react';
import { getProfile, changePassword } from '../../services/auth';
import { useNavigate, useLocation } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [passwordForm, setPasswordForm] = useState({
        old: '',
        new: '',
        confirm: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState({ profile: false, password: false });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchProfile();

        // Guardar la ruta de referencia SOLO si no es la misma
        if (location.state?.from && location.state.from !== '/profile') {
            sessionStorage.setItem('previousRoute', location.state.from);
            console.log('Ruta guardada desde location.state:', location.state.from);
        }
    }, [location.state]);

    const fetchProfile = async () => {
        try {
            setLoading(prev => ({ ...prev, profile: true }));
            setMessage({ text: '', type: '' });

            // INTENTAR obtener perfil desde la API
            try {
                const response = await getProfile();
                console.log('Profile API Response:', response);

                if (response.status === 200 && response.data) {
                    const userData = response.data;

                    // Determinar el rol - USANDO user_role de localStorage
                    const userRole = localStorage.getItem('user_role') ||
                        userData.role ||
                        (userData.role_id === 1 ? 'admin' : 'student');

                    const formattedProfile = {
                        id: userData.id,
                        name: userData.name || userData.full_name || userData.username || 'Usuario',
                        email: userData.email,
                        role: userRole,
                        originalRole: userRole,
                        ...userData
                    };

                    setProfile(formattedProfile);
                    localStorage.setItem('user', JSON.stringify(formattedProfile));

                    setMessage({
                        text: '✅ Perfil cargado correctamente',
                        type: 'success'
                    });

                    setTimeout(() => {
                        setMessage({ text: '', type: '' });
                    }, 3000);
                    return;
                }
            } catch (apiError) {
                console.log('API call failed, trying localStorage:', apiError);
            }

            // SI FALLA LA API, intentar obtener de localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setProfile(parsedUser);
                    setMessage({
                        text: 'ℹ️ Mostrando datos almacenados localmente',
                        type: 'info'
                    });
                } catch (parseError) {
                    console.error('Error parsing stored user:', parseError);
                    createDefaultProfile();
                }
            } else {
                createDefaultProfile();
            }

        } catch (error) {
            console.error('Profile fetch error:', error);
            createDefaultProfile();
        } finally {
            setLoading(prev => ({ ...prev, profile: false }));
        }
    };

    const createDefaultProfile = () => {
        const defaultProfile = {
            id: 'guest-001',
            name: 'Usuario Invitado',
            email: 'invitado@ejemplo.com',
            role: 'guest',
            department: 'No asignado'
        };
        setProfile(defaultProfile);
        setMessage({
            text: '👤 Modo invitado activado. Inicia sesión para ver tu perfil completo.',
            type: 'warning'
        });
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (profile?.role === 'guest') {
            setMessage({
                text: '❌ Debes iniciar sesión para cambiar la contraseña',
                type: 'error'
            });
            return;
        }

        const validations = [
            { condition: !passwordForm.old.trim(), message: '❌ Por favor ingrese su contraseña actual' },
            { condition: !passwordForm.new.trim(), message: '❌ Por favor ingrese la nueva contraseña' },
            { condition: passwordForm.new.length < 6, message: '❌ La contraseña debe tener al menos 6 caracteres' },
            { condition: passwordForm.new !== passwordForm.confirm, message: '❌ Las contraseñas no coinciden' },
            { condition: passwordForm.old === passwordForm.new, message: '❌ La nueva contraseña debe ser diferente a la actual' }
        ];

        for (const validation of validations) {
            if (validation.condition) {
                setMessage({ text: validation.message, type: 'error' });
                return;
            }
        }

        setLoading(prev => ({ ...prev, password: true }));

        try {
            const response = await changePassword(passwordForm.old, passwordForm.new);
            console.log('Password change response:', response);

            if (response.status === 200) {
                setMessage({
                    text: '✅ Contraseña cambiada exitosamente',
                    type: 'success'
                });

                setPasswordForm({ old: '', new: '', confirm: '' });

                setTimeout(() => {
                    if (window.confirm('¿Deseas cerrar sesión para aplicar los cambios? Se recomienda iniciar sesión con tu nueva contraseña.')) {
                        handleLogout();
                    }
                }, 1500);
            } else {
                setMessage({
                    text: '❌ Error: ' + (response.data?.message || 'No se pudo cambiar la contraseña'),
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Password change error:', error);
            setMessage({
                text: '❌ Error: ' + (error.response?.data?.message || 'Error al cambiar la contraseña'),
                type: 'error'
            });
        } finally {
            setLoading(prev => ({ ...prev, password: false }));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user_role');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('previousRoute');
        window.location.href = '/login';
    };

    // Función para regresar a la página anterior - CORREGIDA
    const handleGoBack = () => {
        console.log('=== handleGoBack ejecutado ===');
        console.log('Perfil role:', profile?.role);
        console.log('LocalStorage user_role:', localStorage.getItem('user_role'));

        // Primero intentar navegar hacia atrás en el historial
        if (window.history.length > 1) {
            console.log('Navegando hacia atrás (navigate -1)');
            navigate(-1);
            return;
        }

        // Si no hay historial, determinar el rol y redirigir
        const role = profile?.role || localStorage.getItem('user_role') || 'student';
        console.log('Rol determinado para redirección:', role);

        if (role === 'admin') {
            console.log('Redirigiendo admin a /admin/dashboard');
            navigate('/admin/dashboard');
        } else {
            console.log('Redirigiendo estudiante/otros a /servicios');
            navigate('/servicios');
        }
    };

    // Función para redirigir al dashboard según el rol
    const goToDashboard = () => {
        const role = profile?.role || localStorage.getItem('user_role') || 'student';
        console.log('goToDashboard - Rol:', role);

        if (role === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/servicios');
        }
    };

    const goToLogin = () => {
        navigate('/login');
    };

    if (loading.profile && !profile) {
        return (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="text-gray-600">Cargando tu perfil...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            {/* Header con acciones */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="flex items-center">
                    {/* Botón de Regresar */}
                    <button
                        onClick={handleGoBack}
                        className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800"
                        title="Regresar"
                        aria-label="Regresar a la página anterior"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
                        <p className="text-gray-500">
                            {profile?.role === 'admin' ? 'Administrador' :
                                profile?.role === 'student' ? 'Estudiante' :
                                    profile?.role === 'guest' ? 'Usuario Invitado' : 'Usuario'}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0">
                    {profile?.role !== 'guest' ? (
                        <>
                            <button
                                onClick={goToDashboard}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                {profile?.role === 'admin' ? 'Ir al Panel Admin' : 'Ir a Servicios'}
                            </button>
                            <button
                                onClick={fetchProfile}
                                disabled={loading.profile}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {loading.profile ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                                        Actualizando...
                                    </>
                                ) : 'Actualizar'}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={goToLogin}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Iniciar Sesión
                        </button>
                    )}
                </div>
            </div>

            {/* Mensajes */}
            {message.text && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
                    message.type === 'warning' ? 'bg-yellow-50 border border-yellow-200 text-yellow-800' :
                        message.type === 'info' ? 'bg-blue-50 border border-blue-200 text-blue-800' :
                            'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                    <div className="flex items-center">
                        <span className="mr-2">
                            {message.type === 'success' ? '✅' :
                                message.type === 'warning' ? '⚠️' :
                                    message.type === 'info' ? 'ℹ️' : '❌'}
                        </span>
                        <span>{message.text}</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Información del perfil */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center mb-6">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center mr-4 ${profile?.role === 'admin' ? 'bg-purple-100' :
                            profile?.role === 'guest' ? 'bg-gray-100' : 'bg-blue-100'
                            }`}>
                            <span className={`font-bold text-xl ${profile?.role === 'admin' ? 'text-purple-600' :
                                profile?.role === 'guest' ? 'text-gray-600' : 'text-blue-600'
                                }`}>
                                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Información Personal</h2>
                            <p className="text-gray-500">Datos de tu cuenta</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="pb-3 border-b border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Nombre completo</p>
                            <p className="font-medium text-gray-800">{profile?.name || 'No disponible'}</p>
                        </div>
                        <div className="pb-3 border-b border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Correo electrónico</p>
                            <p className="font-medium text-gray-800">{profile?.email || 'No disponible'}</p>
                        </div>
                        <div className="pb-3 border-b border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Rol en el sistema</p>
                            <p className="font-medium text-gray-800">
                                {profile?.role === 'admin' ? 'Administrador' :
                                    profile?.role === 'Student' ? 'Estudiante' :
                                        profile?.role === 'guest' ? 'Usuario Invitado' : 'Usuario'}
                            </p>
                        </div>

                        {profile?.department && profile.department !== 'No asignado' && (
                            <div className="pb-3 border-b border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Departamento</p>
                                <p className="font-medium text-gray-800">{profile.department}</p>
                            </div>
                        )}

                        {profile?.StudentId && (
                            <div className="pb-3 border-b border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Matrícula</p>
                                <p className="font-medium text-gray-800">{profile.StudentId}</p>
                            </div>
                        )}

                        <div>
                            <p className="text-sm text-gray-500 mb-1">ID de usuario</p>
                            <p className="font-medium text-gray-800 font-mono">{profile?.id || 'No disponible'}</p>
                        </div>
                    </div>
                </div>

                {/* Cambio de contraseña - Solo mostrar si NO es guest */}
                {profile?.role !== 'guest' ? (
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Cambiar Contraseña</h2>
                        <p className="text-gray-500 mb-6">Por seguridad, tu contraseña debe tener al menos 6 caracteres.</p>

                        <form onSubmit={handlePasswordChange} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña Actual
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.old}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, old: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    required
                                    disabled={loading.password}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    readOnly onFocus={(e) => e.target.removeAttribute('readonly')}
                                    id="current-password-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nueva Contraseña
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.new}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    required
                                    disabled={loading.password}
                                    placeholder="Mínimo 6 caracteres"
                                    minLength="6"
                                    autoComplete="new-password"
                                    id="new-password-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirmar Nueva Contraseña
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.confirm}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    required
                                    disabled={loading.password}
                                    placeholder="Repite la nueva contraseña"
                                    minLength="6"
                                    autoComplete="new-password"
                                    id="confirm-password-field"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading.password}
                                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {loading.password ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Cambiando contraseña...
                                    </div>
                                ) : 'Cambiar Contraseña'}
                            </button>
                        </form>

                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setPasswordForm({ old: '', new: '', confirm: '' })}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={loading.password}
                            >
                                Limpiar formulario
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="text-center py-8">
                            <div className="text-5xl mb-4 text-gray-400">🔒</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Funcionalidad Restringida</h2>
                            <p className="text-gray-600 mb-6">
                                Para cambiar tu contraseña y acceder a todas las funciones, necesitas iniciar sesión.
                            </p>
                            <button
                                onClick={goToLogin}
                                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                            >
                                Iniciar Sesión
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;