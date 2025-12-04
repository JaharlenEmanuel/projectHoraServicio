import React, { useState, useEffect } from 'react';
import { getProfile, changePassword } from '../../services/auth';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [passwordForm, setPasswordForm] = useState({
        old: '',
        new: '',
        confirm: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const result = await getProfile();
            if (result.success) {
                setProfile(result.user);
            } else {
                setMessage('❌ Error: ' + result.error);
                // Intentar obtener de localStorage como fallback
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setProfile(JSON.parse(storedUser));
                }
            }
        } catch (error) {
            console.error('Profile fetch error:', error);
            setMessage('❌ Error cargando perfil');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage('');

        // Validaciones
        if (!passwordForm.old.trim()) {
            setMessage('❌ Por favor ingrese su contraseña actual');
            return;
        }

        if (!passwordForm.new.trim()) {
            setMessage('❌ Por favor ingrese la nueva contraseña');
            return;
        }

        if (passwordForm.new !== passwordForm.confirm) {
            setMessage('❌ Las contraseñas no coinciden');
            return;
        }

        if (passwordForm.new.length < 6) {
            setMessage('❌ La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const result = await changePassword(passwordForm.old, passwordForm.new);

            if (result.success) {
                setMessage('✅ Contraseña cambiada exitosamente');
                setPasswordForm({ old: '', new: '', confirm: '' });
            } else {
                setMessage('❌ Error: ' + result.error);
            }
        } catch (error) {
            console.error('Password change error:', error);
            setMessage('❌ Error al cambiar la contraseña');
        } finally {
            setLoading(false);
        }
    };

    if (!profile && loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!profile && !loading) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">No se pudo cargar el perfil</p>
                <button
                    onClick={fetchProfile}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Información del perfil */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Información Personal</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-gray-600">Nombre:</p>
                            <p className="font-medium">{profile.name || 'No disponible'}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Email:</p>
                            <p className="font-medium">{profile.email || 'No disponible'}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Rol:</p>
                            <p className="font-medium">
                                {profile.role?.name ||
                                    profile.type === 'admin' ? 'Administrador' :
                                    profile.role_id === 1 ? 'Administrador' :
                                        'Usuario'}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">ID de usuario:</p>
                            <p className="font-medium">{profile.id || 'No disponible'}</p>
                        </div>
                    </div>
                </div>

                {/* Cambio de contraseña */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Cambiar Contraseña</h2>

                    {message && (
                        <div className={`p-3 rounded mb-4 ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handlePasswordChange}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Contraseña Actual</label>
                            <input
                                type="password"
                                value={passwordForm.old}
                                onChange={(e) => setPasswordForm({ ...passwordForm, old: e.target.value })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                disabled={loading}
                                placeholder="Ingrese su contraseña actual"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Nueva Contraseña</label>
                            <input
                                type="password"
                                value={passwordForm.new}
                                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                disabled={loading}
                                placeholder="Mínimo 6 caracteres"
                                minLength="6"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Confirmar Nueva Contraseña</label>
                            <input
                                type="password"
                                value={passwordForm.confirm}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                disabled={loading}
                                placeholder="Confirme la nueva contraseña"
                                minLength="6"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Cambiando...
                                </>
                            ) : 'Cambiar Contraseña'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;