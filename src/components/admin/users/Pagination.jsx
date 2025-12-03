import React from 'react';

const Pagination = ({
    currentPage,
    totalPages,
    totalUsers,
    usersPerPage,
    onPageChange
}) => {
    // Si no hay páginas, no mostrar nada
    if (totalPages <= 1) {
        return null;
    }

    // Calcular números de página a mostrar
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Mostrar todas las páginas
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Lógica para mostrar páginas con elipsis
            const leftBound = Math.max(currentPage - 2, 1);
            const rightBound = Math.min(currentPage + 2, totalPages);

            if (currentPage <= 3) {
                // Al principio
                for (let i = 1; i <= 5; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Al final
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                // En medio
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = leftBound; i <= rightBound; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    // Calcular el rango de usuarios mostrados
    const startUser = ((currentPage - 1) * usersPerPage) + 1;
    const endUser = Math.min(currentPage * usersPerPage, totalUsers);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
            {/* Información de usuarios mostrados */}
            <div className="mb-3 sm:mb-0">
                <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{startUser}</span> a{' '}
                    <span className="font-medium">{endUser}</span> de{' '}
                    <span className="font-medium">{totalUsers}</span> usuarios
                </p>
            </div>

            {/* Controles de paginación */}
            <div className="flex items-center space-x-1">
                {/* Botón Anterior */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === 1
                            ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                >
                    ← Anterior
                </button>

                {/* Números de página */}
                <div className="flex items-center space-x-1">
                    {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-3 py-1 text-gray-500">...</span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(page)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Botón Siguiente */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages
                            ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                >
                    Siguiente →
                </button>
            </div>

            {/* Selector de página (opcional) */}
            <div className="mt-3 sm:mt-0 flex items-center space-x-2">
                <span className="text-sm text-gray-700">Ir a página:</span>
                <select
                    value={currentPage}
                    onChange={(e) => onPageChange(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <option key={page} value={page}>
                            {page}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Pagination;