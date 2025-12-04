import React from 'react';

const UserHeader = ({ currentUser, onCreateClick, loading }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
                <p className="text-gray-600 mt-2">
                    Administra usuarios Admin y Estudiantes
                    {currentUser && (
                        <span className="text-sm text-blue-600 ml-2">
                            (Tú: {currentUser.name} - {currentUser.role?.name})
                        </span>
                    )}
                </p>
            </div>
            <button
                onClick={onCreateClick}
                className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
                disabled={loading}
            >
                <span className="mr-2">➕</span> Nuevo Usuario
            </button>
        </div>
    );
};

export default UserHeader;