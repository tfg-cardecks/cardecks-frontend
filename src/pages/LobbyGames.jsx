import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';
import '../styles/LobbyGames.css';
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

export default function LobbyGames() {
  const navigate = useNavigate();
  const { userId } = useAuthContext();

  const handleGameTypeClick = (gameType) => {
    navigate(`/selectDeckGame/${gameType}/${userId}`);
  };

  return (
    <div>
      <h1 className="lobby-title">Catálogo de Juegos</h1>
      <div className="game-type-list">
        {gameTypes.map((game) => (
          <div key={game.type} className="game-type-item" onClick={() => handleGameTypeClick(game.type)}>
            <img src={game.icon} alt={game.name} />
            <div className="game-type-info">
              <h2>{game.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}