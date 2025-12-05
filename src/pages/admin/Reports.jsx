import React, { useState, useEffect } from 'react';
import { getReports } from '../../services/api';
import ReportTable from '../../components/admin/reports/ReportTable';
import ReviewModal from '../../components/admin/reports/ReviewModal';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [pendingReports, setPendingReports] = useState([]);
    const [reviewedReports, setReviewedReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await getReports();

            if (res.data && Array.isArray(res.data)) {
                const pending = [];
                const reviewed = [];

                res.data.forEach(report => {
                    const isReviewed =
                        report.review_id ||
                        (report.status && String(report.status) !== '0' && String(report.status).toLowerCase() !== 'pending');

                    if (isReviewed) {
                        reviewed.push(report);
                    } else {
                        pending.push(report);
                    }
                });

                // Sort both arrays from newest to oldest
                const sortByDate = (a, b) => {
                    const dateA = new Date(a.created_at || a.date || 0);
                    const dateB = new Date(b.created_at || b.date || 0);
                    return dateB - dateA;
                };

                setReports(res.data);
                setPendingReports(pending.sort(sortByDate));
                setReviewedReports(reviewed.sort(sortByDate));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error cargando reportes');
        } finally {
            setLoading(false);
        }
    };

    const openReviewModal = (report) => {
        setSelectedReport(report);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedReport(null);
    };

    const handleReviewSuccess = () => {
        closeModal();
        fetchReports();
    };

    // Funciones helper
    const getStudentName = (report) => {
        if (report.student?.name) return report.student.name;
        if (report.user?.name) return report.user.name;
        if (report.student_name) return report.student_name;
        return 'N/A';
    };

    const getHours = (report) => {
        return report.hours || report.total_hours || report.hours_requested || 0;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl">Cargando reportes...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Gestión de Reportes</h1>

            {/* Pestañas */}
            <div className="mb-6">
                <div className="border-b">
                    <nav className="flex">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`px-6 py-3 font-medium text-sm border-b-2 ${activeTab === 'pending'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            ⏳ Pendientes ({pendingReports.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('reviewed')}
                            className={`px-6 py-3 font-medium text-sm border-b-2 ${activeTab === 'reviewed'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            ✅ Revisados ({reviewedReports.length})
                        </button>
                    </nav>
                </div>
            </div>

            {/* Contenido según pestaña */}
            {activeTab === 'pending' && (
                <ReportTable
                    reports={pendingReports}
                    type="pending"
                    onReviewClick={openReviewModal}
                />
            )}

            {activeTab === 'reviewed' && (
                <ReportTable
                    reports={reviewedReports}
                    type="reviewed"
                    onReviewClick={null}
                />
            )}

            {/* Modal de Revisión */}
            {showModal && selectedReport && (
                <ReviewModal
                    report={selectedReport}
                    onClose={closeModal}
                    onSuccess={handleReviewSuccess}
                    getStudentName={getStudentName}
                    getHours={getHours}
                />
            )}
        </div>
    );
};

export default Reports;