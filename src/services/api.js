import axios from 'axios';

const API_URL = 'https://www.hs-service.api.crealape.com/api/v1';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Interceptor para agregar token si es necesario
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Interceptor para responses
api.interceptors.response.use(
    response => response,
    error => {
        console.error('Response error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// ===== FUNCIONES NUEVAS Y ACTUALIZADAS =====

// 1. Obtener servicios del usuario actual (estudiante)
export const getMyServices = () => api.get('/services');

// 2. Obtener servicios por estudiante específico (para admin)
export const getStudentServices = (studentId) => api.get(`/services/student/${studentId}`);

// 3. Crear servicio
export const createService = async (serviceData) => {
    const formData = new FormData();

    // Agregar campos al formData
    Object.keys(serviceData).forEach(key => {
        if (key === 'evidencia' && serviceData[key]) {
            formData.append('file', serviceData[key]);
        } else if (serviceData[key]) {
            formData.append(key, serviceData[key]);
        }
    });

    const response = await api.post('/services', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// 4. Actualizar servicio
export const updateService = (id, serviceData) => api.put(`/services/${id}`, serviceData);

// 5. Obtener estadísticas del estudiante
export const getStudentStats = () => api.get('/services/me/stats');

// 6. Exportar servicios a PDF/Excel
export const exportServices = (format = 'pdf') =>
    api.get(`/services/export?format=${format}`, { responseType: 'blob' });

// 7. Obtener detalles completos de un servicio
export const getServiceDetails = (id) => api.get(`/services/${id}/details`);

// ===== FUNCIONES EXISTENTES =====

// Usuarios
export const getUsers = () => api.get('/users');
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Categorías
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories/', data);
export const updateCategory = (id, name) => api.put(`/categories/${id}`, { name });
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Reportes (todos los servicios para admin)
export const getReports = () => api.get('/services');
export const getReportById = (id) => api.get(`/services/${id}`);
export const deleteReport = (id) => api.delete(`/services/${id}`);

// Evidencia
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

    const response = await api.patch(`/review/${id}`, data, {
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return response;
};

// Roles
export const getRoles = () => api.get('/roles');
export const getRoleById = (id) => api.get(`/roles/${id}`);

// Escuelas
export const getSchools = () => api.get('/schools');
export const getSchoolById = (id) => api.get(`/schools/${id}`);

// Obtener perfil del usuario actual
export const getMyProfile = () => api.get('/auth/profile');

export { api };

// Exportación por defecto
export default {
    // Servicios del estudiante
    getMyServices,
    getStudentServices,
    createService,
    updateService,
    getStudentStats,
    exportServices,
    getServiceDetails,

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

    // Perfil
    getMyProfile,

    // Instancia de axios
    api
};