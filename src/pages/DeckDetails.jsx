import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';
import { API_URL } from '../config';
import Swal from 'sweetalert2';

export default function DeckDetails() {
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const { authenticated } = useAuthContext();
  const [error, setErrors] = useState(null);
  const navigate = useNavigate();

  async function fetchDeck() {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/deck/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
        },
      });

      const data = await res.json();
      switch (res.status) {
        case 200:
          setDeck(data);
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
    fetchDeck();
  }, [id, authenticated]);

  function handleUpdate() {
    navigate(`/deck/edit/${id}`);
  }

  async function handleDelete() {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/deck/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
      });

      if (res.status === 204) {
        Swal.fire({
          icon: 'success',
          title: 'Mazo eliminada',
          text: 'Se ha eliminado correctamente el mazo.',
          showConfirmButton: false,
          timer: 1500,
        });

        navigate('/');
      } else {
        const data = await res.json();
        setErrors(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleImportCard() {
    console.log('Importar carta al mazo');
  }

  async function handleExportDeck() {
    console.log('Exportar mazo');
  }

  return (
    deck ? (
      <div className="container mx-auto p-4 w-4/5">
        <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{deck.name}</h1>
          {error && <p className="text-yellow-600">{error}</p>}

          <p className="mb-2">{deck.description}</p>
          <p className="text-gray-500">Tema: {deck.theme}</p>
          <p className="text-gray-500">Fecha de creación: {new Date(deck.createAt).toLocaleDateString()}</p>
          <p className="text-gray-500">Número de cartas: {deck.cards.length}</p>

          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleUpdate}
              className="bg-gradient-to-r from-blue-200 to-blue-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-blue-300 focus:outline-none"
            >
              Actualizar
            </button>
            <button
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-200 to-red-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-red-300 focus:outline-none"
            >
              Eliminar
            </button>
            <button
              onClick={handleImportCard}
              className="bg-gradient-to-r from-green-400 to-green-600 text-black px-4 py-2 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-green-300 focus:outline-none"
              >
              Importar Carta a Mazo
            </button>
            <button
              onClick={handleExportDeck}
              className="bg-gradient-to-r from-yellow-200 to-yellow-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-yellow-300 focus:outline-none"
            >
              Exportar Mazo
            </button>
          </div>

          <h2 className="text-2xl font-bold mt-4 mb-2">Cartas</h2>
          <div className="w-full h-96 overflow-y-auto border p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deck.cards.map((card) => (
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