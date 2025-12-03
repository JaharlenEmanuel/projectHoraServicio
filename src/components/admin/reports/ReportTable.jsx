import React from 'react';

const ReportTable = ({ reports, type, onReviewClick }) => {
    // Funciones helper
    const getStudentName = (report) => {
        if (report.user?.full_name) return report.user.full_name;
        if (report.student_name) return report.student_name;
        console.log("aquí el reporte", report)
        return 'N/A';
    };

    const getHours = (report) => {
        console.log(report)
        // Obtener horas reportadas
        return report.amount_reported || report.total_hours || report.hours_requested || 0;

    };

    // Función para obtener horas aprobadas (solo para reportes revisados)
    const getApprovedHours = (report) => {
        if (type === 'reviewed' && report.amount_approved !== undefined) {
            return report.approved_hours;
        }
        if (type === 'reviewed' && report.amount_approved !== undefined) {
            return report.amount_approved;
        }
        return null;
    };

    const getStatusDisplay = (report) => {
        const status = String(report.status || '0').toLowerCase();
        switch (status) {
            case '1':
            case 'approved':
                return {
                    text: 'Aprobado',
                    class: 'bg-green-100 text-green-800',
                    icon: '✅'
                };
            case '2':
            case 'rejected':
                return {
                    text: 'Rechazado',
                    class: 'bg-red-100 text-red-800',
                    icon: '❌'
                };
            default:
                return {
                    text: 'Pendiente',
                    class: 'bg-yellow-100 text-yellow-800',
                    icon: '⏳'
                };
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('es-ES');
        } catch {
            return dateString;
        }
    };

    if (reports.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-4xl mb-4">
                    {type === 'pending' ? '🎉' : '📋'}
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                    {type === 'pending'
                        ? 'No hay reportes pendientes'
                        : 'No hay reportes revisados'}
                </h3>
                <p className="text-gray-500">
                    {type === 'pending'
                        ? 'Todos los reportes han sido revisados'
                        : 'Los reportes revisados aparecerán aquí'}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Estudiante
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Categoría
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {type === 'pending' ? 'Horas Reportadas' : 'Horas'}
                            </th>
                            {type === 'reviewed' && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Horas Aprobadas
                                </th>
                            )}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {type === 'pending' ? 'Fecha' : 'Fecha Revisión'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {type === 'pending' ? 'Acciones' : 'Estado'}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reports.map(report => {
                            const status = getStatusDisplay(report);
                            const studentName = getStudentName(report);
                            const hoursReported = getHours(report);
                            const hoursApproved = getApprovedHours(report);

                            return (
                                <tr key={report.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        #{report.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {studentName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {report.category?.name || 'N/A'}
                                    </td>

                                    {/* Columna de Horas - Diferente según el tipo */}
                                    {type === 'pending' ? (
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div className="font-semibold text-gray-900">
                                                    {hoursReported} hrs
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Reportadas
                                                </div>
                                            </div>
                                        </td>
                                    ) : (
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div className="font-semibold text-gray-900">
                                                    {hoursReported} hrs
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Solicitadas
                                                </div>
                                            </div>
                                        </td>
                                    )}

                                    {/* Columna de Horas Aprobadas (solo para revisados) */}
                                    {type === 'reviewed' && (
                                        <td className="px-6 py-4">
                                            {hoursApproved !== null ? (
                                                <div className="text-sm">
                                                    <div className={`font-semibold ${status.text === 'Aprobado' ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        {hoursApproved} hrs
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Aprobadas
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>
                                    )}

                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {formatDate(
                                            type === 'pending'
                                                ? report.created_at
                                                : report.updated_at || report.created_at
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {type === 'pending' ? (
                                            <button
                                                onClick={() => onReviewClick(report)}
                                                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition-colors"
                                            >
                                                Revisar
                                            </button>
                                        ) : (
                                            <div className="flex items-center">
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.class}`}>
                                                    {status.icon} {status.text}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Resumen de horas */}
            <div className="border-t bg-gray-50 px-6 py-3">
                <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-600">
                        Total reportes: <span className="font-medium">{reports.length}</span>
                    </div>
                    {type === 'pending' && (
                        <div className="text-gray-600">
                            Horas totales reportadas:
                            <span className="font-medium ml-1">
                                {reports.reduce((total, report) => total + getHours(report), 0)} hrs
                            </span>
                        </div>
                    )}
                    {type === 'reviewed' && (
                        <div className="text-gray-600">
                            Horas totales aprobadas:
                            <span className="font-medium text-green-600 ml-1">
                                {reports.reduce((total, report) => {
                                    const approved = getApprovedHours(report);
                                    return total + (approved !== null ? approved : 0);
                                }, 0)} hrs
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportTable;