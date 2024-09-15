import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuthContext } from '../context/authContext';

export default function MyCards() {
  const { authenticated } = useAuthContext();
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [titleFilter, setTitleFilter] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { id } = useParams();

  async function fetchCards() {
    try {
      if (authenticated) {
        const token = localStorage.getItem('access_token');

        const response = await fetch(`${API_URL}/api/user/${id}/cards`, {
          method: 'GET',
          headers: {
            Authorization: `${token}`,
          },
        });
        const data = await response.json();
        setCards(data);
      } else {
        setError({ message: 'No estás autenticado. Por favor, inicia sesión.' });
      }
    } catch (err) {
      setError(err.message);
    }
  };


  useEffect(() => {
    fetchCards();
  }, [id, authenticated]);

  const filteredCards = cards.filter(card => {
    const matchesTitle = titleFilter ? card.title.toLowerCase().includes(titleFilter.toLowerCase()) : true;
    const matchesTheme = themeFilter ? card.theme === themeFilter : true;
    const matchesStartDate = startDate ? new Date(card.createdAt) >= new Date(startDate) : true;
    const matchesEndDate = endDate ? new Date(card.createdAt) <= new Date(endDate) : true;
    return matchesTitle && matchesTheme && matchesStartDate && matchesEndDate;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Mis Cartas ({filteredCards.length})
      </h1>
      {error && <p className="text-red-500">{error.message}</p>}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-2">
          <label className="block mb-1">
            Título:
            <input
              type="text"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </label>
          <button
            onClick={() => setTitleFilter('')}
            className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
          >
            Limpiar
          </button>
        </div>
        <div className="mb-2">
          <label className="block mb-1">
            Tema:
            <input
              type="text"
              value={themeFilter}
              onChange={(e) => setThemeFilter(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </label>
          <button
            onClick={() => setThemeFilter('')}
            className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
          >
            Limpiar
          </button>
        </div>
        <div className="mb-2">
          <label className="block mb-1">
            Fecha de Inicio:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </label>
          <button
            onClick={() => setStartDate('')}
            className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
          >
            Limpiar
          </button>
        </div>
        <div className="mb-2">
          <label className="block mb-1">
            Fecha de Fin:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </label>
          <button
            onClick={() => setEndDate('')}
            className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
          >
            Limpiar
          </button>
        </div>
      </div>
      {filteredCards.length === 0 && !error && (
        <p className="text-gray-500">No hay cartas disponibles.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.map((card) => (
          <div key={card._id} className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold mb-2">{card.title}</h2>
            <p className="mb-2">{card.description}</p>
            <p className="text-gray-500">Tema: {card.theme}</p>
            <p className="text-gray-500">Fecha de creación: {new Date(card.createdAt).toLocaleDateString()}</p>
            <div className="flex justify-between items-center">
              {card.frontImageUrl && (
                <div className="text-center">
                  <img
                    src={`${API_URL}${card.frontImageUrl}`}
                    alt={`${card.title} Delantera`}
                    style={{
                      width: `${card.cardWidth / 2}px`,
                      height: `${card.cardHeight / 2}px`,
                      border: '2px solid black'
                    }}
                    className="mt-2 rounded"
                    onError={(e) => { console.log('Error al cargar la imagen delantera:', e); }}
                  />
                  <p className="mt-2">Delantera</p>
                </div>
              )}
              {card.backImageUrl && (
                <div className="text-center">
                  <img
                    src={`${API_URL}${card.backImageUrl}`}
                    alt={`${card.title} Trasera`}
                    style={{
                      width: `${card.cardWidth / 2}px`,
                      height: `${card.cardHeight / 2}px`,
                      border: '2px solid black'
                    }}
                    className="mt-2 rounded"
                    onError={(e) => { console.log('Error al cargar la imagen trasera:', e); }}
                  />
                  <p className="mt-2">Trasera</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}