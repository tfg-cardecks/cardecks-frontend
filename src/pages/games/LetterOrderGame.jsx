import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import Swal from 'sweetalert2';

export default function LetterOrderGame() {
  const { letterOrderGameId } = useParams();
  const navigate = useNavigate();
  const [letterOrderGame, setLetterOrderGame] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [answerSubmitted, setAnswerSubmitted] = useState(new Map());
  const [isCorrect, setIsCorrect] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameLost, setGameLost] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(6);
  const timerRef = useRef(null);
  const [currentWords, setCurrentWords] = useState([]);
  const [letters, setLetters] = useState([]);
  const [wordLines, setWordLines] = useState([]);
  const [draggingLetter, setDraggingLetter] = useState(null);
  const [completedWords, setCompletedWords] = useState([]);
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!isLandscape) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-center text-xl font-bold text-gray-700">
          Por favor, gira tu dispositivo para jugar en modo horizontal.
        </p>
      </div>
    );
  }

  async function fetchLetterOrderGame() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/letterOrderGame/${letterOrderGameId}`, {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
        },
      });
      const data = await response.json();

      switch (response.status) {
        case 200:
          const uniqueWords = Array.from(new Set(data.words.map(wordObj => wordObj.word)));
          const combinedWord = combineWords(uniqueWords);
          setLetterOrderGame(data);
          setCurrentWords(uniqueWords);
          setLetters([shuffleArray(removeDuplicateLetters(combinedWord.split('')))]);
          setWordLines(uniqueWords.map(word => new Array(word.length).fill('')));
          setAnswerSubmitted(new Map());
          setIsCorrect(false);
          setGameLost(false);
          setGameWon(false);
          setTimeLeft(data.duration);
          setRemainingAttempts(6);
          setCompletedWords(new Array(uniqueWords.length).fill(false));
          break;
        case 401:
        case 404:
          setErrorMessage(data.message);
          break;
        default:
          break;
      }
    } catch (error) {
      setErrorMessage('Error al cargar el juego de ordenar letras');
    }
  }

  function combineWords(words) {
    return words.join('');
  }

  function removeDuplicateLetters(array) {
    return Array.from(new Set(array));
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async function fetchDeck() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/api/deck/${letterOrderGame?.deck}`, {
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
    fetchLetterOrderGame();
  }, [letterOrderGameId]);

  useEffect(() => {
    if (letterOrderGame) {
      fetchDeck();
    }
  }, [letterOrderGame]);

  useEffect(() => {
    if (letterOrderGame) {
      const words = letterOrderGame.words.map(wordObj => wordObj.word);
      const combinedWord = Array.from(new Set(words.join(''))).join('');
      const shuffledLetters = shuffleArray(combinedWord.split(''));

      setCurrentWords(words);
      setLetters([shuffledLetters]);
      setWordLines(words.map(word => new Array(word.length).fill('')));
      setAnswerSubmitted(new Map());
      setIsCorrect(false);
      setGameLost(false);
      setGameWon(false);
      setRemainingAttempts(6);
      setCompletedWords(new Array(words.length).fill(false));
    }
  }, [letterOrderGame]);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && letterOrderGame) {
      if (letterOrderGame.game.currentGameCount >= letterOrderGame.game.totalGames) {
        handleForceCompleteFinalGame();
      } else {
        const correctAnswersText = letterOrderGame.words.map(wordObj => wordObj.word).join(', ');

        setTimeout(() => {
          Swal.fire({
            icon: 'warning',
            title: 'Tiempo agotado',
            text: `Has perdido esta partida. Las palabras eran: ${correctAnswersText}`,
          }).then(() => {
            handleForceCompleteFirstGame();
          });
        }, 500);
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, letterOrderGame]);

  useEffect(() => {
    if (gameLost) {
      const correctAnswersText = letterOrderGame.words.map(wordObj => wordObj.word).join(', ');

      setTimeout(() => {
        Swal.fire({
          icon: 'error',
          title: '¡Has perdido!',
          text: `Las palabras correctas eran: ${correctAnswersText}`,
        }).then(() => {
          setGameLost(true);
          clearTimeout(timerRef.current);
        });
      }, 4000);
    }
  }, [gameLost, letterOrderGame]);

  useEffect(() => {
    if (gameWon) {
      const correctAnswersText = letterOrderGame.words.map(wordObj => wordObj.word).join(', ');

      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: '¡Correcto!',
          text: `Las palabras eran: ${correctAnswersText}`,
        }).then(() => {
          setGameWon(true);
          clearTimeout(timerRef.current);
          handleNextGame();
        });
      }, 500);
    }
  }, [gameWon, letterOrderGame]);

  async function handleNextGame(countAsCompleted = true) {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${API_URL}/api/currentLetterOrderGame/${letterOrderGameId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({ selectedAnswer: Object.fromEntries(answerSubmitted), countAsCompleted }),
      });
      const data = await response.json();
      switch (response.status) {
        case 201:
          const newLetterOrderGameId = data.letterOrderGameId;
          navigate(`/letterOrderGame/${newLetterOrderGameId}`);
          break;
        case 200:
          setTimeout(() => {
            Swal.fire({
              icon: 'success',
              title: 'Juego Completado',
              text: data.message,
            }).then(() => {
              navigate('/lobby');
            });
          }, 1000);
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
      setErrorMessage('No hay suficientes cartas válidas para encajar en la siguiente partida. Por favor, añade más cartas al mazo para poder crear un nuevo juego.');
    }
  }

  async function handleForceCompleteFirstGame() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(`${API_URL}/api/currentLetterOrderGame/${letterOrderGameId}`, { forceComplete: true, selectedAnswer: Object.fromEntries(answerSubmitted) }, {
        headers: {
          Authorization: ` ${token}`,
        },
      });
      switch (response.status) {
        case 201:
          const newLetterOrderGameId = response.data.letterOrderGameId;
          navigate(`/letterOrderGame/${newLetterOrderGameId}`);
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
      const response = await axios.post(`${API_URL}/api/currentLetterOrderGame/${letterOrderGameId}`, { forceComplete: true, selectedAnswer: Object.fromEntries(answerSubmitted) }, {
        headers: {
          Authorization: ` ${token}`,
        },
      });
      switch (response.status) {
        case 200:
          const correctAnswersText = letterOrderGame.words.map(wordObj => wordObj.word).join(', ');

          setTimeout(() => {
            Swal.fire({
              icon: 'error',
              title: 'Tiempo agotado',
              text: `Has perdido esta partida. Las palabras eran: ${correctAnswersText} y el juego ha sido completado.`,
            }).then(() => {
              navigate('/lobby');
            });
          }, 500);
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

  const handleDragStart = (letter, wordIndex) => {
    setDraggingLetter({ letter, wordIndex });
  };

  const handleDrop = (wordIndex, letterIndex) => {
    if (draggingLetter !== null) {
      const newWordLines = [...wordLines];
      newWordLines[wordIndex][letterIndex] = draggingLetter.letter;
      setWordLines(newWordLines);
      setDraggingLetter(null);
    }
  };

  const handleSubmit = (wordIndex) => {
    const formedWord = wordLines[wordIndex].join('');
    let isWordCorrect = false;

    if (formedWord === currentWords[wordIndex]) {
      const newCompletedWords = [...completedWords];
      newCompletedWords[wordIndex] = true;
      setCompletedWords(newCompletedWords);
      isWordCorrect = true;
      if (currentWords.length > 1 && newCompletedWords.filter(word => !word).length === 1) {
        Swal.fire({
          icon: 'success',
          title: '¡Correcto!',
          text: `Has acertado la palabra: ${formedWord}`,
        });
        ;
      }
      if (newCompletedWords.every(word => word)) {
        setGameWon(true);
      }
    } else {
      setRemainingAttempts(remainingAttempts - 1);
      if (remainingAttempts - 1 === 0) {
        setGameLost(true);
      } else {
        Swal.fire({
          icon: 'error',
          title: '¡Has fallado!',
          text: `Intentos restantes: ${remainingAttempts - 1}`,
        });
      }
    }

    setIsCorrect(isWordCorrect);

    if (!isWordCorrect) {
      const newWordLines = [...wordLines];
      newWordLines[wordIndex] = new Array(newWordLines[wordIndex].length).fill('');
      setWordLines(newWordLines);
    }
  };

  const renderLetters = () => {
    return letters.map((letterArray, wordIndex) => (
      <div key={wordIndex} className="letters-container flex flex-wrap mb-4">
        {letterArray.map((letter, index) => (
          <div
            key={index}
            className="letter p-2 border rounded-lg m-2 cursor-pointer"
            draggable
            onDragStart={() => handleDragStart(letter, wordIndex)}
          >
            {letter}
          </div>
        ))}
      </div>
    ));
  };

  const renderWordLines = () => {
    return wordLines.map((lineArray, wordIndex) => (
      <div key={wordIndex} className="word-lines-container flex mb-4">
        {lineArray.map((line, index) => (
          <div
            key={index}
            className="word-line p-4 border rounded-lg m-2"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(wordIndex, index)}
          >
            {line}
          </div>
        ))}
        <button
          className="bg-gradient-to-r from-blue-200 to-blue-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-blue-300 focus:outline-none mt-4 ml-12"
          onClick={() => handleSubmit(wordIndex)}
          disabled={lineArray.includes('') || completedWords[wordIndex]}
        >
          Enviar Palabra
        </button>
      </div>
    ));
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Juego de Ordenar Letras</h1>
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
        Mazo: {deckName}
      </h2>
      <h3 className="text-xl font-semibold mb-6 text-center text-red-600">
        Tiempo restante: {timeLeft} segundos
      </h3>
      <h3 className="text-xl font-semibold mb-6 text-center text-green-600">
        Partida: {letterOrderGame?.game.currentGameCount}/{letterOrderGame?.game.totalGames}
      </h3>
      <h3 className="text-xl font-semibold mb-6 text-center text-yellow-600">
        Intentos restantes: {remainingAttempts}
      </h3>
      {errorMessage ? (
        <p className="text-red-600">{errorMessage}</p>
      ) : !letterOrderGame ? (
        <p>Cargando...</p>
      ) : (
        <>
          <div className="relative flex flex-col items-center">
            {renderLetters()}
            {renderWordLines()}
          </div>
          <div className="flex items-center">
            {gameLost || gameWon ? (
              letterOrderGame.game.currentGameCount < letterOrderGame.game.totalGames ? (
                <button onClick={() => handleNextGame(!gameLost)} className="hidden">Siguiente Juego</button>
              ) : (
                navigate('/lobby')
              )
            ) : null}
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mt-4">
            <button
              className="px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-gray-200 to-gray-400 text-black transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-gray-300 focus:outline-none w-full md:w-auto"
              onClick={() => navigate('/lobby')}
            >
              Volver al Catálogo de Juegos
            </button>
            <button
              className="px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-gray-200 to-gray-400 text-black transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-gray-300 focus:outline-none w-full md:w-auto"
              onClick={() => navigate(`/selectDeckGame/LetterOrderGame/${letterOrderGame.user}`)}
            >
              Cambiar de Mazo
            </button>
          </div>
        </>
      )}
    </div>
  );
}