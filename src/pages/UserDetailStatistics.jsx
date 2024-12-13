import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/authContext';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import '../styles/UserDetailStyles.css';
import Swal from 'sweetalert2';
import wordsearch from '../icon/wordsearch.png';
import guesstheword from '../icon/guesstheword.png';
import guesstheimage from '../icon/guesstheimage.png';
import guessthetext from '../icon/guesstheimage.png';
import memoryGame from '../icon/guesstheimage.png';
import strokeOrderGame from '../icon/guesstheimage.png';
import matchingGame from '../icon/guesstheimage.png';
import hangmanGame from '../icon/guesstheimage.png';
import speedMemoryWordGame from '../icon/guesstheimage.png';
import speedMemoryImageGame from '../icon/guesstheimage.png';

export default function UserDetailStatistics() {
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { authenticated } = useAuthContext();

  const gameTypes = [
    { type: 'WordSearchGame', name: 'Sopa de Letras', icon: wordsearch },
    { type: 'GuessTheWordGame', name: 'Adivina la Palabra', icon: guesstheword },
    { type: 'GuessTheImageGame', name: 'Adivina la Imagen', icon: guesstheimage },
    { type: 'GuessTheTextGame', name: 'Adivina el Texto', icon: guessthetext },
    { type: 'MemoryGame', name: 'Juego de Memoria', icon: memoryGame },
    { type: 'StrokeOrderGame', name: 'Orden de trazos', icon: strokeOrderGame },
    { type: 'MatchingGame', name: 'Juego de Relacionar', icon: matchingGame },
    { type: 'HangmanGame', name: 'Juego del Ahorcado', icon: hangmanGame },
    { type: 'SpeedMemoryWordGame', name: 'Juego de Memorización Rápida de Palabra', icon: speedMemoryWordGame },
    { type: 'SpeedMemoryImageGame', name: 'Juego de Memorización Rápida de Imagen', icon: speedMemoryImageGame },
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

  useEffect(() => {
    fetchUserData();
  }, [authenticated]);

  async function handleResetGamesCompleted(gameType) {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.patch(
        `${API_URL}/api/resetGamesCompletedByType`,
        { gameType },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      switch (response.status) {
        case 200:
          fetchUserData();
          Swal.fire({
            icon: 'success',
            title: 'Contador Reseteado',
            text: response.data.message,
          });
          break;
        case 400:
        case 401:
        case 404:
          setErrors(response.data.message);
          break;
        default:
          break;
      }
    } catch (error) {
      setErrors(error.response.data.message);
    }
  };

  const getGameName = (type) => {
    const game = gameTypes.find(game => game.type === type);
    return game ? game.name : type;
  };

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
            <div className="flex justify-between">
              <div className="w-1/2 pr-2">
                <p><strong>Juegos Completados por Tipo sin forzar:</strong></p>
                <ul className="statsList">
                  {user.gamesCompletedByType && Object.entries(user.gamesCompletedByType).map(([type, count]) => (
                    <li key={type} >
                      {getGameName(type)}: {count}
                      <button style={{
                        marginLeft: '5px',
                        border: '1px solid #000',
                        padding: '1px 5px',
                        borderRadius: '5px',
                      }} onClick={() => handleResetGamesCompleted(type)}>Resetear Contador</button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-1/2 pl-8">
                <p><strong>Total de Juegos Completados por Tipo:</strong></p>
                <ul className="statsList">
                  {user.totalGamesCompletedByType && Object.entries(user.totalGamesCompletedByType).map(([type, count]) => (
                    <li key={type}>
                      {getGameName(type)}: {count}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p><strong>Total de Cartas Creadas:</strong> {user.cards && user.cards.length}</p>
            <p><strong>Total de Mazos Creados:</strong> {user.decks && user.decks.length}</p>
            <p><strong>Total de Juegos Creados:</strong> {user.games && user.games.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}