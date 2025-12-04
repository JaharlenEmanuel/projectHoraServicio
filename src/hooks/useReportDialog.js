import { useState } from 'react';

export const useReportDialog = (updateReportStatus, fetchReports) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [editData, setEditData] = useState({
        status: '',
        comment: '',
        amount_approved: 0
    });
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: 'success'
    });

    const handleEditClick = (report) => {
        setSelectedReport(report);
        setEditData({
            status: report.status?.toString() || '0',
            comment: report.comment || '',
            amount_approved: report.amount_approved || report.total_hours || 0
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedReport(null);
        setEditData({
            status: '',
            comment: '',
            amount_approved: 0
        });
    };

    const handleSave = async () => {
        if (!selectedReport) return;

        try {
            const data = {
                status: editData.status,
                comment: editData.comment,
                amount_approved: parseFloat(editData.amount_approved) || 0
            };

            const result = await updateReportStatus(selectedReport.id, data);

            if (result.success) {
                showNotification('Reporte actualizado exitosamente', 'success');
                handleCloseDialog();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            showNotification('Error al actualizar el reporte', 'error');
        }
    };

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ ...notification, show: false });
        }, 3000);
    };

    const updateEditData = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return {
        openDialog,
        selectedReport,
        editData,
        notification,
        handleEditClick,
        handleCloseDialog,
        handleSave,
        updateEditData
    };
};