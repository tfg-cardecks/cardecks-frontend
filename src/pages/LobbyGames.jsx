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
import hangmanGame from '../icon/hangman.png';
import speedMemoryWordGame from '../icon/guesstheimage.png';
import speedMemoryImageGame from '../icon/guesstheimage.png';
import Swal from 'sweetalert2';

const gameTypes = [
  { type: 'WordSearchGame', name: 'Sopa de Letras', icon: wordsearch },
  { type: 'GuessTheImageGame', name: 'Adivina la Imagen', icon: guesstheimage },
  { type: 'HangmanGame', name: 'Juego del Ahorcado', icon: hangmanGame },
];

const gameInfo = {
  WordSearchGame: {
    title: "Sopa de Letras",
    description: "Un juego interactivo donde debes encontrar palabras ocultas en una cuadrícula de letras.",
    rules: [
      "El juego selecciona 4 palabras aleatorias de las cartas del mazo elegido.",
      "Las palabras deben tener entre 2 y 9 caracteres después de limpiarlas (remover espacios, caracteres especiales, etc.).",
      "Encuentra todas las palabras ocultas en la cuadrícula para completar el juego.",
      "Tienes un número limitado de intentos incorrectos para completar todas las palabras del juego.",
      "Puedes jugar hasta 25 juegos antes de reiniciar el contador de juegos completados.",
    ],
    wordProcessing: {
      allowedWordTypes: [
        "Palabras con espacios: Se limpian y se concatenan. Ejemplo: 'MI CASA' → 'MICASA'.",
        "Palabras con acentos: Se eliminan los acentos. Ejemplo: 'CAFÉ' → 'CAFE'.",
        "Palabras con caracteres especiales o números: Se eliminan. Ejemplo: 'CÓDIGO! 123' → 'CODIGO'.",
        "Palabras en minúsculas y mayúsculas: Se convierten a mayúsculas. Ejemplo: 'Hola Mundo' → 'HOLAMUNDO'.",
      ],
      notAllowedWordTypes: [
        "Palabras que, tras el proceso de limpieza, no contengan letras. Ejemplo: '123!!!' → ''.",
        "Palabras que queden vacías tras el proceso de limpieza. Ejemplo: '!!!' → ''.",
      ],
    },
    gameOverConditions: [
      "Encuentra todas las palabras para completar el juego.",
      "Si fallas demasiadas veces, perderás la partida.",
      "Puedes forzar la finalización de un juego en progreso, pero no contará como completado.",
    ],
    tips: [
      "Usa mazos con palabras relevantes y de tamaño adecuado para obtener una mejor experiencia.",
      "Evita palabras con caracteres especiales o demasiados números.",
      "Busca patrones y palabras comunes primero.",
    ],
    maxGames: 25,
    icon: wordsearch,
  },
  GuessTheImageGame: {
    title: "Adivina la Imagen",
    description: "Un juego interactivo donde debes acertar el nombre de la imagen.",
    rules: [
      "Se selecciona una imagen aleatoria de las cartas del mazo elegido.",
      "El juego selecciona una imagen aleatoria del mazo elegido.",
      "Puedes jugar hasta 25 juegos antes de reiniciar el contador de juegos completados.",
    ],
    wordProcessing: {
      allowedWordTypes: [
        "Palabras con caracteres especiales o números: Se eliminan. Ejemplo: 'CÓDIGO! 123' → 'CODIGO'.",
      ],
      notAllowedWordTypes: [
        "Palabras que, tras el proceso de limpieza, no contengan letras. Ejemplo: '123!!!' → ''.",
        "Palabras que queden vacías tras el proceso de limpieza. Ejemplo: '!!!' → ''.",
      ],
    },
    gameOverConditions: [
      "Adivina correctamente el nombre de la imagen para completar el juego.",
      "Puedes forzar la finalización de un juego en progreso, pero no contará como completado.",
    ],
    tips: [
      "Usa mazos con imágenes relevantes y de alta calidad para obtener una mejor experiencia.",
      "Evita imágenes con demasiados detalles o elementos confusos.",
      "Observa las pistas cuidadosamente y piensa en posibles respuestas antes de adivinar.",
      "Practica con diferentes mazos para mejorar tus habilidades y aprender nuevas palabras.",
    ],
    maxGames: 25,
    icon: guesstheimage,
  },
  HangmanGame: {
    title: "Juego del Ahorcado",
    description: "Un juego interactivo donde debes adivinar palabras seleccionadas de las cartas de un mazo antes de que se complete la figura del ahorcado.",
    rules: [
      "Las palabras deben tener entre 2 y 10 caracteres.",
      "Cada palabra debe ser adivinada letra por letra antes de pasar a la siguiente.",
      "Tienes un número limitado de intentos incorrectos para completar todas las palabras del juego.",
      "Puedes jugar hasta 25 juegos antes de reiniciar el contador de juegos completados.",
    ],
    wordProcessing: {
      allowedWordTypes: [
        "Palabras con espacios: Se limpian y se concatenan. Ejemplo: 'MI CASA' → 'MICASA'.",
        "Palabras con acentos: Se eliminan los acentos. Ejemplo: 'CAFÉ' → 'CAFE'.",
        "Palabras con caracteres especiales o números: Se eliminan. Ejemplo: 'CÓDIGO! 123' → 'CODIGO'.",
        "Palabras en minúsculas y mayúsculas: Se convierten a mayúsculas. Ejemplo: 'Hola Mundo' → 'HOLAMUNDO'.",
      ],
      notAllowedWordTypes: [
        "Palabras que, tras el proceso de limpieza, no contengan letras. Ejemplo: '123!!!' → ''.",
        "Palabras que queden vacías tras el proceso de limpieza. Ejemplo: '!!!' → ''.",
      ],
    },
    gameOverConditions: [
      "Adivina todas las letras para completar el juego.",
      "Si fallas demasiadas letras, perderás la partida.",
      "Puedes forzar la finalización de un juego en progreso, pero no contará como completado.",
    ],
    tips: [
      "Usa mazos con palabras relevantes y de tamaño adecuado para obtener una mejor experiencia.",
      "Evita palabras con caracteres especiales o demasiados números.",
      "Juega estratégicamente y trata de adivinar letras comunes primero (por ejemplo, vocales).",
    ],
    maxGames: 25,
    icon: hangmanGame,
  },
};

export default function LobbyGames() {
  const navigate = useNavigate();
  const { userId } = useAuthContext();

  function handleGameTypeClick(gameType) {
    navigate(`/selectDeckGame/${gameType}/${userId}`);
  }

  function handleInfoClick(gameType) {
    const info = gameInfo[gameType];
    Swal.fire({
      title: info.title,
      html: `
        <div style="text-align: left;">
          <p><strong>Descripción:</strong> ${info.description}</p>
          <br>
          <p><strong>Reglas:</strong></p>
          <ul style="margin-left: 20px;">${info.rules.map(rule => `<li>${rule}</li>`).join('')}</ul>
          <br>
          <p><strong>Tipos de Palabras Permitidas:</strong></p>
          <ul style="margin-left: 20px;">${info.wordProcessing.allowedWordTypes.map(type => `<li>${type}</li>`).join('')}</ul>
          <br>
          <p><strong>Tipos de Palabras No Permitidas:</strong></p>
          <ul style="margin-left: 20px;">${info.wordProcessing.notAllowedWordTypes.map(type => `<li>${type}</li>`).join('')}</ul>
          <br>
          <p><strong>Condiciones de Fin del Juego:</strong></p>
          <ul style="margin-left: 20px;">${info.gameOverConditions.map(condition => `<li>${condition}</li>`).join('')}</ul>
          <br>
          <p><strong>Consejos:</strong></p>
          <ul style="margin-left: 20px;">${info.tips.map(tip => `<li>${tip}</li>`).join('')}</ul>
          <br>
          <p><strong>Máximo de Juegos:</strong> ${info.maxGames}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      width: '60%',
    });
  }

  return (
    <div>
      <h1 className="lobby-title">Catálogo de Juegos</h1>
      <div className="game-type-list">
        {gameTypes.map((game) => (
          <div key={game.type} className="game-type-item">
            <div onClick={() => handleGameTypeClick(game.type)} className="game-type-item-content">
              <img src={game.icon} style={{ width: '145px', height: '125px' }} alt={game.name} />
              <div className="game-type-info">
                <h2>{game.name}</h2>
              </div>
            </div>
            <button
              onClick={() => handleInfoClick(game.type)}
              className="info-button bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition-colors duration-300"
            >
              Información
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}