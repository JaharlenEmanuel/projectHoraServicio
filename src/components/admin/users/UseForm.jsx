import React, { useState, useEffect } from 'react';

// Componente para campos de solo lectura
const ReadOnlyField = ({ label, value }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
            {value || 'No especificado'}
        </div>
    </div>
);

const UserForm = ({
    editingUser,
    roles,
    schools,
    onSubmit,
    onClose,
    loading
}) => {
    const [form, setForm] = useState({
        f_name: '',
        f_lastname: '',
        s_lastname: '',
        email: '',
        password: '',
        role_id: '',
        schools: [],
        controller_id: 2,
        recruiter_id: 3,
        country_id: 4
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingUser) {
            setForm({
                f_name: editingUser.f_name || '',
                f_lastname: editingUser.f_lastname || '',
                s_lastname: editingUser.s_lastname || '',
                email: editingUser.email || '',
                password: '',
                role_id: editingUser.role?.id || editingUser.role_id || '',
                schools: editingUser.schools?.map(s => s.id) || editingUser.school_ids || [],
                controller_id: editingUser.controller_id || 2,
                recruiter_id: editingUser.recruiter_id || 3,
                country_id: editingUser.country_id || 4
            });
        }
    }, [editingUser]);

    const isAdminRole = () => {
        if (!form.role_id) return false;
        const selectedRole = roles.find(role => role.id === parseInt(form.role_id));
        return selectedRole?.name?.toLowerCase() === 'admin';
    };

    const isStudentRole = () => {
        if (!form.role_id) return false;
        const selectedRole = roles.find(role => role.id === parseInt(form.role_id));
        return selectedRole?.name?.toLowerCase() === 'student';
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.f_name.trim()) newErrors.f_name = 'Primer nombre es requerido';
        if (!form.f_lastname.trim()) newErrors.f_lastname = 'Primer apellido es requerido';

        if (!editingUser) {
            if (!form.email.trim()) newErrors.email = 'Email es requerido';
            else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email inválido';

            if (!form.password) newErrors.password = 'Contraseña es requerida';
            else if (form.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';

            if (!form.role_id) newErrors.role_id = 'Rol es requerido';

            if (isStudentRole() && form.schools.length === 0) {
                newErrors.schools = 'Escuela es requerida para estudiantes';
            }
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (editingUser) {
            // Solo enviar nombres para edición
            onSubmit({
                f_name: form.f_name.trim(),
                f_lastname: form.f_lastname.trim(),
                s_lastname: form.s_lastname.trim()
            });
        } else {
            // Enviar todos los campos para creación
            const userData = {
                f_name: form.f_name.trim(),
                f_lastname: form.f_lastname.trim(),
                s_lastname: form.s_lastname.trim(),
                email: form.email.trim(),
                password: form.password,
                role_id: parseInt(form.role_id),
                controller_id: parseInt(form.controller_id),
                recruiter_id: parseInt(form.recruiter_id),
                country_id: parseInt(form.country_id)
            };

            if (isStudentRole() && form.schools.length > 0) {
                userData.schools = form.schools.map(id => parseInt(id));
            } else {
                userData.schools = [];
            }

            onSubmit(userData);
        }
    };

    const handleRoleChange = (roleId) => {
        setForm(prev => ({
            ...prev,
            role_id: roleId,
            schools: roleId && roles.find(r => r.id === parseInt(roleId))?.name?.toLowerCase() === 'admin'
                ? []
                : prev.schools
        }));
    };

    const handleSchoolChange = (schoolId) => {
        setForm(prev => {
            const newSchools = prev.schools.includes(schoolId)
                ? prev.schools.filter(id => id !== schoolId)
                : [...prev.schools, schoolId];
            return { ...prev, schools: newSchools };
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800">
                            {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                            disabled={loading}
                        >
                            ×
                        </button>
                    </div>
                    <p className="text-gray-600 mt-1 text-sm">
                        {editingUser ? (
                            <>
                                Editando: {editingUser.email}
                                <span className="block text-blue-600 text-xs mt-1">
                                    ⚠️ Solo se pueden editar los nombres del usuario
                                </span>
                            </>
                        ) : 'Complete todos los campos requeridos (*)'}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Columna izquierda */}
                            <div className="space-y-4">
                                {/* Nombres */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Primer Nombre *
                                        </label>
                                        <input
                                            type="text"
                                            value={form.f_name}
                                            onChange={(e) => setForm({ ...form, f_name: e.target.value })}
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.f_name ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Ej: Juan"
                                            disabled={loading}
                                        />
                                        {errors.f_name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.f_name}</p>
                                        )}
                                    </div>

                                </div>

                                {/* Apellidos */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Primer Apellido *
                                        </label>
                                        <input
                                            type="text"
                                            value={form.f_lastname}
                                            onChange={(e) => setForm({ ...form, f_lastname: e.target.value })}
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.f_lastname ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Ej: Pérez"
                                            disabled={loading}
                                        />
                                        {errors.f_lastname && (
                                            <p className="text-red-500 text-sm mt-1">{errors.f_lastname}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Segundo Apellido
                                        </label>
                                        <input
                                            type="text"
                                            value={form.s_lastname}
                                            onChange={(e) => setForm({ ...form, s_lastname: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Ej: González"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Email - Solo en creación */}
                                {!editingUser && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="usuario@funval.edu.pe"
                                            disabled={loading}
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                )}

                                {/* Contraseña - Solo en creación */}
                                {!editingUser && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contraseña *
                                        </label>
                                        <input
                                            type="password"
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Mínimo 6 caracteres"
                                            disabled={loading}
                                        />
                                        {errors.password && (
                                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Columna derecha */}
                            <div className="space-y-4">
                                {/* Rol - Solo en creación */}
                                {!editingUser ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rol *
                                        </label>
                                        <select
                                            value={form.role_id}
                                            onChange={(e) => handleRoleChange(e.target.value)}
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.role_id ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            disabled={loading}
                                        >
                                            <option value="">Seleccionar rol</option>
                                            {roles.map(role => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.role_id && (
                                            <p className="text-red-500 text-sm mt-1">{errors.role_id}</p>
                                        )}
                                    </div>
                                ) : (
                                    <ReadOnlyField
                                        label="Rol"
                                        value={roles.find(r => r.id === parseInt(form.role_id))?.name || 'Desconocido'}
                                    />
                                )}

                                {/* Escuelas - Solo en creación y solo para estudiantes */}
                                {!editingUser && isStudentRole() && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Escuela *
                                            <span className="text-xs text-gray-500 ml-2">
                                                (Requerido para estudiantes)
                                            </span>
                                        </label>
                                        <div className={`border rounded-lg p-3 max-h-40 overflow-y-auto ${errors.schools ? 'border-red-500' : 'border-gray-300'
                                            }`}>
                                            {schools.length === 0 ? (
                                                <p className="text-gray-500 text-sm">Cargando escuelas...</p>
                                            ) : (
                                                schools.map(school => (
                                                    <label key={school.id} className="flex items-center mb-2 last:mb-0">
                                                        <input
                                                            type="checkbox"
                                                            checked={form.schools.includes(school.id)}
                                                            onChange={() => handleSchoolChange(school.id)}
                                                            className="rounded text-blue-600 mr-2"
                                                            disabled={loading}
                                                        />
                                                        <span className="text-gray-700">{school.name}</span>
                                                    </label>
                                                ))
                                            )}
                                        </div>
                                        {errors.schools && (
                                            <p className="text-red-500 text-sm mt-1">{errors.schools}</p>
                                        )}
                                        {form.schools.length > 0 && (
                                            <p className="text-green-600 text-sm mt-2">
                                                ✅ {form.schools.length} escuela(s) seleccionada(s)
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Información para admin */}
                                {!editingUser && isAdminRole() && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <span className="text-blue-600 mr-2">ℹ️</span>
                                            <p className="text-sm text-blue-800">
                                                Los administradores no requieren asignación de escuela.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Campos fijos del sistema - Solo en creación */}
                                {!editingUser && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-2">Información del sistema:</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Controller ID</label>
                                                <input
                                                    type="number"
                                                    value={form.controller_id}
                                                    onChange={(e) => setForm({ ...form, controller_id: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                                    disabled={loading}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Recruiter ID</label>
                                                <input
                                                    type="number"
                                                    value={form.recruiter_id}
                                                    onChange={(e) => setForm({ ...form, recruiter_id: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                                    disabled={loading}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <label className="block text-xs text-gray-500 mb-1">Country ID</label>
                                            <input
                                                type="number"
                                                value={form.country_id}
                                                onChange={(e) => setForm({ ...form, country_id: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer del modal */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            * Campos requeridos
                            {editingUser && (
                                <span className="block text-blue-600 mt-1">
                                    ⚠️ En edición solo se pueden modificar los nombres
                                </span>
                            )}
                        </div>
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {editingUser ? 'Actualizando...' : 'Creando...'}
                                    </span>
                                ) : editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;