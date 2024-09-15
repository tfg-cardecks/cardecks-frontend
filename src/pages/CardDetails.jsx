import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';
import { API_URL } from '../config';

export default function CardDetail() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const { authenticated } = useAuthContext();
  const [error, setErrors] = useState(null);
  const navigate = useNavigate();

  async function fetchCard() {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/card/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
        },
      });

      const data = await res.json();
      switch (res.status) {
        case 200:
          setCard(data);
          break;
        case 401:
          setErrors(data);
          break;
        case 404:
          setErrors(data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchCard();
  }, [id, authenticated]);

  function handleUpdate() {
    navigate(`/card/edit/${id}`);
  }

  async function handleDelete() {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/card/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
      });

      if (res.status === 204) {
        navigate('/');
      } else {
        const data = await res.json();
        setErrors(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleExportCard() {
    //
  }

  return (
    card ? (
      <div className="container mx-auto p-4 w-4/5">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4">{card.title}</h1>
          {error && <p className="text-yellow-600">{error}</p>}

          <p className="mb-2">{card.description}</p>
          <p className="text-gray-500">Tema: {card.theme}</p>
          <p className="text-gray-500">Fecha de creación: {new Date(card.createdAt).toLocaleDateString()}</p>

          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Actualizar
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Eliminar
            </button>
            <button
              onClick={handleExportCard}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Exportar Carta
            </button>
          </div>

          <div className="flex justify-between items-center mt-4">
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
      </div>
    )
      : (
        <div className="container mx-auto p-4 w-4/5">
          <h1 className="text-3xl font-bold mb-4">Cargando...</h1>
        </div>
      )
  );
}