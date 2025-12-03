import React, { useState, useEffect } from 'react';
import { getUsers, getReports, getCategories } from '../../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        reports: 0,
        categories: 0,
        pending: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [usersRes, reportsRes, categoriesRes] = await Promise.all([
                getUsers(),
                getReports(),
                getCategories()
            ]);

            const pending = reportsRes.data.filter(r => r.status === 'pending').length;

            setStats({
                users: usersRes.data.length,
                reports: reportsRes.data.length,
                categories: categoriesRes.data.length,
                pending
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Cargando estadísticas...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500">Total Usuarios</h3>
                    <p className="text-3xl font-bold">{stats.users}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500">Total Reportes</h3>
                    <p className="text-3xl font-bold">{stats.reports}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500">Reportes Pendientes</h3>
                    <p className="text-3xl font-bold text-orange-500">{stats.pending}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500">Categorías</h3>
                    <p className="text-3xl font-bold">{stats.categories}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
                <div className="flex gap-4">
                    <a href="/admin/users" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Gestionar Usuarios
                    </a>
                    <a href="/admin/reports" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Ver Reportes
                    </a>
                    <a href="/admin/categories" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                        Editar Categorías
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;