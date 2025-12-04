import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, getRoles, getSchools, api } from '../services/api';
import { getProfile } from '../services/auth';

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [students, setStudents] = useState([]); // Nuevo estado para estudiantes
    const [allUsers, setAllUsers] = useState([]); // Usuarios combinados
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [schools, setSchools] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Cargar datos en paralelo
            const [usersRes, rolesRes, schoolsRes, studentsRes] = await Promise.all([
                getUsers(),
                getRoles(),
                getSchools(),
                // Cargar estudiantes desde el endpoint específico
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
                role: { name: 'Student', id: 2 }, // Asignar rol student
                f_name: student.first_name || student.f_name || '',
                f_lastname: student.last_name || student.f_lastname || '',
                s_lastname: student.second_lastname || student.s_lastname || '',
                // Asegurar que school_id esté disponible
                school_id: student.school_id || student.school?.id || student.school
            }));

            setUsers(adminStudentUsers);
            setStudents(processedStudents);

            // Combinar usuarios regulares con estudiantes
            const combinedUsers = [...adminStudentUsers, ...processedStudents];
            setAllUsers(combinedUsers);
            setFilteredUsers(combinedUsers);
            setCurrentPage(1);

            // Filtrar roles: solo admin y student
            const adminStudentRoles = rolesRes.data.filter(role => {
                const roleName = role.name?.toLowerCase();
                return roleName === 'admin' || roleName === 'student';
            });

            setRoles(adminStudentRoles);
            setFilteredRoles(adminStudentRoles);
            setSchools(schoolsRes.data);
            setError(null);
        } catch (err) {
            console.error('Error cargando datos:', err);
            setError(`Error cargando datos: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const response = await getProfile();
            setCurrentUser(response.data);
        } catch (err) {
            console.error('Error obteniendo perfil:', err);
        }
    };

    const handleCreateUser = async (userData) => {
        try {
            setLoading(true);
            await createUser(userData);
            await fetchData();
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

            await fetchData();
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

    const filterUsers = (searchTerm = '', roleFilter = 'all') => {
        const filtered = allUsers.filter(user => {
            const matchesSearch = searchTerm === '' ||
                user.f_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.f_lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole = roleFilter === 'all' ||
                user.role?.name?.toLowerCase() === roleFilter;

            return matchesSearch && matchesRole;
        });

        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

    // Función para obtener información detallada de una escuela
    const getSchoolInfo = async (schoolId) => {
        if (!schoolId) return null;

        try {
            const school = schools.find(s => s.id === schoolId);
            if (school) return school;

            // Si no está en cache, hacer fetch
            const response = await api.get(`/schools/${schoolId}`);
            return response.data;
        } catch (err) {
            console.error(`Error obteniendo escuela ${schoolId}:`, err);
            return null;
        }
    };

    // Función para obtener estudiantes específicos
    const getStudentsBySchool = (schoolId) => {
        return students.filter(student => student.school_id === schoolId);
    };

    // Función para cambiar de página
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Función para cambiar usuarios por página
    const handleUsersPerPageChange = (newPerPage) => {
        setUsersPerPage(newPerPage);
        setCurrentPage(1);
    };

    // Calcular usuarios para la página actual
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Calcular total de páginas
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    useEffect(() => {
        fetchData();
        fetchCurrentUser();
    }, []);

    return {
        // Estados
        users: allUsers, // Usuarios combinados
        students, // Solo estudiantes
        filteredUsers: currentUsers, // Usuarios filtrados y paginados
        roles: filteredRoles,
        schools,
        currentUser,
        loading,
        error,

        // Paginación
        currentPage,
        usersPerPage,
        totalUsers: filteredUsers.length,
        totalPages,

        // Acciones
        fetchData,
        handleCreateUser,
        handleUpdateUser,
        filterUsers,
        handlePageChange,
        handleUsersPerPageChange,
        setCurrentPage,

        // Nuevas funciones
        getSchoolInfo,
        getStudentsBySchool
    };
};