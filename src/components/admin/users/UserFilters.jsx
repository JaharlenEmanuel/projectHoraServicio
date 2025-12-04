import React from 'react';

const UserFilters = ({ onFilter, onClear }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [roleFilter, setRoleFilter] = React.useState('all');

    const handleSearch = () => {
        onFilter(searchTerm, roleFilter);
    };

    const handleClear = () => {
        setSearchTerm('');
        setRoleFilter('all');
        onClear();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buscar usuario
                    </label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Nombre, apellido o email..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filtrar por rol
                    </label>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Todos los roles</option>
                        <option value="admin">Administradores</option>
                        <option value="student">Estudiantes</option>
                    </select>
                </div>
                <div className="flex items-end gap-2">
                    <button
                        onClick={handleSearch}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition-colors"
                    >
                        🔍 Buscar
                    </button>
                    <button
                        onClick={handleClear}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-lg font-medium transition-colors"
                    >
                        🔄 Limpiar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserFilters;