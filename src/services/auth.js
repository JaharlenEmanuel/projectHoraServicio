import axios from 'axios';

const API_URL = 'https://www.hs-service.api.crealape.com/api/v1';

// Configurar axios para enviar cookies automáticamente
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// === FUNCIONES DE AUTENTICACIÓN ===

// 1. Login - MODIFICADO para guardar rol
export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });

    // Después de login exitoso, obtener perfil y guardar rol
    try {
        const profileResponse = await getProfile();
        const user = profileResponse.data;

        // Extraer y normalizar el rol
        const roleName = user.role?.name || user.role || user.role_name || 'user';
        const normalizedRole = roleName.toLowerCase();

        // Guardar en localStorage
        localStorage.setItem('user_role', normalizedRole);
        localStorage.setItem('user_data', JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name || user.email,
            role: normalizedRole
        }));

        // También guardar timestamp para expiración opcional
        localStorage.setItem('login_timestamp', new Date().getTime().toString());

    } catch (error) {
        console.warn('No se pudo obtener el perfil después del login:', error);
    }

    return response;
};

// 2. Obtener perfil - MODIFICADO para guardar rol si no existe
export const getProfile = async () => {
    try {
        const response = await api.get('/auth/profile');
        const user = response.data;

        // Extraer y normalizar el rol
        const roleName = user.role?.name || user.role || user.role_name || 'user';
        const normalizedRole = roleName.toLowerCase();

        // Guardar en localStorage si no existe o si cambió
        const currentRole = localStorage.getItem('user_role');
        if (!currentRole || currentRole !== normalizedRole) {
            localStorage.setItem('user_role', normalizedRole);
            localStorage.setItem('user_data', JSON.stringify({
                id: user.id,
                email: user.email,
                name: user.name || user.email,
                role: normalizedRole
            }));
        }

        return response;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

// 3. Cambiar contraseña
export const changePassword = async (oldPassword, newPassword) => {
    try {
        console.log('Sending password change request:', { oldPassword, newPassword });

        const response = await api.put('/auth/change-password', {
            old_password: oldPassword,
            new_password: newPassword
        });

        console.log('Password change successful:', response.data);
        return response;
    } catch (error) {
        console.error('Error changing password:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw error;
    }
};

// 4. Función para verificar autenticación - MODIFICADA para usar localStorage primero
export const checkAuth = async (skipApiCheck = false) => {
    // Primero verificar localStorage
    const userRole = localStorage.getItem('user_role');
    const userDataStr = localStorage.getItem('user_data');

    if (userRole && userDataStr) {
        const userData = JSON.parse(userDataStr);

        // Verificar expiración opcional (8 horas)
        const loginTimestamp = localStorage.getItem('login_timestamp');
        if (loginTimestamp) {
            const hoursSinceLogin = (new Date().getTime() - parseInt(loginTimestamp)) / (1000 * 60 * 60);
            if (hoursSinceLogin > 8) {
                console.log('Sesión expirada (más de 8 horas)');
                clearUserData();
                return { isAuthenticated: false, isAdmin: false, user: null };
            }
        }

        if (skipApiCheck) {
            // Si se salta la verificación de API, usar datos de localStorage
            const isAdmin = userRole === 'admin';
            return {
                isAuthenticated: true,
                isAdmin,
                user: userData,
                fromCache: true
            };
        }
    }

    // Si no hay datos en localStorage o se requiere verificación de API
    try {
        const response = await api.get('/auth/profile');
        const user = response.data;

        // Verificar diferentes formas en que podría venir el rol
        const roleName = user.role?.name || user.role || user.role_name || 'user';
        const normalizedRole = roleName.toLowerCase();
        const isAdmin = normalizedRole === 'admin';

        // Guardar en localStorage
        localStorage.setItem('user_role', normalizedRole);
        localStorage.setItem('user_data', JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name || user.email,
            role: normalizedRole
        }));
        localStorage.setItem('login_timestamp', new Date().getTime().toString());

        return {
            isAuthenticated: true,
            isAdmin,
            user: {
                ...user,
                role: normalizedRole
            }
        };
    } catch (error) {
        // Si hay error en la API, limpiar localStorage
        clearUserData();
        return { isAuthenticated: false, isAdmin: false, user: null };
    }
};

// 5. Obtener rol desde localStorage (sincrónico, rápido)
export const getStoredRole = () => {
    return localStorage.getItem('user_role') || null;
};

// 6. Obtener datos de usuario desde localStorage
export const getStoredUser = () => {
    return userDataStr ? JSON.parse(userDataStr) : null;
};

// 7. Limpiar datos de usuario
export const clearUserData = () => {
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_data');
    localStorage.removeItem('login_timestamp');
};

// 8. Logout - MODIFICADO para limpiar localStorage
export const logout = async () => {
    try {
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_data');
        localStorage.removeItem('login_timestamp');
        // Intentar logout en el backend
        await api.post('/auth/logout');
    } catch (error) {
        console.warn('Error en logout del backend:', error);
    } finally {
        // Siempre limpiar localStorage
        clearUserData();
    }
    return Promise.resolve();
};

// 9. Verificar si el usuario es admin (sincrónico)
export const isAdmin = () => {
    const role = getStoredRole();
    return role === 'admin';
};

// 10. Verificar si el usuario es estudiante (sincrónico)
export const isStudent = () => {
    const role = getStoredRole();
    return role === 'student' || role === 'user' || !role;
};

export default api;