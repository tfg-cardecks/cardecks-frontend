import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import Swal from 'sweetalert2';

export default function GuessTheImageGame() {
  const { guessTheImageGameId } = useParams();
  const navigate = useNavigate();
  const [guessTheImageGame, setGuessTheImageGame] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameLost, setGameLost] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const timerRef = useRef(null);

  async function fetchGuessTheImageGame() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/guessTheImageGame/${guessTheImageGameId}`, {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
        },
      });
      const data = await response.json();
      switch (response.status) {
        case 200:
          setGuessTheImageGame(data);
          setSelectedAnswer('');
          setAnswerSubmitted(false);
          setIsCorrect(false);
          setGameLost(false);
          setGameWon(false);
          setTimeLeft(data.duration);
          break;
        case 401:
        case 404:
          setErrorMessage(data.message);
          break;
        default:
          break;
      }
    } catch (error) {
      setErrorMessage('Error al cargar el juego de adivinar la imagen');
    }
  }

  async function fetchDeck() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/api/deck/${guessTheImageGame?.deck}`, {
        headers: {
          Authorization: ` ${token}`,
        },
      });
      switch (response.status) {
        case 200:
          setDeckName(response.data.name.replace(/(-[a-z0-9]{6,})+$/, ''));
          break;
        case 401:
        case 404:
          setErrorMessage(response.data.message);
          break;
        default:
          break;
      }
    } catch (error) {
      setErrorMessage('Error al cargar el mazo');
    }
  }

  useEffect(() => {
    if (guessTheImageGameId) {
      fetchGuessTheImageGame();
    }
  }, [guessTheImageGameId]);

  useEffect(() => {
    if (guessTheImageGame) {
      fetchDeck();
    }
  }, [guessTheImageGame]);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && guessTheImageGame) {
      if (guessTheImageGame.game.currentGameCount >= guessTheImageGame.game.totalGames) {
        handleForceCompleteFinalGame();
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Tiempo agotado',
          text: `Has perdido esta partida. La palabra era: ${guessTheImageGame.correctAnswer}`,
        }).then(() => {
          handleForceCompleteFirstGame();
        });
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, guessTheImageGame]);

  useEffect(() => {
    if (gameLost) {
      Swal.fire({
        icon: 'error',
        title: '¡Has perdido!',
        text: `La respuesta correcta era: ${guessTheImageGame.correctAnswer}`,
      }).then(() => {
        setGameLost(true);
        clearTimeout(timerRef.current);
        handleNextGame(true);
      });
    }
  }, [gameLost, guessTheImageGame]);

  useEffect(() => {
    if (gameWon) {
      Swal.fire({
        icon: 'success',
        title: '¡Correcto!',
        text: `La respuesta era: ${guessTheImageGame.correctAnswer}`,
      }).then(() => {
        setGameWon(true);
        clearTimeout(timerRef.current);
        handleNextGame(true);
      });
    }
  }, [gameWon, guessTheImageGame]);

  async function handleNextGame(countAsCompleted = true) {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${API_URL}/api/currentGuessTheImageGame/${guessTheImageGameId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({ selectedAnswer, countAsCompleted }),
      });
      const data = await response.json();
      switch (response.status) {
        case 201:
          const newGuessTheImageGameId = data.guessTheImageGameId;
          navigate(`/guessTheImageGame/${newGuessTheImageGameId}`);
          break;
        case 200:
          Swal.fire({
            icon: 'success',
            title: 'Juego Completado',
            text: data.message,
          }).then(() => {
            navigate('/lobby');
          });
          break;
        case 401:
        case 404:
        case 400:
          setErrorMessage(data.error);
          break;
        default:
          setErrorMessage('Error al pasar a la siguiente partida');
          break;
      }
    } catch (error) {
      setErrorMessage('No hay suficientes imágenes válidas para encajar en la siguiente partida. Por favor, añade más imágenes al mazo para poder crear un nuevo juego.');
    }
  }

  async function handleForceCompleteFirstGame() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(`${API_URL}/api/currentGuessTheImageGame/${guessTheImageGameId}`, { forceComplete: true, selectedAnswer }, {
        headers: {
          Authorization: ` ${token}`,
        },
      });
      switch (response.status) {
        case 201:
          const newGuessTheImageGameId = response.data.guessTheImageGameId;
          navigate(`/guessTheImageGame/${newGuessTheImageGameId}`);
          break;
        case 200:
          if (response.data.nextGame) {
            handleNextGame();
          }
          break;
        case 401:
        case 404:
        case 400:
          setErrorMessage(response.data.message);
          break;
        default:
          break;
      }
    } catch (error) {
      setErrorMessage('Error al forzar la finalización del juego');
    }
  }

  async function handleForceCompleteFinalGame() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(`${API_URL}/api/currentGuessTheImageGame/${guessTheImageGameId}`, { forceComplete: true, selectedAnswer }, {
        headers: {
          Authorization: ` ${token}`,
        },
      });
      switch (response.status) {
        case 200:
          Swal.fire({
            icon: 'error',
            title: 'Tiempo agotado',
            text: `Has perdido esta partida. La imagen era: ${guessTheImageGame.correctAnswer} y el juego ha sido completado.`,
          }).then(() => {
            navigate('/lobby');
          });
          break;
        case 401:
        case 404:
        case 400:
          setErrorMessage(response.data.message);
          break;
        default:
          break;
      }
    } catch (error) {
      setErrorMessage('Error al forzar la finalización del juego');
    }
  }

  useEffect(() => {
    if (guessTheImageGame) {
      setSelectedAnswer('');
      setAnswerSubmitted(false);
      setIsCorrect(false);
      setGameLost(false);
      setGameWon(false);
    }
  }, [guessTheImageGame]);

  const renderImage = () => {
    if (!guessTheImageGame || !guessTheImageGame.image) return null;

    return (
      <div className="image-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <img src={guessTheImageGame.image} alt="Adivina la imagen" className="w-full h-auto" />
      </div>
    );
  };

  const renderOptions = () => {
    if (!guessTheImageGame || !guessTheImageGame.options) return null;

    return (
      <div className="options-container mt-4 grid grid-cols-2 gap-4">
        {guessTheImageGame.options.map((option, index) => (
          <button
            key={index}
            className={`option-button p-4 border rounded-lg text-center ${selectedAnswer === option ? 'bg-gray-300' : ''} ${answerSubmitted ? (option === guessTheImageGame.correctAnswer ? 'bg-green-500' : (option === selectedAnswer ? 'bg-red-500' : '')) : ''}`}
            onClick={() => setSelectedAnswer(selectedAnswer === option ? '' : option)}
            disabled={answerSubmitted}
          >
            {index + 1}. {option}
          </button>
        ))}
      </div>
    );
  };

  const handleSubmit = () => {
    setAnswerSubmitted(true);
    if (selectedAnswer === guessTheImageGame.correctAnswer) {
      setIsCorrect(true);
      setGameWon(true);
    } else {
      setIsCorrect(false);
      setGameLost(true);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Adivina la Imagen</h1>
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
        Mazo: {deckName}
      </h2>
      <h3 className="text-xl font-semibold mb-6 text-center text-red-600">
        Tiempo restante: {timeLeft} segundos
      </h3>
      <h3 className="text-xl font-semibold mb-6 text-center text-green-600">
        Partida: {guessTheImageGame?.game.currentGameCount}/{guessTheImageGame?.game.totalGames}
      </h3>
      {errorMessage ? (
        <p className="text-red-600">{errorMessage}</p>
      ) : !guessTheImageGame ? (
        <p>Cargando...</p>
      ) : (
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
          <div className="w-full md:w-1/2">
            {renderImage()}
          </div>
          <div className="w-full md:w-1/2">
            {renderOptions()}
            <button
              className="bg-gradient-to-r from-blue-200 to-blue-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-blue-300 focus:outline-none mt-4 w-full md:w-auto lg:ml-36"
              onClick={handleSubmit}
              disabled={!selectedAnswer || answerSubmitted}
            >
              Enviar Respuesta
            </button>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mt-4">
              <button
                className="px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-gray-200 to-gray-400 text-black transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-gray-300 focus:outline-none w-full md:w-auto"
                onClick={() => navigate('/lobby')}
              >
                Volver al Catálogo de Juegos
              </button>
              <button
                className="px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-gray-200 to-gray-400 text-black transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-gray-300 focus:outline-none w-full md:w-auto"
                onClick={() => navigate(`/selectDeckGame/GuessTheImageGame/${guessTheImageGame.user}`)}
              >
                Cambiar de Mazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}