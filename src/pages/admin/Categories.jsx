import React, { useState, useEffect } from 'react';
import { getCategories, updateCategory, createCategory } from '../../services/api';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDesc, setNewCategoryDesc] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await getCategories();
            setCategories(res.data);
        } catch (error) {
            console.error('Error cargando categorías', error);
            // alert('Error cargando categorías');
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;

        try {
            await createCategory({
                name: newCategoryName,
                description: newCategoryDesc || "Sin descripción" // Send description
            });
            setNewCategoryName('');
            setNewCategoryDesc('');
            setIsAdding(false);
            fetchCategories();
            alert('Categoría creada con éxito');
        } catch (error) {
            console.error('Error creating category:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
            alert(`Error al crear la categoría: ${errorMessage}`);
        }
    };

    const startEdit = (category) => {
        setEditingId(category.id);
        setEditName(category.name);
    };

    const saveEdit = async (id) => {
        try {
            await updateCategory(id, editName);
            setEditingId(null);
            fetchCategories();
            alert('Categoría actualizada');
        } catch (error) {
            alert('Error actualizando categoría');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Categorías de Servicio</h1>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
                    {isAdding ? 'Cancelar' : 'Agregar Categoría'}
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100 mb-6 animate-fade-in-down">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Nueva Categoría</h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Nombre de la categoría"
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                            <input
                                type="text"
                                value={newCategoryDesc}
                                onChange={(e) => setNewCategoryDesc(e.target.value)}
                                placeholder="Descripción (opcional)"
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleAddCategory}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition shadow"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Nombre</th>
                            <th className="p-3 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id} className="border-t hover:bg-gray-50">
                                <td className="p-3">{category.id}</td>
                                <td className="p-3">
                                    {editingId === category.id ? (
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full p-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    ) : (
                                        <span className="font-medium text-gray-700">{category.name}</span>
                                    )}
                                </td>
                                <td className="p-3">
                                    {editingId === category.id ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => saveEdit(category.id)}
                                                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="bg-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-400 transition"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => startEdit(category)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                                        >
                                            Editar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Categories;