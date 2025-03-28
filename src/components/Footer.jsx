import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="text-gray-600 body-font border-t border-gray-300">
      <div className="container px-5 py-10 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
        <div className="w-96 flex-shrink-0 md:mx-0 mx-0 text-left md:mt-0 mt-10">
          <Link
            to="/"
            className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
          >
            <img
              src="/Logo.jpg"
              alt="Logo"
              className="w-28 h-28"
            />
            <span className="ml-3 text-xl">Cardecks</span>
          </Link>

        </div>
        <div className="flex-grow flex flex-wrap md:pr-20 -mb-10 md:text-left text-center order-first">
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              Mapa del sitio
            </h2>
            <nav className="list-none mb-10">
              <li>
                <Link to="/privacy-notice" className="text-gray-600 hover:text-gray-800">Aviso de privacidad</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-800">Contacto</Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-800">Inicio</Link>
              </li>
            </nav>
          </div>
          <div className="w-full border-t border-gray-300 mb-2 sm:hidden"></div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <nav className="list-none mb-2 mt-8">
              <li>
                <Link to="/terms-of-use" className="text-gray-600 hover:text-gray-800">Términos de uso</Link>
              </li>
            </nav>
          </div>
        </div>
      </div>
      <div className="bg-gray-100">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            Cardeck 2024
          </p>
        </div>
      </div>
    </footer>
  );
}