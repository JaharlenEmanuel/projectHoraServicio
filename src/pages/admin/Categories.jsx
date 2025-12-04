import React, { useState, useEffect } from 'react';
import { getCategories, updateCategory } from '../../services/api';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await getCategories();
            setCategories(res.data);
        } catch (error) {
            alert('Error cargando categorías');
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
            <h1 className="text-3xl font-bold mb-6">Categorías de Servicio</h1>

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
                            <tr key={category.id} className="border-t">
                                <td className="p-3">{category.id}</td>
                                <td className="p-3">
                                    {editingId === category.id ? (
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full p-1 border rounded"
                                        />
                                    ) : (
                                        category.name
                                    )}
                                </td>
                                <td className="p-3">
                                    {editingId === category.id ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => saveEdit(category.id)}
                                                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="bg-gray-300 px-3 py-1 rounded text-sm"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => startEdit(category)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
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