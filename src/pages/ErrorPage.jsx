import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto p-6 flex flex-col items-center" style={{ marginTop: '6rem', marginBottom: '5.5rem' }}>
      <h1 className="text-5xl font-bold mb-6">404 - Página no encontrada</h1>
      <p className="text-xl mb-6">Lo sentimos, la página que estás buscando no existe.</p>
      <button
        onClick={handleGoHome}
        className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-4 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-blue-300 focus:outline-none"
      >
        Volver al inicio
      </button>
    </div>
  );
}