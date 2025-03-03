import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/authContext';
import axios from 'axios';
import { API_URL } from '../config';
import '../styles/UserDetailStyles.css';
import wordsearch from '../icon/wordsearch.png';
import guesstheimage from '../icon/guesstheimage.png';
import matchingGame from '../icon/matchingGame.jpg';
import hangmanGame from '../icon/guesstheimage.png';
import letterOrder from '../icon/letterOrder.jpg';

export default function UserDetailStatistics() {
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState({});
  const [gameStats, setGameStats] = useState([]);
  const [mostUsedDecks, setMostUsedDecks] = useState([]);

  const { authenticated } = useAuthContext();

  const gameTypes = [
    { type: 'WordSearchGame', name: 'Sopa de Letras', icon: wordsearch },
    { type: 'GuessTheImageGame', name: 'Adivina la Imagen', icon: guesstheimage },
    { type: 'MatchingGame', name: 'Juego de Relacionar Palabras', icon: matchingGame },
    { type: 'HangmanGame', name: 'Juego del Ahorcado', icon: hangmanGame },
    { type: 'LetterOrderGame', name: 'Ordenar las Letras', icon: letterOrder },

  ];

  async function fetchUserData() {
    try {
      if (authenticated) {
        const currentUserId = localStorage.getItem('userId');
        const response = await axios.get(`${API_URL}/api/users`);
        const userData = response.data.find((user) => user._id === currentUserId);
        switch (response.status) {
          case 200:
            setUser(userData);
            break;
          case 403:
          case 404:
            setErrors(userData);
            break;
          default:
            break;
        }
      } else {
        setErrors({ message: 'No estás autenticado. Por favor, inicia sesión.' });
      }
    } catch (error) {
      setErrors({ message: error.response.data.message });
    }
  }

  async function fetchGameStats() {
    try {
      const currentUserId = localStorage.getItem('userId');
      const response = await axios.get(`${API_URL}/api/user/${currentUserId}/game-stats`);
      setGameStats(response.data);
    } catch (error) {
      setErrors({ message: 'Error al obtener las estadísticas de juegos completados' });
    }
  }

  async function fetchMostUsedDecks() {
    try {
      const currentUserId = localStorage.getItem('userId');
      const response = await axios.get(`${API_URL}/api/user/${currentUserId}/most-used-decks`);
      setMostUsedDecks(response.data);
    } catch (error) {
      setErrors({ message: 'Error al obtener las estadísticas de mazos más usados' });
    }
  }

  useEffect(() => {
    fetchUserData();
    fetchGameStats();
    fetchMostUsedDecks();
  }, [authenticated]);

  const getGameName = (type) => {
    const game = gameTypes.find(game => game.type === type);
    return game ? game.name : type;
  };

  const groupedDecks = mostUsedDecks.reduce((acc, stat) => {
    if (!acc[stat.gameType]) {
      acc[stat.gameType] = [];
    }
    acc[stat.gameType].push(stat);
    return acc;
  }, {});

  return (
    <div className="flex items-center justify-center">
      <div className="container">
        <div className="card">
          {errors.message && (
            <p className='text-blue-700'>{errors.message}</p>
          )}
          <h2 className="title">Estadísticas del Usuario</h2>
          <hr className="divider" />
          <div className="stats">
            <p><strong>Total de Cartas Creadas:</strong> {user.cards && user.cards.length}</p>
            <p><strong>Total de Mazos Creados:</strong> {user.decks && user.decks.length}</p>
            <p><strong>Total de Partidas Completadas por Tipo:</strong></p>
            <ul className="statsList list-none">
              {gameStats.map(stat => (
                <li key={stat.gameType}>
                  {getGameName(stat.gameType)}: {stat.totalCompleted}
                </li>
              ))}
            </ul>
            <p><strong>Mazos Más Usados por Tipo de Juego:</strong></p>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(groupedDecks).map(([gameType, decks]) => (
                <div key={gameType} className="col-span-1">
                  <h3>{getGameName(gameType)}</h3>
                  <ul className="statsList list-none">
                    {decks.slice(0, 3).map((stat, index) => (
                      <li key={`${stat.gameType}-${stat.deckName}`}>
                        {index + 1}º {stat.deckName.replace(/(-[a-z0-9]{6,})+$/, '')} ({stat.count} veces)
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}