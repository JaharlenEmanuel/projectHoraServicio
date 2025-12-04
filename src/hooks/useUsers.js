import { useState, useEffect, useCallback } from 'react';
import { getUsers, createUser, updateUser, getRoles, getSchools, api } from '../services/api';
import { getProfile } from '../services/auth';

export const useUsers = () => {
    // Estados principales
    const [users, setUsers] = useState([]);
    const [students, setStudents] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    // Estados para filtros y paginación
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [paginatedUsers, setPaginatedUsers] = useState([]);

    // Estados para datos de referencia
    const [roles, setRoles] = useState([]);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [schools, setSchools] = useState([]);

    // Estados de UI
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Función para cargar todos los datos
    const fetchData = async () => {
        try {
            setLoading(true);

            // Cargar datos en paralelo
            const [usersRes, rolesRes, schoolsRes, studentsRes] = await Promise.all([
                getUsers(),
                getRoles(),
                getSchools(),
                api.get('/students')
            ]);

            console.log("Datos cargados:", {
                usuarios: usersRes.data,
                estudiantes: studentsRes.data,
                roles: rolesRes.data,
                escuelas: schoolsRes.data
            });

            // Filtrar usuarios regulares: solo admin y student
            const adminStudentUsers = usersRes.data.filter(user => {
                const roleName = user.role?.name?.toLowerCase();
                return roleName === 'admin' || roleName === 'student';
            });

            // Procesar estudiantes del endpoint específico
            const processedStudents = studentsRes.data.map(student => ({
                ...student,
                role: { name: 'Student', id: 2 },
                f_name: student.first_name || student.f_name || '',
                f_lastname: student.last_name || student.f_lastname || '',
                s_lastname: student.second_lastname || student.s_lastname || '',
                school_id: student.school_id || student.school?.id || student.school
            }));

            // Guardar estados
            setUsers(adminStudentUsers);
            setStudents(processedStudents);

            // Combinar usuarios regulares con estudiantes
            const combinedUsers = [...adminStudentUsers, ...processedStudents];
            setAllUsers(combinedUsers);
            setFilteredUsers(combinedUsers);
            setPaginatedUsers(combinedUsers.slice(0, usersPerPage)); // Primera página por defecto

            // Filtrar roles: solo admin y student
            const adminStudentRoles = rolesRes.data.filter(role => {
                const roleName = role.name?.toLowerCase();
                return roleName === 'admin' || roleName === 'student';
            });

            setRoles(adminStudentRoles);
            setFilteredRoles(adminStudentRoles);
            setSchools(schoolsRes.data);
            setError(null);

            // Calcular total de páginas
            const total = Math.ceil(combinedUsers.length / usersPerPage);
            setTotalPages(total || 1);
            setCurrentPage(1); // Resetear a página 1

        } catch (err) {
            console.error('Error cargando datos:', err);
            setError(`Error cargando datos: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Función para cargar el usuario actual
    const fetchCurrentUser = async () => {
        try {
            const response = await getProfile();
            setCurrentUser(response.data);
        } catch (err) {
            console.error('Error obteniendo perfil:', err);
        }
    };

    // Función para aplicar paginación
    const applyPagination = useCallback(() => {
        const indexOfLastUser = currentPage * usersPerPage;
        const indexOfFirstUser = indexOfLastUser - usersPerPage;
        const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

        setPaginatedUsers(currentUsers);

        // Calcular total de páginas
        const total = Math.ceil(filteredUsers.length / usersPerPage);
        setTotalPages(total || 1);
    }, [filteredUsers, currentPage, usersPerPage]);

    // Aplicar paginación cuando cambian los filtros o la página
    useEffect(() => {
        applyPagination();
    }, [applyPagination]);

    // Función para cambiar de página
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Función para filtrar usuarios
    const filterUsers = (searchTerm = '', roleFilter = 'all') => {
        const filtered = allUsers.filter(user => {
            // Búsqueda por nombre, apellido o email
            const matchesSearch = searchTerm === '' ||
                user.f_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.f_lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${user.f_name} ${user.f_lastname} ${user.s_lastname}`.toLowerCase().includes(searchTerm.toLowerCase());

            // Filtro por rol
            const matchesRole = roleFilter === 'all' ||
                user.role?.name?.toLowerCase() === roleFilter;

            return matchesSearch && matchesRole;
        });

        setFilteredUsers(filtered);
        setCurrentPage(1); // Resetear a página 1 al filtrar
    };

    // Función para crear usuario
    const handleCreateUser = async (userData) => {
        try {
            setLoading(true);
            await createUser(userData);
            await fetchData(); // Recargar datos
            return { success: true, message: 'Usuario creado exitosamente' };
        } catch (err) {
            console.error('Error creando usuario:', err);
            return {
                success: false,
                message: err.response?.data?.message || 'Error al crear usuario'
            };
        } finally {
            setLoading(false);
        }
    };

    // Función para actualizar usuario
    const handleUpdateUser = async (userId, userData) => {
        try {
            setLoading(true);
            const updateData = {
                f_name: userData.f_name?.trim() || '',
                f_lastname: userData.f_lastname?.trim() || '',
                s_lastname: userData.s_lastname?.trim() || ''
            };

            console.log('Actualizando usuario ID:', userId);
            console.log('Datos enviados:', updateData);

            const response = await updateUser(userId, updateData);
            console.log('Respuesta de la API:', response.data);

            await fetchData(); // Recargar datos
            return {
                success: true,
                message: 'Usuario actualizado exitosamente',
                data: response.data
            };
        } catch (err) {
            console.error('Error actualizando usuario:', err);

            let errorMessage = 'Error al actualizar usuario';
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.response?.status === 401) {
                errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
            } else if (err.response?.status === 403) {
                errorMessage = 'No tienes permisos para realizar esta acción.';
            } else if (err.response?.status === 404) {
                errorMessage = 'Usuario no encontrado.';
            } else if (err.response?.status === 422) {
                errorMessage = 'Datos inválidos. Verifica la información.';
            }

            return {
                success: false,
                message: errorMessage,
                error: err.response?.data,
                status: err.response?.status
            };
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener información de escuela
    const getSchoolInfo = async (schoolId) => {
        if (!schoolId) return null;

        try {
            // Buscar en cache primero
            const cachedSchool = schools.find(s => s.id === schoolId);
            if (cachedSchool) return cachedSchool;

            // Si no está en cache, hacer fetch
            const response = await api.get(`/schools/${schoolId}`);
            return response.data;
        } catch (err) {
            console.error(`Error obteniendo escuela ${schoolId}:`, err);
            return null;
        }
    };

    // Función para obtener estudiantes por escuela
    const getStudentsBySchool = (schoolId) => {
        return students.filter(student => student.school_id === schoolId);
    };

    // Función para cambiar cantidad de usuarios por página
    const handleUsersPerPageChange = (newPerPage) => {
        setUsersPerPage(newPerPage);
        setCurrentPage(1); // Resetear a página 1
    };

    // Cargar datos iniciales
    useEffect(() => {
        fetchData();
        fetchCurrentUser();
    }, []);

    return {
        // Estados principales
        users: allUsers,
        students,

        // Estados para tabla
        filteredUsers: paginatedUsers, // Usuarios paginados para mostrar
        allFilteredUsers: filteredUsers, // Todos los usuarios filtrados (sin paginar)

        // Datos de referencia
        roles: filteredRoles,
        schools,
        currentUser,

        // Estados de UI
        loading,
        error,

        // Paginación
        currentPage,
        usersPerPage,
        totalUsers: filteredUsers.length, // Total de usuarios filtrados (para paginación)
        totalPages,

        // Acciones principales
        fetchData,
        handleCreateUser,
        handleUpdateUser,
        filterUsers,

        // Acciones de paginación
        handlePageChange,
        handleUsersPerPageChange,
        setCurrentPage,

        // Funciones auxiliares
        getSchoolInfo,
        getStudentsBySchool,

        // Funciones para debug
        getFilteredUsersCount: () => filteredUsers.length,
        getAllUsersCount: () => allUsers.length
    };
};