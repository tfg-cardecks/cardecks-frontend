import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../images/Logo.jpg';
import { useAuthContext } from '../context/authContext';
import Swal from 'sweetalert2';

export default function Header() {
  const { authenticated, userId, logout } = useAuthContext();
  const [isCardsDropdownOpen, setIsCardsDropdownOpen] = useState(false);
  const [isDecksDropdownOpen, setIsDecksDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const cardsDropdownRef = useRef(null);
  const decksDropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    Swal.fire({
      icon: 'success',
      title: 'Desconectado',
      text: 'Has cerrado sesión correctamente.',
      showConfirmButton: true,
      confirmButtonColor: 'black',
      background: 'gray',
      color: 'white',
    }).then(() => {
      navigate('/');
    });
  };

  const handleCardsClick = () => {
    if (!authenticated) {
      Swal.fire({
        title: 'Necesitas registrarte',
        text: 'Por favor, regístrate para acceder a esta función.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Registrarse',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/register');
        }
      });
    } else {
      setIsCardsDropdownOpen(!isCardsDropdownOpen);
    }
  };

  const handleDecksClick = () => {
    if (!authenticated) {
      Swal.fire({
        title: 'Necesitas registrarte',
        text: 'Por favor, regístrate para acceder a esta función.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Registrarse',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/register');
        }
      });
    } else {
      setIsDecksDropdownOpen(!isDecksDropdownOpen);
    }
  };

  const handleClickOutside = (event) => {
    if (cardsDropdownRef.current && !cardsDropdownRef.current.contains(event.target)) {
      setIsCardsDropdownOpen(false);
    }
    if (decksDropdownRef.current && !decksDropdownRef.current.contains(event.target)) {
      setIsDecksDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isCardsDropdownOpen || isDecksDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCardsDropdownOpen, isDecksDropdownOpen]);

  const handleOptionClick = () => {
    setIsCardsDropdownOpen(false);
    setIsDecksDropdownOpen(false);
  };

  return (
    <header className="text-gray-600 body-font border-b border-gray-300">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link
          to="/"
          className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
        >
          <img
            src={Logo}
            alt="Logo"
            className="w-20 h-20 rounded-full"
          />
          <span className="ml-3 text-xl">Cardecks</span>
        </Link>
        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400 flex flex-wrap items-center text-base justify-center">
          <div className="relative" ref={cardsDropdownRef}>
            <button
              onClick={handleCardsClick}
              className="mr-5 hover:text-gray-900"
            >
              Cartas
            </button>
            {authenticated && isCardsDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg">
                <Link
                  to="/create-cards"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={handleOptionClick}
                >
                  Crear cartas
                </Link>
                {userId && (
                  <Link
                    to={`/user/${userId}/my-cards`}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    onClick={handleOptionClick}
                  >
                    Mis cartas
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="relative" ref={decksDropdownRef}>
            <button
              onClick={handleDecksClick}
              className="mr-5 hover:text-gray-900"
            >
              Mazos
            </button>
            {authenticated && isDecksDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg">
                <Link
                  to={`/user/${userId}/create-deck`}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={handleOptionClick}
                >
                  Crear Mazo
                </Link>
                <Link
                  to={`/user/${userId}/my-decks`}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  onClick={handleOptionClick}
                >
                  Mis Mazos
                </Link>
              </div>
            )}
          </div>
          <Link to="/games" className="mr-5 hover:text-gray-900">
            Juegos
          </Link>
          {authenticated && (
            <Link to="/user/details" className="mr-5 hover:text-gray-900">
              Usuario
            </Link>
          )}
        </nav>
        <div className="md:ml-auto flex items-center">
          {!authenticated && (
            <>
              <Link to="/register" className="mr-5 hover:text-gray-900">
                Registrarse
              </Link>
              <Link to="/login" className="mr-5 hover:text-gray-900">
                Iniciar sesión
              </Link>
            </>
          )}
          {authenticated && (
            <button onClick={handleLogout} className="mr-5 hover:text-gray-900">
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
}