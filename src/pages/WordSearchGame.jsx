import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

export default function WordSearchGame() {
  const { wordSearchGameId } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCells, setSelectedCells] = useState([]);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [allWordsFound, setAllWordsFound] = useState(false);
  const [time, setTime] = useState(0);

  const fetchGameData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/api/wordSearchGame/${wordSearchGameId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      switch (response.status) {
        case 200:
          setGameData(response.data);
          setFoundWords([]);
          setHighlightedCells([]);
          setSelectedCells([]);
          setAllWordsFound(false);
          break;
        case 401:
        case 404:
          setErrorMessage(response.data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error al cargar la sopa de letras');
    }
  };

  useEffect(() => {
    fetchGameData();
  }, [wordSearchGameId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isAdjacent = (cell1, cell2) => {
    const rowDiff = Math.abs(cell1.row - cell2.row);
    const colDiff = Math.abs(cell1.col - cell2.col);
    return (rowDiff <= 1 && colDiff <= 1) && !(rowDiff === 0 && colDiff === 0);
  };

  const isContinuousDirection = (cells) => {
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
  };

  const handleCellClick = (rowIndex, cellIndex) => {
    const newCell = { row: rowIndex, col: cellIndex };
    if (selectedCells.length === 0 || (isAdjacent(selectedCells[selectedCells.length - 1], newCell) && isContinuousDirection([...selectedCells, newCell]))) {
      const newSelectedCells = [...selectedCells, newCell];
      if (newSelectedCells.length === gameData.grid.length * gameData.grid[0].length) {
        setSelectedCells([]);
      } else {
        setSelectedCells(newSelectedCells);
      }
    } else {
      setSelectedCells([]);
    }
  };

  useEffect(() => {
    if (selectedCells.length > 1) {
      const word = selectedCells.map(cell => gameData.grid[cell.row][cell.col]).join('');
      const cleanedWord = cleanWord(word);
      const cleanedWords = gameData.words.map((word) => cleanWord(word));
      if (cleanedWords.includes(cleanedWord) && !foundWords.includes(cleanedWord)) {
        setFoundWords(prevFoundWords => {
          const newFoundWords = [...prevFoundWords, cleanedWord];
          return newFoundWords;
        });
        setHighlightedCells(prevHighlightedCells => [...prevHighlightedCells, ...selectedCells]);
        setSelectedCells([]);
      }
    }
  }, [selectedCells, gameData, foundWords]);

  useEffect(() => {
    if (gameData && foundWords.length === gameData.words.length) {
      setAllWordsFound(true);
    }
  }, [foundWords, gameData]);

  const handleNextGame = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const cleanedFoundWords = foundWords.map((word) => separateWord(word, gameData.words));
      const response = await axios.post(
        `${API_URL}/api/currentWordSearchGame/${wordSearchGameId}`,
        { foundWords: cleanedFoundWords },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      console.log("Response:", response);

      switch (response.status) {
        case 201:
          const newWordSearchGameId = response.data.wordSearchGameId;
          window.location.href = `/wordSearchGame/${newWordSearchGameId}`;
          break;
        case 200:
          navigate('/user/details');
          break;
        case 401:
        case 404:
        case 400:
          setErrorMessage(response.data.message || 'Error inesperado');
          break;
        default:
          setErrorMessage('Error inesperado al completar el juego.');
          break;
      }
    } catch (error) {
      console.error('Error al completar la sopa de letras:', error);
      setErrorMessage('Error al completar la sopa de letras');
    }
  };

  const handleForceComplete = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(`${API_URL}/api/currentWordSearchGame/${wordSearchGameId}`, { forceComplete: true, foundWords }, {
        headers: {
          Authorization: `${token}`,
        },
      });
      switch (response.status) {
        case 201:
          const newWordSearchGameId = response.data.wordSearchGameId;
          window.location.href = `/wordSearchGame/${newWordSearchGameId}`;
          break;
        case 200:
          navigate('/user/details');
          break;
        case 401:
        case 404:
        case 400:
          setErrorMessage(response.data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error al forzar la finalización de la sopa de letras');
    }
  };

  const renderGrid = () => {
    if (!gameData || !gameData.grid) return null;

    return (
      <div className="grid grid-cols-10 gap-1">
        {gameData.grid.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((cell, cellIndex) => {
              const isSelected = selectedCells.some(selected => selected.row === rowIndex && selected.col === cellIndex);
              const isHighlighted = highlightedCells.some(highlighted => highlighted.row === rowIndex && highlighted.col === cellIndex);
              return (
                <div
                  key={cellIndex}
                  className={`border p-2 text-center cursor-pointer ${isSelected || isHighlighted ? 'bg-yellow-300' : ''}`}
                  style={{ width: '30px', height: '30px' }}
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
    if (!gameData || !gameData.words) return null;

    return (
      <div className="ml-4">
        <h2 className="text-xl font-bold mb-2 mt-6">Palabras a Buscar:</h2>
        <ul>
          {gameData.words.map((word, index) => (
            <li key={index} className={`mb-1 ${foundWords.includes(cleanWord(word)) ? 'line-through' : ''}`}>
              {word}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (errorMessage) {
    return <p className="text-red-600">{errorMessage}</p>;
  }

  if (!gameData) {
    return <p>Cargando...</p>;
  }
  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <div>
        <h1 className="text-3xl font-bold mb-4 text-center">Sopa de Letras</h1>
        {renderGrid()}
      </div>
      <p className="mt-4">{time} segundos</p>
      {renderWordsToFind()}
      {allWordsFound && (
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleNextGame}
        >
          Siguiente
        </button>
      )}
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        onClick={handleForceComplete}
      >
        Forzar Completado
      </button>
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
  return concatenatedWord; // Return the concatenated word if no match is found
}