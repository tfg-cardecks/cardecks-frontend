import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import Swal from 'sweetalert2';

import img0 from '../../images/imagesHangman/0.png';
import img1 from '../../images/imagesHangman/1.png';
import img2 from '../../images/imagesHangman/2.png';
import img3 from '../../images/imagesHangman/3.png';
import img4 from '../../images/imagesHangman/4.png';
import img5 from '../../images/imagesHangman/5.png';
import img6 from '../../images/imagesHangman/6.png';

const images = [img0, img1, img2, img3, img4, img5, img6];

function cleanWord(word) {
  const withoutSpaces = word.replace(/\s+/g, '');
  const withoutAccents = withoutSpaces.normalize("NFD").replace(/[\u0300-\u036f]/g, '');
  return withoutAccents.replace(/[^A-Z]/gi, '').toUpperCase();
}

export default function HangmanGame() {
  const { hangmanGameId } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [remainingAttempts, setRemainingAttempts] = useState(6);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameLost, setGameLost] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [time, setTime] = useState(0);
  const [deckName, setDeckName] = useState('');

  async function fetchGameData() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/hangmanGame/${hangmanGameId}`, {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
        },
      });
      const data = await response.json();
      switch (response.status) {
        case 200:
          setGameData(data);
          setGuessedLetters([]);
          setWrongLetters([]);
          setRemainingAttempts(6);
          setGameLost(false);
          setGameWon(false);
          setTime(0);
          break;
        case 401:
        case 404:
          setErrorMessage(data.message);
          break;
        default:
          break;
      }
    } catch (error) {
      setErrorMessage('Error al cargar el juego del ahorcado');
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
  }, [hangmanGameId]);

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

  function handleGuess() {
    const letter = currentGuess.toUpperCase();
    if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) {
      return;
    }

    const cleanedWord = cleanWord(gameData.words[gameData.currentWordIndex]);

    if (cleanedWord.includes(letter)) {
      setGuessedLetters([...guessedLetters, letter]);
    } else {
      setWrongLetters([...wrongLetters, letter]);
      setRemainingAttempts(remainingAttempts - 1);
    }
    setCurrentGuess('');
  }

  useEffect(() => {
    if (remainingAttempts === 0) {
      Swal.fire({
        icon: 'error',
        title: '¡Has perdido!',
        text: `La palabra era: ${gameData.words[gameData.currentWordIndex]}`,
      }).then(() => {
        setGameLost(true);
      });
    }
  }, [remainingAttempts, gameData]);

  useEffect(() => {
    if (gameData && cleanWord(gameData.words[gameData.currentWordIndex]).split('').every(letter => guessedLetters.includes(letter))) {
      Swal.fire({
        icon: 'success',
        title: '¡Has completado la palabra!',
        text: `La palabra era: ${gameData.words[gameData.currentWordIndex]}`,
      }).then(() => {
        setGameWon(true);
      });
    }
  }, [guessedLetters, gameData]);

  async function handleNextGame(countAsCompleted = true) {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${API_URL}/api/currentHangmanGame/${hangmanGameId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({ guessedLetters, wrongLetters, countAsCompleted, timeTaken: time }),
      });
      const data = await response.json();
      switch (response.status) {
        case 201:
          const newHangmanGameId = data.hangmanGameId;
          navigate(`/hangmanGame/${newHangmanGameId}`);
          break;
        case 200:
          Swal.fire({
            icon: 'success',
            title: 'Juego completado',
            text: 'Has completado 25 juegos de ahorcado.',
          }).then(() => {
            navigate('/user/details');
          });
          break;
        case 401:
        case 404:
        case 400:
          setErrorMessage(data.error);
          break;
        default:
          break;
      }
    } catch (error) {
      setErrorMessage('No hay suficientes palabras válidas para encajar en la siguiente cuadrícula. Por favor, añada cartas al mazo para poder crear un nuevo juego.');
    }
  }

  async function handleForceComplete() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(`${API_URL}/api/currentHangmanGame/${hangmanGameId}`, { forceComplete: true, timeTaken: time }, {
        headers: {
          Authorization: `${token}`,
        },
      });
      switch (response.status) {
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
      setErrorMessage('Error al forzar la finalización del juego del ahorcado');
    }
  }

  useEffect(() => {
    if (gameData) {
      setGuessedLetters([]);
      setWrongLetters([]);
      setRemainingAttempts(6);
      setGameLost(false);
      setGameWon(false);
      setTime(0);
    }
  }, [gameData]);

  const renderWord = () => {
    if (!gameData) return null;

    return gameData.words[gameData.currentWordIndex].split('').map((letter, index) => (
      <span key={index} className="letter" style={{ marginRight: "7%", fontSize: '2.5rem' }}>
        {guessedLetters.includes(cleanWord(letter)) ? letter : '_'}
      </span>
    ));
  };

  const renderImage = () => {
    const imageIndex = 6 - remainingAttempts;
    return <img src={images[imageIndex]} alt={`Hangman step ${imageIndex}`} className="hangman-image" />;
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-600">Juego del Ahorcado</h1>
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
        Mazo: {deckName}
      </h2>
      {errorMessage ? (
        <p className="text-red-600">{errorMessage}</p>
      ) : !gameData ? (
        <p>Cargando...</p>
      ) : (
        <div className="flex">
          <div>
            {renderImage()}
          </div>
          <div className='mr-6'>
            <div className="word">{renderWord()}</div>
            <div className="guess-input mt-4">
              <input
                type="text"
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value)}
                maxLength="1"
                className="border p-2 rounded-lg"
                placeholder="Introduce una letra"
                disabled={gameLost || gameWon}
              />
              <button
                onClick={handleGuess}
                className="ml-2 px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-green-600 text-white transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-green-300 focus:outline-none"
                disabled={gameLost || gameWon}
              >
                Confirmar
              </button>
            </div>
            <p className="mt-4">Intentos restantes: {remainingAttempts}</p>
            <p className="mt-4">Tiempo transcurrido: {time} segundos</p>
            <div className="used-letters mt-4">
              <div className="guessed-letters">
                <h2 className="text-xl font-bold">Letras adivinadas:</h2>
                <div className="letters-box border p-2 rounded-lg">
                  {guessedLetters.map((letter, index) => (
                    <span key={index} className="letter mr-2">{letter}</span>
                  ))}
                </div>
              </div>
              <div className="wrong-letters mt-4">
                <h2 className="text-xl font-bold">Letras incorrectas:</h2>
                <div className="letters-box border p-2 rounded-lg">
                  {wrongLetters.map((letter, index) => (
                    <span key={index} className="letter mr-2">{letter}</span>
                  ))}
                </div>
              </div>
            </div>
            {gameLost || gameWon || cleanWord(gameData.words[gameData.currentWordIndex]).split('').every(letter => guessedLetters.includes(letter)) ? (
              <button
                className="bg-gradient-to-r from-blue-200 to-blue-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-blue-300 focus:outline-none mt-4"
                onClick={() => handleNextGame(!gameLost)}
              >
                Siguiente
              </button>
            ) : null}
            <div className="flex space-x-4 mt-4">
              {!gameLost && !gameWon && (
                <button
                  className="px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-red-200 to-red-400 text-black transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-red-300 focus:outline-none w-48 duration-300"
                  onClick={handleForceComplete}
                >
                  Forzar Completado
                </button>
              )}
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