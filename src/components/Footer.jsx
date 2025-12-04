import React from "react";

export default function Footer() {
  const socialLinks = [
    {
      href: "https://www.facebook.com/fundet",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H15V13.9999H17.0762C17.5066 13.9999 17.8887 13.7245 18.0249 13.3161L18.4679 11.9871C18.6298 11.5014 18.2683 10.9999 17.7564 10.9999H15V8.99992C15 8.49992 15.5 7.99992 16 7.99992H18C18.5523 7.99992 19 7.5522 19 6.99992V6.31393C19 5.99091 18.7937 5.7013 18.4813 5.61887C17.1705 5.27295 16 5.27295 16 5.27295C13.5 5.27295 12 6.99992 12 8.49992V10.9999H10C9.44772 10.9999 9 11.4476 9 11.9999V12.9999C9 13.5522 9.44771 13.9999 10 13.9999H12V21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z"
            fill="#1E3A8A"
          />
        </svg>
      ),
    },
    {
      href: "https://twitter.com",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 50"
          className="h-8 w-8"
        >
          <path
            fill="#1E3A8A"
            d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"
          />
        </svg>
      ),
    },
    {
      href: "https://www.instagram.com/funvalinternacional/",
      svg: (
        <svg fill="#1E3A8A" viewBox="0 0 32 32" className="w-9 h-9">
          <path d="M20.445 5h-8.891A6.559 6.559 0 0 0 5 11.554v8.891A6.559 6.559 0 0 0 11.554 27h8.891a6.56 6.56 0 0 0 6.554-6.555v-8.891A6.557 6.557 0 0 0 20.445 5zm4.342 15.445a4.343 4.343 0 0 1-4.342 4.342h-8.891a4.341 4.341 0 0 1-4.341-4.342v-8.891a4.34 4.34 0 0 1 4.341-4.341h8.891a4.342 4.342 0 0 1 4.341 4.341l.001 8.891z"></path>
          <path d="M16 10.312c-3.138 0-5.688 2.551-5.688 5.688s2.551 5.688 5.688 5.688 5.688-2.551 5.688-5.688-2.50-5.688-5.688-5.688zm0 9.163a3.475 3.475 0 1 1-.001-6.95 3.475 3.475 0 0 1 .001 6.95zM21.7 8.991a1.363 1.363 0 1 1-1.364 1.364c0-.752.51-1.364 1.364-1.364z"></path>
        </svg>
      ),
    },
    {
      href: "https://www.youtube.com/@funvalinternacional6226",
      svg: (
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
        >
          <rect width="24" height="24" rx="4" fill="#1E3A8A" />

          <polygon points="9,7 9,17 17,12" fill="white" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-linear-to-r from-white via-cyan-100 to-blue-200 py-6 px-4 text-blue-900">
      <div className="container mx-auto max-w-7xl flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row w-full items-center justify-between">
          <div className="w-full md:w-1/3 text-center md:text-left order-3 md:order-1 py-2">
            <p className="text-lg font-medium">
              Copyright © {new Date().getFullYear()} Funval.
            </p>
          </div>

          <div className="w-full md:w-1/3 text-center order-1 md:order-2">
            <h3 className="text-lg font-bold mb-2">Social Media</h3>
            <div className="flex justify-center space-x-4">
              {socialLinks.map(({ href, svg }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block p-2 rounded-full hover:scale-110 transition-transform cursor-pointer"
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/3 text-center md:text-right order-2 md:order-3">
            <h3 className="text-lg font-bold mb-2">Contactos</h3>
            <div className="text-sm space-y-1">
              <p>Telefono: 02229 456-789</p>
              <p>WhatsApp: +54 9 11 1555-6677</p>
              <p>Email: contact@Funval.com</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
