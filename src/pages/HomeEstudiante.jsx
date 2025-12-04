import React from 'react';

const HomeEstudiante = () => {
    return (
        <div className="flex-grow flex flex-col items-center justify-center p-4 bg-gray-100">
            <div className="w-full max-w-4xl shadow-lg rounded-lg overflow-hidden">
                <div style={{ position: 'relative', width: '100%', height: 0, paddingTop: '56.25%' }}>
                    <iframe
                        loading="lazy"
                        style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none', padding: 0, margin: 0 }}
                        src="https://www.canva.com/design/DAF7qbeV58w/yLZ0glEC1sJFuwqIcOzkrA/view?embed"
                        allowFullScreen={true}
                        allow="fullscreen"
                        title="Canva Presentation"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default HomeEstudiante;
