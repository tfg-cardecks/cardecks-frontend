import React, { useEffect, useState, useRef } from 'react';
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
  const [hangmanGame, setHangmanGame] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [remainingAttempts, setRemainingAttempts] = useState(6);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameLost, setGameLost] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  async function fetchHangmanGame() {
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
          setHangmanGame(data);
          setGuessedLetters([]);
          setWrongLetters([]);
          setRemainingAttempts(6);
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
      setErrorMessage('Error al cargar el juego del ahorcado');
    }
  }

  async function fetchDeck() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/api/deck/${hangmanGame.deck}`, {
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
    fetchHangmanGame();
  }, [hangmanGameId]);

  useEffect(() => {
    if (hangmanGame) {
      fetchDeck();
    }
  }, [hangmanGame]);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && hangmanGame) {
      if (hangmanGame.game.currentGameCount >= hangmanGame.game.totalGames) {
        handleForceCompleteFinalGame();
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Tiempo agotado',
          text: `Has perdido esta partida. La palabra era: ${hangmanGame.currentWord}`,
        }).then(() => {
          handleForceCompleteFirstGame();
        });
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, hangmanGame]);

  function handleGuess() {
    const letter = currentGuess.toUpperCase();
    if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) {
      return;
    }

    const cleanedWord = cleanWord(hangmanGame.words[hangmanGame.currentWordIndex]);

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
        text: `La palabra era: ${hangmanGame.words[hangmanGame.currentWordIndex]}`,
      }).then(() => {
        setGameLost(true);
        clearTimeout(timerRef.current);
      });
    }
  }, [remainingAttempts, hangmanGame]);

  useEffect(() => {
    if (hangmanGame && cleanWord(hangmanGame.words[hangmanGame.currentWordIndex]).split('').every(letter => guessedLetters.includes(letter))) {
      Swal.fire({
        icon: 'success',
        title: '¡Has completado la palabra!',
        text: `La palabra era: ${hangmanGame.words[hangmanGame.currentWordIndex]}`,
      }).then(() => {
        setGameWon(true);
        clearTimeout(timerRef.current);
        handleNextGame();
      });
    }
  }, [guessedLetters, hangmanGame]);

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
        body: JSON.stringify({ guessedLetters, wrongLetters, countAsCompleted }),
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
          break;
      }
    } catch (error) {
      setErrorMessage('No hay suficientes palabras válidas para encajar en la siguiente cuadrícula. Por favor, añada cartas al mazo para poder crear un nuevo juego.');
    }
  }

  async function handleForceCompleteFirstGame() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(`${API_URL}/api/currentHangmanGame/${hangmanGameId}`, { forceComplete: true, guessedLetters, wrongLetters }, {
        headers: {
          Authorization: ` ${token}`,
        },
      });
      switch (response.status) {
        case 201:
          const newHangmanGameId = response.data.hangmanGameId;
          navigate(`/hangmanGame/${newHangmanGameId}`);
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
      setErrorMessage('Error al forzar la finalización del juego del ahorcado');
    }
  }

  async function handleForceCompleteFinalGame() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(`${API_URL}/api/currentHangmanGame/${hangmanGameId}`, { forceComplete: true, guessedLetters, wrongLetters }, {
        headers: {
          Authorization: ` ${token}`,
        },
      });
      switch (response.status) {
        case 200:
          Swal.fire({
            icon: 'error',
            title: 'Tiempo agotado',
            text: `Has perdido esta partida. La palabra era: ${hangmanGame.currentWord} y el juego ha sido completado.`,
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
    if (hangmanGame) {
      setGuessedLetters([]);
      setWrongLetters([]);
      setRemainingAttempts(6);
      setGameLost(false);
      setGameWon(false);
    }
  }, [hangmanGame]);

  const renderWord = () => {
    if (!hangmanGame) return null;

    return hangmanGame.words[hangmanGame.currentWordIndex].split('').map((letter, index) => (
      <span key={index} className="letter" style={{ marginRight: "7%", fontSize: '2.5rem' }}>
        {guessedLetters.includes(cleanWord(letter)) ? letter : '_'}
      </span>
    ));
  };

  const renderImage = () => {
    const imageIndex = 6 - remainingAttempts;
    return <img src={images[imageIndex]} alt={`Hangman step ${imageIndex}`} className="hangman-image" />;
  };

  const handleGameCompletion = () => {
    Swal.fire({
      icon: 'success',
      title: 'Juego completado',
      text: '¡Has completado todas las partidas del juego!',
    }).then(() => {
      navigate('/lobby');
    });
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-600">Juego del Ahorcado</h1>
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
        Mazo: {deckName}
      </h2>
      <h3 className="text-xl font-semibold mb-6 text-center text-red-600">
        Tiempo restante: {timeLeft} segundos
      </h3>
      <h3 className="text-xl font-semibold mb-6 text-center text-green-600">
        Partida: {hangmanGame?.game.currentGameCount}/{hangmanGame?.game.totalGames}
      </h3>
      {errorMessage ? (
        <p className="text-red-600">{errorMessage}</p>
      ) : !hangmanGame ? (
        <p>Cargando...</p>
      ) : (
        <div className="flex">
          <div>
            {renderImage()}
          </div>
          <div className='ml-6'>
            <div className="word">{renderWord()}</div>
            <div className="guess-input mt-4 flex items-center">
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
            {gameLost || gameWon || cleanWord(hangmanGame.words[hangmanGame.currentWordIndex]).split('').every(letter => guessedLetters.includes(letter)) ? (
              hangmanGame.game.currentGameCount < hangmanGame.game.totalGames ? (
                <button onClick={() => handleNextGame(!gameLost)} className="hidden">Siguiente Juego</button>
              ) : (
                handleGameCompletion()
              )
            ) : null}
            <div className="flex space-x-4 mt-4">
              <button
                className="px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-gray-200 to-gray-400 text-black transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-gray-300 focus:outline-none w-48 duration-300"
                style={{ width: "240px" }}
                onClick={() => navigate('/lobby')}
              >
                Volver al Catálogo de Juegos
              </button>
              <button
                className="px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-gray-200 to-gray-400 text-black transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-gray-300 focus:outline-none w-48 duration-300"
                style={{ width: "240px" }}
                onClick={() => navigate(`/selectDeckGame/HangmanGame/${hangmanGame.user}`)}
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