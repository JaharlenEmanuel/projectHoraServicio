import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');

    const contactInfo = [
        {
            icon: '📞',
            title: 'Teléfono',
            value: '02229 456-789',
            link: 'tel:02229456789'
        },
        {
            icon: '💬',
            title: 'WhatsApp',
            value: '+54 9 11 1555-6677',
            link: 'https://wa.link/mm81ip'
        },
        {
            icon: '✉️',
            title: 'Email',
            value: 'contact@Funval.com',
            link: 'mailto:contact@Funval.com'
        }
    ];

    const socialLinks = [
        {
            name: 'Facebook',
            href: 'https://www.facebook.com/fundet',
            icon: '📘',
            color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            name: 'Instagram',
            href: 'https://www.instagram.com/funvalinternacional/',
            icon: '📸',
            color: 'bg-pink-600 hover:bg-pink-700'
        },
        {
            name: 'YouTube',
            href: 'https://www.youtube.com/@funvalinternacional6226',
            icon: '▶️',
            color: 'bg-red-600 hover:bg-red-700'
        }
    ];

    const handleWhatsAppSubmit = (e) => {
        e.preventDefault();

        // Build the WhatsApp message
        const fullMessage = name
            ? `Hola, mi nombre es ${name}.\n\n${message}`
            : message;

        // Encode the message for URL
        const encodedMessage = encodeURIComponent(fullMessage);

        // Open WhatsApp with the pre-filled message
        window.open(`https://wa.link/mm81ip?text=${encodedMessage}`, '_blank');

        // Clear the form
        setMessage('');
        setName('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver
                    </button>
                    <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
                        Contáctanos
                    </h1>
                    <p className="text-lg text-gray-700">
                        Estamos aquí para ayudarte. No dudes en comunicarte con nosotros.
                    </p>
                </div>

                {/* WhatsApp Contact Form */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <div className="flex items-center justify-center mb-6">
                        <div className="text-4xl mr-3">💬</div>
                        <h2 className="text-2xl font-bold text-gray-800">Envíanos un mensaje por WhatsApp</h2>
                    </div>
                    <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Tu nombre (opcional)
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej: Juan Pérez"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                Tu mensaje *
                            </label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Escribe tu mensaje aquí..."
                                required
                                rows="5"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                        >
                            <span>Enviar por WhatsApp</span>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z" />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* Contact Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {contactInfo.map((item, index) => (
                        <a
                            key={index}
                            href={item.link}
                            target={item.title === 'WhatsApp' ? '_blank' : undefined}
                            rel={item.title === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group"
                        >
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                            <p className="text-blue-600 font-medium">{item.value}</p>
                        </a>
                    ))}
                </div>

                {/* Social Media Section */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Síguenos en Redes Sociales
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${social.color} text-white rounded-lg p-4 text-center hover:scale-105 transition-transform shadow-md`}
                            >
                                <div className="text-3xl mb-2">{social.icon}</div>
                                <p className="font-semibold text-sm">{social.name}</p>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg p-8 text-white text-center">
                    <h2 className="text-2xl font-bold mb-4">Horario de Atención</h2>
                    <div className="space-y-2">
                        <p className="text-lg">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                        <p className="text-lg">Sábados: 9:00 AM - 2:00 PM</p>
                        <p className="text-sm mt-4 opacity-90">
                            Respondemos todos los mensajes dentro de las 24 horas hábiles
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
