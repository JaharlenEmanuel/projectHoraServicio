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

            const pending = reportsRes.data.filter(r => r.status === 'Pending').length;
            console.log(pending)

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
        <div className="p-4 md:p-6 lg:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Dashboard Admin</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide">Total Usuarios</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.users}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide">Total Reportes</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.reports}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide">Reportes Pendientes</h3>
                    <p className="text-3xl font-bold text-orange-500 mt-2">{stats.pending}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide">Categorías</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.categories}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Acciones Rápidas</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <a href="/admin/users" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition  text-center font-medium shadow-sm hover:shadow">
                        Gestionar Usuarios
                    </a>
                    <a href="/admin/reports" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition text-center font-medium shadow-sm hover:shadow">
                        Ver Reportes
                    </a>
                    <a href="/admin/categories" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition text-center font-medium shadow-sm hover:shadow">
                        Editar Categorías
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;