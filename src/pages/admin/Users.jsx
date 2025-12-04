import React, { useState } from 'react';
import UserHeader from '../../components/admin/users/UserHeader';
import UserFilters from '../../components/admin/users/UseFilters';
import UserTable from '../../components/admin/users/UserTable';
import UserForm from '../../components/admin/users/UseForm';
import Pagination from '../../components/admin/users/Pagination'; // Importa el componente de paginación
import { useUsers } from '../../hooks/useUsers';

const Users = () => {
    const {
        filteredUsers,
        roles,
        schools,
        currentUser,
        loading,
        currentPage,
        totalPages,
        totalUsers,
        usersPerPage,
        handleCreateUser,
        handleUpdateUser,
        filterUsers,
        fetchData,
        handlePageChange // Nueva función del hook
    } = useUsers();

    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const handleEditClick = (user) => {
        setEditingUser(user);
        setShowForm(true);
    };

    const handleFormSubmit = async (formData) => {
        if (editingUser) {
            const result = await handleUpdateUser(editingUser.id, formData);

            if (result.success) {
                alert(result.message);
                setShowForm(false);
                setEditingUser(null);
                fetchData(); // Refrescar datos
            } else {
                alert(result.message);
            }
        } else {
            const result = await handleCreateUser(formData);
            alert(result.message);
            if (result.success) {
                setShowForm(false);
                fetchData(); // Refrescar datos
            }
        }
    };

    const handleFilter = (searchTerm, roleFilter) => {
        filterUsers(searchTerm, roleFilter);
    };

    const handleClearFilters = () => {
        filterUsers('', 'all');
    };

    // Función para manejar cambio de página
    const handlePageChangeWrapper = (pageNumber) => {
        handlePageChange(pageNumber);
        // Scroll suave al principio de la tabla
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="p-6">
            {/* Header */}
            <UserHeader
                currentUser={currentUser}
                onCreateClick={() => {
                    setEditingUser(null);
                    setShowForm(true);
                }}
                loading={loading}
            />

            {/* Filtros */}
            <UserFilters
                onFilter={handleFilter}
                onClear={handleClearFilters}
            />

            {/* Tabla de usuarios */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-4">
                <UserTable
                    users={filteredUsers}
                    onEditClick={handleEditClick}
                />

                {/* Paginación */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalUsers={totalUsers}
                    usersPerPage={usersPerPage}
                    onPageChange={handlePageChangeWrapper}
                />
            </div>

            {/* Información de paginación (opcional, en caso prefieras algo simple) */}
            <div className="text-center text-sm text-gray-600 mb-4">
                <p>
                    Página {currentPage} de {totalPages} • {totalUsers} usuarios totales
                </p>
            </div>

            {/* Modal de creación/edición */}
            {showForm && (
                <UserForm
                    editingUser={editingUser}
                    roles={roles}
                    schools={schools}
                    onSubmit={handleFormSubmit}
                    onClose={() => {
                        setShowForm(false);
                        setEditingUser(null);
                    }}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default Users;