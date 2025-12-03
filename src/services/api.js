import axios from 'axios';

const API_URL = 'https://www.hs-service.api.crealape.com/api/v1';

// Configurar axios para enviar cookies automáticamente
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Interceptor para requests (para debugging)
api.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        console.error(' Request error:', error);
        return Promise.reject(error);
    }
);

// Interceptor para responses (para debugging)
api.interceptors.response.use(
    response => {

        return response;
    },
    error => {

        return Promise.reject(error);
    }
);

// 1. Usuarios
export const getUsers = () => api.get('/users');
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// 2. Categorías
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, name) => api.put(`/categories/${id}`, { name });
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// 3. Reportes
export const getReports = () => api.get('/services');
export const getReportById = (id) => api.get(`/services/${id}`);
export const deleteReport = (id) => api.delete(`/services/${id}`);

// 4. Evidencia
export const getEvidence = (id) => api.get(`/evidence/${id}`);
export const uploadEvidence = (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/evidence/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateReport = async (id, data) => {
    console.log('=== ENVIANDO PATCH A /review/' + id + ' ===');
    console.log('Datos:', JSON.stringify(data, null, 2));
    console.log('Tipos:', {
        amount_approved: typeof data.amount_approved,
        comment: typeof data.comment,
        status: typeof data.status
    });

    const response = await api.patch(`/review/${id}`, data, {
        headers: {
            'Content-Type': 'application/json',
        }
    });

    console.log('=== RESPUESTA EXITOSA ===');
    console.log('Status:', response.status);
    console.log('Data:', response.data);

    return response;
};

// 6. Roles
export const getRoles = () => api.get('/roles');
export const getRoleById = (id) => api.get(`/roles/${id}`);

// 7. Escuelas
export const getSchools = () => api.get('/schools');
export const getSchoolById = (id) => api.get(`/schools/${id}`);

// 8. Exportar api instance por si se necesita
export { api };

// 9. Exportación por defecto
export default {
    // Usuarios
    getUsers,
    createUser,
    updateUser,
    deleteUser,

    // Categorías
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,

    // Reportes
    getReports,
    getReportById,
    updateReport,
    deleteReport,

    // Evidencia
    getEvidence,
    uploadEvidence,

    // Roles
    getRoles,
    getRoleById,

    // Escuelas
    getSchools,
    getSchoolById,

    // Instancia de axios
    api
};