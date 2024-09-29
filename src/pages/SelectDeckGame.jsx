import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';
import { API_URL } from '../config';

export default function SelectDeckGame() {
  const { authenticated } = useAuthContext();
  const { gameType, id } = useParams();
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  async function fetchDecks() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/user/${id}/decks`, {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
        },
      });
      const data = await response.json();
      switch (response.status) {
        case 401:
        case 404:
          setError(data);
          break;
        case 200:
          setDecks(data);
          break;
        default:
          setError('Unexpected error');
          break;
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchDecks();
  }, [id, authenticated]);

  const handleDeckClick = (deckId) => {
    setSelectedDeck(deckId);
  };

  const handleStartGame = () => {
    if (selectedDeck) {
      console.log('selectedDeck', selectedDeck);
      navigate(`/createCreateWordSearchGame/${gameType}/${selectedDeck}`);
    } else {
      alert('Por favor, selecciona un mazo antes de continuar.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Selecciona un Mazo para {gameType}</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map((deck) => (
          <div
            key={deck._id}
            className={`border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${selectedDeck === deck._id ? 'bg-blue-100' : 'bg-white'}`}
            onClick={() => handleDeckClick(deck._id)}
          >
            <h2 className="text-xl font-bold mb-2 text-center">{deck.name}</h2>
            <p className="mb-2 text-center">{deck.description}</p>
            <button
              onClick={() => handleDeckClick(deck._id)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full hover:bg-blue-600 transition-colors duration-300"
            >
              Seleccionar
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={handleStartGame}
          disabled={!selectedDeck}
          className={`px-4 py-2 rounded-lg shadow-lg transition-transform duration-300 ${selectedDeck ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Iniciar Juego
        </button>
      </div>
    </div>
  );
}