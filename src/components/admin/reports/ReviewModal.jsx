import React, { useState } from 'react';
import { updateReport } from '../../../services/api';

const ReviewModal = ({ report, onClose, onSuccess, getStudentName, getHours }) => {
    const [reviewData, setReviewData] = useState({
        amount_approved: getHours(report) || 0,
        comment: '',
        status: '2' // Cambiado a '2' (rechazar) por defecto
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!report) return;

        try {
            setError('');
            setLoading(true);

            // Preparar datos según el curl de ejemplo
            const finalData = {
                amount_approved: reviewData.status === '1' ? parseInt(reviewData.amount_approved) : 0,
                comment: reviewData.comment.trim() || "",
                status: reviewData.status // '1', '2', o '0' como strings
            };

            console.log('Datos a enviar:', finalData);
            console.log('Tipo de datos:', {
                amount_approved: typeof finalData.amount_approved,
                comment: typeof finalData.comment,
                status: typeof finalData.status
            });

            // Intentar primero con el ID del reporte
            let response;
            try {
                response = await updateReport(report.id, finalData);
                console.log('Respuesta exitosa:', response.data);
            } catch (apiError) {
                console.error('Error con ID del reporte:', apiError);

                // Si falla, intentar con review_id si existe
                if (report.review_id) {
                    console.log('Intentando con review_id:', report.review_id);
                    response = await updateReport(report.review_id, finalData);
                } else {
                    throw apiError;
                }
            }

            onSuccess();

        } catch (error) {
            console.error('Error completo:', error);

            if (error.response) {
                console.error('Respuesta del servidor:', error.response.data);
                console.error('Status:', error.response.status);
                console.error('Headers:', error.response.headers);

                const errorMsg = error.response.data?.message || error.response.data?.error || 'Error desconocido';
                setError(`Error ${error.response.status}: ${errorMsg}`);

                // Mostrar detalles para debugging
                if (error.response.data) {
                    console.error('Datos del error:', JSON.stringify(error.response.data, null, 2));
                }
            } else if (error.request) {
                console.error('No hubo respuesta:', error.request);
                setError('Error de conexión con el servidor');
            } else {
                setError('Error: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="px-6 py-4 border-b">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Revisar Reporte #{report.id}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 text-xl"
                            disabled={loading}
                        >
                            ×
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Estudiante: {getStudentName(report)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        ID para endpoint: {report.id} {report.review_id && `(review_id: ${report.review_id})`}
                    </p>
                </div>

                <div className="px-6 py-4">
                    {/* Información */}
                    <div className="mb-6 p-4 bg-gray-50 rounded">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <p className="text-xs text-gray-500">Categoría</p>
                                <p className="text-sm font-medium">{report.category?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Horas Solicitadas</p>
                                <p className="text-sm font-medium">{getHours(report)}</p>
                            </div>
                        </div>
                        {report.description && (
                            <div>
                                <p className="text-xs text-gray-500">Descripción</p>
                                <p className="text-sm mt-1 text-gray-700">{report.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                            <div className="font-medium mb-1">Error:</div>
                            {error}
                        </div>
                    )}

                    {/* Decisión */}
                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-3">Decisión *</p>
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={() => setReviewData({
                                    amount_approved: getHours(report) || 0,
                                    comment: reviewData.comment,
                                    status: '1'
                                })}
                                disabled={loading}
                                className={`flex-1 py-3 rounded-lg border ${reviewData.status === '1'
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="text-center">
                                    <div className="font-medium">Aprobar</div>
                                    <div className="text-xs mt-1">
                                        ({reviewData.status === '1' ? reviewData.amount_approved : getHours(report)} horas)
                                    </div>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setReviewData({
                                    amount_approved: 0,
                                    comment: reviewData.comment,
                                    status: '2'
                                })}
                                disabled={loading}
                                className={`flex-1 py-3 rounded-lg border ${reviewData.status === '2'
                                    ? 'border-red-500 bg-red-50 text-red-700'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="text-center">
                                    <div className="font-medium">Rechazar</div>
                                    <div className="text-xs mt-1">(0 horas)</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Horas Aprobadas */}
                    {reviewData.status === '1' && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Horas Aprobadas *
                            </label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="number"
                                    min="0"
                                    max={getHours(report) || 100}
                                    value={reviewData.amount_approved}
                                    onChange={(e) => setReviewData({
                                        ...reviewData,
                                        amount_approved: parseInt(e.target.value) || 0
                                    })}
                                    disabled={loading}
                                    className="w-24 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-600">
                                    de {getHours(report)} horas solicitadas
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Si aprueba, debe especificar las horas aprobadas (puede ser 0)
                            </p>
                        </div>
                    )}

                    {/* Comentario */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comentario
                        </label>
                        <textarea
                            value={reviewData.comment}
                            onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                            disabled={loading}
                            placeholder="Ej: Las evidencias no son correctas, falta documentación, etc."
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                        />
                    </div>

                </div>

                <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Enviando...' : 'Enviar Revisión'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;