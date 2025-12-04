import React from 'react';

export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    totalUsers = 0,
    usersPerPage = 10,
    onPageChange
}) {
    // Validar props
    if (!onPageChange || typeof onPageChange !== 'function') {
        console.error('Pagination: onPageChange no es una función válida');
        return null;
    }

    // Si no hay páginas o usuarios, no renderizar
    if (totalPages <= 1 || totalUsers === 0) {
        return null;
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const startIndex = (currentPage - 1) * usersPerPage + 1;
    const endIndex = Math.min(currentPage * usersPerPage, totalUsers);

    return (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600">
                Mostrando {startIndex} - {endIndex} de {totalUsers} usuarios
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                >
                    Anterior
                </button>

                <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page =>
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        )
                        .map((page, index, array) => (
                            <React.Fragment key={page}>
                                {index > 0 && array[index - 1] !== page - 1 && (
                                    <span className="px-2 text-gray-400">...</span>
                                )}
                                <button
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 text-sm rounded transition-colors min-w-10 ${currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {page}
                                </button>
                            </React.Fragment>
                        ))
                    }
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}