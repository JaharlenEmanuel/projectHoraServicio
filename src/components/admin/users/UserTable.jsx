import React, { useState, useEffect } from 'react';
import { useUsers } from '../../../hooks/useUsers';

const UserTable = ({ onEditClick }) => {
    const {
        filteredUsers,
        schools,
        loading,
        getSchoolInfo,
        currentPage,
        totalPages,
        handlePageChange,
        usersPerPage,
        totalUsers
    } = useUsers();

    const [schoolNames, setSchoolNames] = useState({});
    const [loadingSchools, setLoadingSchools] = useState(false);

    // Cargar nombres de escuelas
    useEffect(() => {
        const loadSchoolNames = async () => {
            const schoolIds = [...new Set(
                filteredUsers
                    .filter(user => user.school_id)
                    .map(user => user.school_id)
            )];

            if (schoolIds.length === 0) return;

            setLoadingSchools(true);
            const names = {};

            for (const schoolId of schoolIds) {
                try {
                    const schoolInfo = await getSchoolInfo(schoolId);
                    if (schoolInfo) {
                        names[schoolId] = schoolInfo.name || `Escuela ${schoolId}`;
                    }
                } catch (error) {
                    console.error(`Error cargando escuela ${schoolId}:`, error);
                    names[schoolId] = `Escuela ${schoolId}`;
                }
            }

            setSchoolNames(names);
            setLoadingSchools(false);
        };

        loadSchoolNames();
    }, [filteredUsers]);

    const getSchoolName = (schoolId) => {
        if (!schoolId) return 'No asignada';
        if (schoolNames[schoolId]) return schoolNames[schoolId];
        return loadingSchools ? 'Cargando...' : `Escuela ${schoolId}`;
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-500">Cargando usuarios...</p>
            </div>
        );
    }

    if (!filteredUsers || filteredUsers.length === 0) {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-500 text-lg">No hay usuarios para mostrar</p>
                <p className="text-gray-400 text-sm mt-2">
                    Intenta cambiar los filtros o crear un nuevo usuario
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left font-semibold text-gray-700">Nombre Completo</th>
                            <th className="p-4 text-left font-semibold text-gray-700">Email</th>
                            <th className="p-4 text-left font-semibold text-gray-700">Rol</th>
                            <th className="p-4 text-left font-semibold text-gray-700">Escuela</th>
                            <th className="p-4 text-left font-semibold text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredUsers.map((user) => {
                            const isStudent = user.role?.name?.toLowerCase() === 'student';
                            const schoolName = getSchoolName(user.school_id);

                            return (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {user.f_name} {user.f_lastname} {user.s_lastname}
                                            </p>
                                            <p className="text-sm text-gray-500">ID: {user.id}</p>
                                            {isStudent && user.matricula && (
                                                <p className="text-xs text-gray-500">Matrícula: {user.matricula}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-gray-700">{user.email}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role?.name?.toLowerCase() === 'admin'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {user.role?.name || 'Desconocido'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-gray-700 text-sm">
                                            <p>{schoolName}</p>
                                            {user.school_id && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    ID: {user.school_id}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => onEditClick && onEditClick(user)}
                                                className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                                                title="Editar usuario"
                                            >
                                                ✏️ Editar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <div className="text-sm text-gray-600">
                        Mostrando {Math.min(usersPerPage, filteredUsers.length)} de {totalUsers} usuarios
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                        >
                            Anterior
                        </button>

                        <div className="flex space-x-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page =>
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                )
                                .map((page, index, array) => (
                                    <React.Fragment key={page}>
                                        {index > 0 && array[index - 1] !== page - 1 && (
                                            <span className="px-2">...</span>
                                        )}
                                        <button
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-1 text-sm rounded ${currentPage === page
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    </React.Fragment>
                                ))
                            }
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTable;