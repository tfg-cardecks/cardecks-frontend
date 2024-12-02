import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import Swal from 'sweetalert2';

export default function GuessTheImageGame() {
  const { guessTheImageGameId } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [time, setTime] = useState(0);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [deckName, setDeckName] = useState('');

  async function fetchGameData() {
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
          setGameData(data);
          setSelectedAnswer('');
          setAnswerSubmitted(false);
          setIsCorrect(false);
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
      const response = await axios.get(`${API_URL}/api/deck/${gameData.deck}`, {
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
      setErrorMessage('Error al cargar la baraja');
    }
  }

  useEffect(() => {
    fetchGameData();
  }, [guessTheImageGameId]);
  
  useEffect(() => {
    if (gameData) {
      fetchDeck();
    }
  }, [gameData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleAnswerSubmit() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${API_URL}/api/currentGuessTheImageGame/${guessTheImageGameId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify({ selectedAnswer, timeTaken: time }),
        }
      );
      const data = await response.json();

      switch (response.status) {
        case 201:
          const newGuessTheImageGameId = data.guessTheImageGameId;
          navigate(`/guessTheImageGame/${newGuessTheImageGameId}`);
          break;
        case 200:
          Swal.fire({
            icon: 'success',
            title: 'Juego completado',
            text: 'Has completado 25 juegos de adivinar la imagen.',
          }).then(() => {
            navigate('/user/details');
          });
          break;
        case 401:
        case 404:
        case 400:
          setErrorMessage(data.message);
          break;
        default:
          break;
      }
    } catch (error) {
      setErrorMessage('Error al enviar la respuesta');
    }
  }

  async function handleForceComplete() {
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
          Swal.fire({
            icon: 'success',
            title: 'Juego completado forzosamente',
            text: 'El juego ha sido completado forzosamente.',
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

  const renderImage = () => {
    if (!gameData || !gameData.image) return null;

    return (
      <div className="image-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <img src={gameData.image} alt="Adivina la imagen" className="w-full h-auto" />
        <p className="mt-4 text-center">{time} segundos</p>
      </div>
    );
  };

  const renderOptions = () => {
    if (!gameData || !gameData.options) return null;

    return (
      <div className="options-container mt-4 grid grid-cols-2 gap-4">
        {gameData.options.map((option, index) => (
          <button
            key={index}
            className={`option-button p-4 border rounded-lg text-center ${selectedAnswer === option ? 'bg-gray-300' : ''} ${answerSubmitted ? (option === gameData.correctAnswer ? 'bg-green-500' : (option === selectedAnswer ? 'bg-red-500' : '')) : ''}`}
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
    if (selectedAnswer === gameData.correctAnswer) {
      setIsCorrect(true);
      Swal.fire({
        icon: 'success',
        title: '¡Correcto!',
        text: 'Has acertado la respuesta.',
      });
    } else {
      setIsCorrect(false);
      Swal.fire({
        icon: 'error',
        title: '¡Incorrecto!',
        text: `La respuesta correcta era: ${gameData.correctAnswer}`,
      });
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-10 text-center">Adivina la Imagen</h1>
      <h1 className="text-3xl font-bold mb-4 text-center">Mazo: {deckName}</h1>
      {errorMessage ? (
        <p className="text-red-600">{errorMessage}</p>
      ) : !gameData ? (
        <p>Cargando...</p>
      ) : (
        <div className="flex">
          <div>
            {renderImage()}
          </div>
          <div className="ml-32">
            {renderOptions()}
            <button
              className="bg-gradient-to-r from-blue-200 to-blue-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-blue-300 focus:outline-none mt-4 ml-8"
              onClick={handleSubmit}
              disabled={!selectedAnswer || answerSubmitted}
            >
              Enviar Respuesta
            </button>
            {answerSubmitted && (
              <button
                className="bg-gradient-to-r from-green-200 to-green-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-green-300 focus:outline-none mt-4 ml-4"
                onClick={handleAnswerSubmit}
              >
                Siguiente
              </button>
            )}
            <div className="flex space-x-4 mt-4">
              <button
                className="px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-red-200 to-red-400 text-black transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-red-300 focus:outline-none w-48 duration-300"
                onClick={handleForceComplete}
              >
                Forzar Completado
              </button>
              <button
                className="px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-gray-200 to-gray-400 text-black transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-gray-300 focus:outline-none w-48 duration-300"
                onClick={() => navigate('/lobby')}
              >
                Volver al Catálogo de Juegos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}