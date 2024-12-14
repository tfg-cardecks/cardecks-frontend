import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/authContext';
import { API_URL } from '../../config';
import axios from 'axios';
import Swal from 'sweetalert2';
import guesstheimage from '../../icon/guesstheimage.png';

export default function SelectDeckGameGuessTheImage() {
  const { authenticated } = useAuthContext();
  const { gameType, id } = useParams();
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [inProgressGameId, setInProgressGameId] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const gameTypes = [
    { type: 'GuessTheImageGame', name: 'Adivina la Imagen', icon: guesstheimage },
  ];

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

  async function handleStartGame() {
    if (selectedDeck) {
      try {
        setIsCreating(true);
        const token = localStorage.getItem('access_token');
        const response = await axios.post(
          `${API_URL}/api/guessTheImageGames`,
          { deckId: selectedDeck },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        switch (response.status) {
          case 201:
            Swal.fire({
              icon: 'success',
              title: 'Juego Creado',
              text: 'El juego de adivinar la imagen se ha creado exitosamente.',
            }).then(() => {
              navigate(`/guessTheImageGame/${response.data.guessTheImageGameId}`);
            });
            break;
          case 200:
            if (response.data.message === "Ya tienes un Juego de Adivinar la Imagen en progreso") {
              setInProgressGameId(response.data.guessTheImageGameId);
            }
            break;
          case 400:
          case 401:
          case 404:
            setError(response.data.message);
            break;
          default:
            break;
        }
      } catch (error) {
        setError(error.response.data.message);
      } finally {
        setIsCreating(false);
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Mazo no seleccionado',
        text: 'Por favor, selecciona un mazo antes de continuar.',
      });
    }
  }

  const handleResumeGame = () => {
    if (inProgressGameId) {
      navigate(`/guessTheImageGame/${inProgressGameId}`);
    }
  };

  const handleReturn = () => {
    navigate('/lobby');
  };

  const getGameName = (type) => {
    const game = gameTypes.find(game => game.type === type);
    return game ? game.name : type;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Selecciona un Mazo para {getGameName(gameType)}</h1>
      {error && <p className="text-red-500 text-center" style={{ marginBottom: "1%" }}>{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginTop: "1%" }}>
        {decks.map((deck) => (
          <div
            key={deck._id}
            className={`border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${selectedDeck === deck._id ? 'bg-blue-100' : 'bg-white'}`}
            onClick={() => handleDeckClick(deck._id)}
          >
            <h2 className="text-xl font-bold mb-2 text-center">{deck.name.replace(/(-[a-z0-9]{6,})+$/, '')}</h2>
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
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={handleStartGame}
          disabled={!selectedDeck || isCreating}
          className={`px-4 py-2 rounded-lg shadow-lg transition-transform duration-300 ${selectedDeck ? 'bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-green-300 focus:outline-none w-40' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {isCreating ? 'Creando...' : 'Iniciar Juego'}
        </button>
        <button
          onClick={handleReturn}
          className="px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-red-200 to-red-400 text-black transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-red-300 focus:outline-none w-32 duration-300"
        >
          Volver
        </button>
      </div>
      {inProgressGameId && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleResumeGame}
            className="px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-purple-200 to-purple-400 text-black transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-purple-300 focus:outline-none w-44 duration-300"
          >
            Continuar Juego en Progreso
          </button>
        </div>
      )}
    </div>
  );
}