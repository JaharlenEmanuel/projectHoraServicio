import axios from 'axios';

const API_URL = 'https://www.hs-service.api.crealape.com/api/v1';

// Configurar axios para enviar cookies automáticamente
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// === FUNCIONES DE AUTENTICACIÓN ===

// 1. Login
export const login = (email, password) =>
    api.post('/auth/login', { email, password });

// 2. Obtener perfil
export const getProfile = () =>
    api.get('/auth/profile');

// 3. Cambiar contraseña
export const changePassword = (oldPassword, newPassword) =>
    api.put('/auth/change-password', {
        old_password: oldPassword,
        new_password: newPassword
    });

// 4. Función para verificar autenticación
export const checkAuth = async () => {
    try {
        const response = await getProfile();

        const user = response.data;

        // Verifica diferentes formas en que podría venir el rol
        const roleName = user.role?.name || user.role || user.role_name || 'user';

        const isAdmin = roleName === 'admin' || roleName === 'Admin' || roleName === 'ADMIN';

        return { isAuthenticated: true, isAdmin, user };
    } catch (error) {
        return { isAuthenticated: false, isAdmin: false, user: null };
    }
};

export const logout = () => {

    return Promise.resolve();
};