import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/authContext';
import { API_URL } from '../../config';
import axios from 'axios';
import Swal from 'sweetalert2';
import wordsearch from '../../icon/wordsearch.png';

export default function SelectDeckGameWordSearch() {
  const { authenticated } = useAuthContext();
  const { gameType, id } = useParams();
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [maxWords, setMaxWords] = useState(2);
  const [duration, setDuration] = useState(60);
  const [totalGames, setTotalGames] = useState(1);
  const [nameFilter, setNameFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [decksPerPage, setDecksPerPage] = useState(5);

  const gameTypes = [
    { type: 'WordSearchGame', name: 'Sopa de Letras', icon: wordsearch },
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
    setSelectedDeck(prevSelectedDeck => (prevSelectedDeck === deckId ? null : deckId));
  };

  async function handleStartGame() {
    if (selectedDeck) {
      try {
        setIsCreating(true);
        const token = localStorage.getItem('access_token');
        const response = await axios.post(
          `${API_URL}/api/wordSearchGames`,
          { deckId: selectedDeck, settings: { maxWords, duration, totalGames } },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (response.status === 201) {
          Swal.fire({
            icon: 'success',
            title: 'Juego Creado',
            text: 'El juego de sopa de letras se ha creado exitosamente.',
          }).then(() => {
            navigate(`/wordSearchGame/${response.data.wordSearchGame._id}`);
          });
        } else {
          setError(response.data.message);
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

  const handleReturn = () => {
    navigate('/lobby');
  };

  const getGameName = (type) => {
    const game = gameTypes.find(game => game.type === type);
    return game ? game.name : type;
  };

  const filteredDecks = decks.filter(deck => {
    return nameFilter ? deck.name.toLowerCase().includes(nameFilter.toLowerCase()) : true;
  });

  const indexOfLastCard = currentPage * decksPerPage;
  const indexOfFirstCard = indexOfLastCard - decksPerPage;
  const currentDecks = filteredDecks.slice(indexOfFirstCard, indexOfLastCard);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Selecciona un Mazo para {getGameName(gameType)}</h1>
      {error && <p className="text-red-500 text-center" style={{ marginBottom: "1%" }}>{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <div className="flex items-center mb-4 mt-12">
            <input
              type="text"
              placeholder="Nombre"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">
              Mazos por página:
              <select
                id="decksPerPage"
                value={decksPerPage}
                onChange={(e) => {
                  setDecksPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border p-2 rounded w-full"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </label>
          </div>
          <div className="flex justify-center mb-4">
            {Array.from({ length: Math.ceil(filteredDecks.length / decksPerPage) }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="flex flex-col items-center mb-4">
            <label className="mb-2">Número de Palabras:</label>
            <input
              type="number"
              value={maxWords}
              onChange={(e) => setMaxWords(Number(e.target.value))}
              min="2"
              max="4"
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex flex-col items-center mb-4">
            <label className="mb-2">Duración (segundos):</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="30"
              max="300"
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex flex-col items-center mb-4">
            <label className="mb-2">Total de Partidas:</label>
            <input
              type="number"
              value={totalGames}
              onChange={(e) => setTotalGames(Number(e.target.value))}
              min="1"
              max="25"
              className="border rounded px-2 py-1"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center space-y-4">
          <button
            onClick={handleStartGame}
            disabled={!selectedDeck || isCreating}
            className={`px-4 py-2 rounded-lg shadow-lg transition-transform duration-300 ${selectedDeck ? 'bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-green-300 focus:outline-none' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            style={{ width: '160px' }}
          >
            {isCreating ? 'Creando...' : 'Iniciar Juego'}
          </button>
          <button
            onClick={handleReturn}
            className="px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-red-200 to-red-400 text-black transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-red-300 focus:outline-none"
            style={{ width: '160px' }}
          >
            Cambiar de Juego
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginTop: "1%" }}>
        {currentDecks.map((deck) => (
          <div
            key={deck._id}
            className={`border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${selectedDeck === deck._id ? 'bg-blue-100' : 'bg-white'}`}
            onClick={() => handleDeckClick(deck._id)}
          >
            <h2 className="text-xl font-bold mb-2 text-center">{deck.name.replace(/(-[a-z0-9]{6,})+$/, '')}</h2>
            <p className="mb-2 text-center">{deck.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}