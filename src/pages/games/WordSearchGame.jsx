import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import Swal from 'sweetalert2';

export default function WordSearchGame() {
  const { wordSearchGameId } = useParams();
  const navigate = useNavigate();
  const [wordSearchGame, setWordSearchGame] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCells, setSelectedCells] = useState([]);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [allWordsFound, setAllWordsFound] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  async function fetchWordSearchGame() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/wordSearchGame/${wordSearchGameId}`, {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
        },
      });
      const data = await response.json();
      switch (response.status) {
        case 200:
          setWordSearchGame(data);
          setFoundWords([]);
          setHighlightedCells([]);
          setSelectedCells([]);
          setAllWordsFound(false);
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
      setErrorMessage('Error al cargar la sopa de letras');
    }
  }

  async function fetchDeck() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/api/deck/${wordSearchGame.deck}`, {
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
    fetchWordSearchGame();
  }, [wordSearchGameId]);

  useEffect(() => {
    if (wordSearchGame) {
      fetchDeck();
    }
  }, [wordSearchGame]);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && wordSearchGame) {
      if (wordSearchGame.game.currentGameCount >= wordSearchGame.game.totalGames) {
        handleForceCompleteFinalGame();
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Tiempo agotado',
          text: 'El tiempo se ha agotado. Has perdido esta partida.',
        }).then(() => {
          handleForceCompleteFirstGame();
        });
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, wordSearchGame]);

  function isAdjacent(cell1, cell2) {
    const rowDiff = Math.abs(cell1.row - cell2.row);
    const colDiff = Math.abs(cell1.col - cell2.col);
    return (rowDiff <= 1 && colDiff <= 1) && !(rowDiff === 0 && colDiff === 0);
  }

  function isContinuousDirection(cells) {
    if (cells.length < 2) return true;
    const direction = {
      row: cells[1].row - cells[0].row,
      col: cells[1].col - cells[0].col,
    };
    for (let i = 1; i < cells.length; i++) {
      const currentDirection = {
        row: cells[i].row - cells[i - 1].row,
        col: cells[i].col - cells[i - 1].col,
      };
      if (currentDirection.row !== direction.row || currentDirection.col !== direction.col) {
        return false;
      }
    }
    return true;
  }

  function handleCellClick(rowIndex, cellIndex) {
    const newCell = { row: rowIndex, col: cellIndex };
    if (selectedCells.length === 0 || (isAdjacent(selectedCells[selectedCells.length - 1], newCell) && isContinuousDirection([...selectedCells, newCell]))) {
      const newSelectedCells = [...selectedCells, newCell];
      if (newSelectedCells.length === wordSearchGame.grid.length * wordSearchGame.grid[0].length) {
        setSelectedCells([]);
      } else {
        setSelectedCells(newSelectedCells);
      }
    } else {
      setSelectedCells([]);
    }
  }

  useEffect(() => {
    if (selectedCells.length > 1) {
      const word = selectedCells.map(cell => wordSearchGame.grid[cell.row][cell.col]).join('');
      const cleanedWord = cleanWord(word);
      const cleanedWords = wordSearchGame.words.map((word) => cleanWord(word));
      if (cleanedWords.includes(cleanedWord) && !foundWords.includes(cleanedWord)) {
        setFoundWords(prevFoundWords => {
          const newFoundWords = [...prevFoundWords, cleanedWord];
          return newFoundWords;
        });
        setHighlightedCells(prevHighlightedCells => [...prevHighlightedCells, ...selectedCells]);
        setSelectedCells([]);
      }
    }
  }, [selectedCells, wordSearchGame, foundWords]);

  useEffect(() => {
    if (wordSearchGame && foundWords.length === wordSearchGame.words.length) {
      Swal.fire({
        icon: 'success',
        title: '¡Felicidades!',
        text: 'Has encontrado todas las palabras.',
      }).then(() => {
        setAllWordsFound(true);
        clearTimeout(timerRef.current);
        handleNextGame();
      });
    }
  }, [foundWords, wordSearchGame]);

  async function handleNextGame() {
    try {
      const token = localStorage.getItem('access_token');
      const cleanedFoundWords = foundWords.map((word) => separateWord(word, wordSearchGame.words));
      const response = await axios.post(
        `${API_URL}/api/currentWordSearchGame/${wordSearchGameId}`,
        { foundWords: cleanedFoundWords },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      switch (response.status) {
        case 201:
          const newWordSearchGameId = response.data.wordSearchGameId;
          window.location.href = `/wordSearchGame/${newWordSearchGameId}`;
          break;
        case 200:
          Swal.fire({
            icon: 'success',
            title: 'Juego Completado',
            text: response.data.message,
          }).then(() => {
            navigate('/user/details');
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
      setErrorMessage('No hay suficientes palabras válidas para encajar en la siguiente cuadrícula. Por favor, añada cartas al mazo para poder crear un nuevo juego.');
    }
  }

  async function handleForceCompleteFirstGame() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(`${API_URL}/api/currentWordSearchGame/${wordSearchGameId}`, { forceComplete: false, foundWords }, {
        headers: {
          Authorization: ` ${token}`,
        },
      });
      switch (response.status) {
        case 201:
          const newWordSearchGameId = response.data.wordSearchGameId;
          window.location.href = `/wordSearchGame/${newWordSearchGameId}`;
          break;
        case 200:
          if (response.data.nextGame) {
            Swal.fire({
              icon: 'warning',
              title: 'Tiempo agotado',
              text: 'El tiempo se ha agotado. Has perdido esta partida.',
            }).then(() => {
              handleNextGame();
            });
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
      setErrorMessage('Error al forzar la finalización de la sopa de letras');
    }
  }

  async function handleForceCompleteFinalGame() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(`${API_URL}/api/currentWordSearchGame/${wordSearchGameId}`, { forceComplete: true, foundWords }, {
        headers: {
          Authorization: ` ${token}`,
        },
      });
      switch (response.status) {
        case 200:
          Swal.fire({
            icon: 'error',
            title: 'Tiempo agotado',
            text: 'El tiempo se ha agotado. Has perdido esta partida y el juego ha sido completado.',
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
      setErrorMessage('Error al forzar la finalización de la sopa de letras');
    }
  }

  const renderGrid = () => {
    if (!wordSearchGame || !wordSearchGame.grid) return null;

    return (
      <div className="grid grid-cols-10 gap-1">
        {wordSearchGame.grid.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((cell, cellIndex) => {
              const isSelected = selectedCells.some(selected => selected.row === rowIndex && selected.col === cellIndex);
              const isHighlighted = highlightedCells.some(highlighted => highlighted.row === rowIndex && highlighted.col === cellIndex);
              return (
                <div
                  key={cellIndex}
                  className={`border p-2 text-center cursor-pointer ${isSelected || isHighlighted ? 'bg-yellow-300' : ''}`}
                  style={{ width: '30px', height: '30px', lineHeight: '20px', paddingTop: '5px' }}
                  onClick={() => handleCellClick(rowIndex, cellIndex)}
                >
                  {cell}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderWordsToFind = () => {
    if (!wordSearchGame || !wordSearchGame.words) return null;

    return (
      <div className="ml-4">
        <h2 className="text-xl font-bold mb-2 mt-4">Palabras a Buscar:</h2>
        <ul>
          {wordSearchGame.words.map((word, index) => (
            <li key={index} className={`mb-1 ${foundWords.includes(cleanWord(word)) ? 'line-through' : ''}`}>
              {word}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      {errorMessage ? (
        <p className="text-red-600">{errorMessage}</p>
      ) : !wordSearchGame ? (
        <p>Cargando...</p>
      ) : (
        <>
          <div>
            <h1 className="text-4xl font-extrabold mb-6 text-center">
              Sopa de Letras
            </h1>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
              Mazo: {deckName}
            </h2>
            <h3 className="text-xl font-semibold mb-6 text-center text-red-600">
              Tiempo restante: {timeLeft} segundos
            </h3>
            <h3 className="text-xl font-semibold mb-6 text-center text-green-600">
              Partida: {wordSearchGame.game.currentGameCount}/{wordSearchGame.game.totalGames}
            </h3>
            {renderGrid()}
          </div>
          {renderWordsToFind()}
          {allWordsFound && wordSearchGame.game.currentGameCount < wordSearchGame.game.totalGames && (
            <button
              className="bg-gradient-to-r from-blue-200 to-blue-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-blue-300 focus:outline-none" style={{ marginTop: '2%' }}
              onClick={handleNextGame}
            >
              Siguiente
            </button>
          )}
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mt-4">
            <button
              className="px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-gray-200 to-gray-400 text-black transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-gray-300 focus:outline-none w-full md:w-auto"
              onClick={() => navigate('/lobby')}
            >
              Volver al Catálogo de Juegos
            </button>
            <button
              className="px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-gray-200 to-gray-400 text-black transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-gray-300 focus:outline-none w-full md:w-auto"
              onClick={() => navigate(`/selectDeckGame/WordSearchGame/${wordSearchGame.user}`)}
            >
              Cambiar de Mazo
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function cleanWord(word) {
  const withoutSpaces = word.replace(/\s+/g, '');
  const withoutAccents = withoutSpaces.normalize("NFD").replace(/[\u0300-\u036f]/g, '');
  return withoutAccents.replace(/[^A-Z]/gi, '').toUpperCase();
}

function separateWord(concatenatedWord, originalWords) {
  const cleanedConcatenatedWord = cleanWord(concatenatedWord);
  for (const originalWord of originalWords) {
    const cleanedOriginalWord = cleanWord(originalWord);
    if (cleanedConcatenatedWord === cleanedOriginalWord.replace(/\s+/g, '')) {
      return originalWord;
    }
  }
  return concatenatedWord;
}