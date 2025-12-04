import React, { useState } from 'react';
import UserHeader from '../../components/admin/users/UserHeader';
import UserFilters from '../../components/admin/users/UserFilters';
import UserTable from '../../components/admin/users/UserTable';
import UserForm from '../../components/admin/users/UserForm';
import Pagination from '../../components/admin/users/Pagination';
import { useUsers } from '../../hooks/useUsers';

const Users = () => {
    const {
        filteredUsers, // Usuarios paginados
        allFilteredUsers, // Todos los usuarios filtrados
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
        handlePageChange,
        getSchoolInfo
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
                fetchData();
            } else {
                alert(result.message);
            }
        } else {
            const result = await handleCreateUser(formData);
            alert(result.message);
            if (result.success) {
                setShowForm(false);
                fetchData();
            }
        }
    };

    const handleFilter = (searchTerm, roleFilter) => {
        filterUsers(searchTerm, roleFilter);
    };

    const handleClearFilters = () => {
        filterUsers('', 'all');
    };

    const handlePageChangeWrapper = (pageNumber) => {
        console.log('Cambiando a página:', pageNumber);
        handlePageChange(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="p-6">
            <UserHeader
                currentUser={currentUser}
                onCreateClick={() => {
                    setEditingUser(null);
                    setShowForm(true);
                }}
                loading={loading}
            />

            <UserFilters
                onFilter={handleFilter}
                onClear={handleClearFilters}
            />

            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-4">
                <UserTable
                    users={filteredUsers} // Pasar usuarios paginados
                    onEditClick={handleEditClick}
                    loading={loading}
                    getSchoolInfo={getSchoolInfo}
                />
            </div>

            {totalUsers > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalUsers={totalUsers}
                    usersPerPage={usersPerPage}
                    onPageChange={handlePageChangeWrapper}
                />
            )}

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