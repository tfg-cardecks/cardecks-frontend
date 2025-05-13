import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';
import '../styles/LobbyGames.css';
import wordsearch from '../assets/wordsearch.png';
import guesstheimage from '../assets/guesstheimage.png';
import hangmanGame from '../assets/hangman.png';
import matchingGame from '../assets/matchingGame.jpg';
import letterOrder from '../assets/letterOrder.jpg';
import Swal from 'sweetalert2';

const gameTypes = [
  { type: 'WordSearchGame', name: 'Sopa de Letras', icon: wordsearch },
  { type: 'GuessTheImageGame', name: 'Adivina la Imagen', icon: guesstheimage },
  { type: 'HangmanGame', name: 'Juego del Ahorcado', icon: hangmanGame },
  { type: 'MatchingGame', name: 'Relacionar Palabras', icon: matchingGame },
  { type: 'LetterOrderGame', name: 'Ordenar las Letras', icon: letterOrder },
];

const gameInfo = {
  WordSearchGame: {
    title: "Sopa de Letras",
    description: "Un juego interactivo donde debes encontrar todas las palabras ocultas en una cuadrícula de letras antes de que se acabe el tiempo.",
    rules: [
      "Encuentra todas las palabras ocultas en la cuadrícula para completar la partida.",
      "Selecciona letras adyacentes para formar palabras en cualquier dirección: horizontal, vertical o diagonal.",
      "Las palabras deben coincidir exactamente con las de la lista para ganar.",
      "Si el tiempo se agota antes de encontrar todas las palabras, perderás la partida.",
    ],
    wordProcessing: {
      allowedWordTypes: [
        "Palabras con espacios: Se limpian y se concatenan. Ejemplo: 'MI CASA' → 'MICASA'.",
        "Palabras con acentos: Se eliminan los acentos. Ejemplo: 'CAFÉ' → 'CAFE'.",
        "Palabras con caracteres especiales o números: Se eliminan. Ejemplo: 'CÓDIGO! 123' → 'CODIGO'.",
        "Palabras en minúsculas y mayúsculas: Se convierten a mayúsculas. Ejemplo: 'Hola Mundo' → 'HOLAMUNDO'."
      ],
      notAllowedWordTypes: [
        "Palabras que, tras el proceso de limpieza, no contengan letras. Ejemplo: '123!!!' → ''.",
        "Palabras que queden vacías tras el proceso de limpieza. Ejemplo: '!!!' → ''.",
        "Palabras con caracteres especiales o números que no sean válidos tras la limpieza."
      ],
    },
    allowedCardTypes: [
      "Texto y Texto",
      "Texto e Imagen",
    ],

    gameOverConditions: [
      "Encuentra todas las palabras para completar la partida.",
      "Si se agota el tiempo, perderás la partida."
    ],
    tips: [
      "Usa mazos con palabras relevantes y de tamaño adecuado para obtener una mejor experiencia.",
      "Evita palabras con caracteres especiales o demasiados números para asegurar que se procesen correctamente.",
      "Busca patrones y palabras comunes primero para ganar tiempo.",
      "Si te atascas, intenta concentrarte en las letras menos comunes de la lista."
    ],
    maxGames: 25,
    minCards: 5,
    icon: wordsearch,
    settings: {
      maxWords: {
        label: "Número de Palabras",
        type: "number",
        min: 2,
        max: 4,
      },
      duration: {
        label: "Duración (segundos)",
        type: "number",
        min: 5,
        max: 300,
      },
      totalGames: {
        label: "Total de Partidas",
        type: "number",
        min: 1,
        max: 25,
      }
    }
  },

  GuessTheImageGame: {
    title: "Adivina la Imagen",
    description: "Un juego interactivo donde debes acertar el nombre de la imagen seleccionada del mazo.",
    rules: [
      "Se selecciona una imagen aleatoria de las cartas del mazo elegido.",
      "Adivina correctamente el nombre de la imagen para completar la partida.",
      "Tienes un tiempo limitado para completar la partida.",

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
    allowedCardTypes: [
      "Texto e Imagen"
    ],

    gameOverConditions: [
      "Adivina correctamente el nombre de la imagen para completar la partida.",
      "Si se agota el tiempo, perderás la partida."
    ],
    tips: [
      "Usa mazos con imágenes relevantes y de alta calidad para obtener una mejor experiencia.",
      "Evita imágenes con demasiados detalles o elementos confusos.",
      "Observa las pistas cuidadosamente antes de adivinar.",
      "Practica con diferentes mazos para mejorar tus habilidades y aprender nuevas palabras.",
    ],
    maxGames: 25,
    minCards: 5,
    icon: guesstheimage,
    settings: {
      duration: {
        label: "Duración (segundos)",
        type: "number",
        min: 5,
        max: 300,
      },
      totalGames: {
        label: "Total de Partidas",
        type: "number",
        min: 1,
        max: 25,
      },
    },
  },

  HangmanGame: {
    title: "Juego del Ahorcado",
    description: "Un juego interactivo donde debes adivinar la palabra oculta antes de que se complete el ahorcado.",
    rules: [
      "Selecciona una letra para adivinar la palabra oculta.",
      "Si adivinas una letra correcta, se revelará en la palabra.",
      "Si adivinas una letra incorrecta, se suma una parte al dibujo del ahorcado.",
      "El juego termina si adivinas la palabra o si el ahorcado se completa.",
      "Tienes un tiempo limitado para completar la partida."
    ],
    wordProcessing: {
      allowedWordTypes: [
        "Palabras sin espacios: Se consideran como una única palabra.",
        "Palabras sin acentos: Los acentos son ignorados en la palabra.",
        "Palabras en mayúsculas: Las letras se manejan en mayúsculas para la comparación.",
      ],
      notAllowedWordTypes: [
        "Palabras con caracteres especiales o números: No se permiten en este juego.",
        "Palabras vacías o que solo contengan caracteres no alfabéticos.",
      ],
    },
    allowedCardTypes: [
      "Texto y Texto",
      "Texto e Imagen",
    ],

    gameOverConditions: [
      "El juego termina si adivinas correctamente la palabra oculta.",
      "El juego termina si el dibujo del ahorcado se completa.",
      "Puedes forzar la finalización de un juego en progreso, pero no contará como completado.",
    ],
    tips: [
      "Usa mazos con palabras relevantes y de tamaño adecuado para una mejor experiencia.",
      "Comienza adivinando las letras más comunes como las vocales (A, E, I, O, U).",
      "Evita palabras con caracteres especiales o números para evitar errores en el juego.",
      "Si te atascas, intenta pensar en palabras de la longitud y el contexto del mazo.",
    ],
    maxGames: 25,
    minCards: 5,
    icon: hangmanGame,
    settings: {
      duration: {
        label: "Duración (segundos)",
        type: "number",
        min: 5,
        max: 300,
      },
      totalGames: {
        label: "Total de Partidas",
        type: "number",
        min: 1,
        max: 25,
      }
    }
  },

  MatchingGame: {
    title: "Juego de Relacionar Palabras",
    description: "Un juego interactivo donde debes relacionar palabras con sus definiciones.",
    rules: [
      "Relaciona cada palabra con su significado correcto.",
      "Tienes un tiempo limitado para completar el juego.",
      "No puedes usar cartas con el mismo texto en la parte delantera o trasera.",
      "Cada intento incorrecto reducirá tus puntos.",
      "Completa el juego antes de que se acabe el tiempo para ganar."
    ],
    wordProcessing: {
      allowedWordTypes: [
        "Palabras sin espacios: Se consideran como una única palabra.",
        "Palabras sin acentos: Los acentos son ignorados en la palabra.",
        "Palabras en mayúsculas: Las letras se manejan en mayúsculas para la comparación.",
      ],
      notAllowedWordTypes: [
        "Palabras con caracteres especiales: No se permiten en este juego.",
        "Palabras vacías o que solo contengan caracteres no alfabéticos.",
      ],
    },
    allowedCardTypes: [
      "Texto y Texto"
    ],
    gameOverConditions: [
      "El tiempo se ha agotado.",
      "Se han utilizado todos los intentos.",
      "Todas las palabras han sido correctamente relacionadas."
    ],
    tips: [
      "Lee cuidadosamente cada palabra y su significado.",
      "Intenta recordar las palabras y sus significados para relacionarlas más rápido.",
      "No te apresures, pero tampoco te tomes demasiado tiempo en una sola palabra.",
      "Si no estás seguro, pasa a la siguiente palabra y vuelve más tarde.",
      "Practica con diferentes mazos para mejorar tu memoria y velocidad."
    ],
    maxGames: 25,
    minCards: 10,
    icon: matchingGame,
    settings: {
      duration: {
        label: "Duración (segundos)",
        type: "number",
        min: 5,
        max: 300,
      },
      totalGames: {
        label: "Total de Partidas",
        type: "number",
        min: 1,
        max: 25,
      }
    }
  },
  LetterOrderGame: {
    title: "Ordenar las Letras",
    description: "Un juego interactivo donde debes ordenar las letras de la/s palabra/s correctamente antes de que se acabe el tiempo.",
    rules: [
      "Se mostrará una palabra con sus letras desordenadas.",
      "El jugador debe reordenar las letras para formar la palabra correcta.",
      "Cada palabra debe completarse antes de que termine el tiempo.",
      "Se puede configurar el número de palabras por partida y la duración del juego.",
    ],
    wordProcessing: {
      allowedWordTypes: [
        "Palabras con espacios: Se limpian y se concatenan. Ejemplo: 'MI CASA' → 'MICASA'.",
        "Palabras con acentos: Se eliminan los acentos. Ejemplo: 'CAFÉ' → 'CAFE'.",
        "Palabras con caracteres especiales o números: Se eliminan. Ejemplo: 'CÓDIGO! 123' → 'CODIGO'.",
        "Palabras en minúsculas y mayúsculas: Se convierten a mayúsculas. Ejemplo: 'Hola Mundo' → 'HOLAMUNDO'."
      ],
      notAllowedWordTypes: [
        "Palabras que, tras el proceso de limpieza, no contengan letras. Ejemplo: '123!!!' → ''.",
        "Palabras que queden vacías tras el proceso de limpieza. Ejemplo: '!!!' → ''.",
        "Palabras con caracteres especiales o números que no sean válidos tras la limpieza."
      ],
    },
    allowedCardTypes: [
      "Texto y Texto",
      "Texto e Imagen",
    ],
    gameOverConditions: [
      "El tiempo se agota antes de completar la palabra.",
      "El número de intentos llegue a 0.",
      "El jugador completa todas las palabras de la partida.",
    ],
    tips: [
      "Empieza buscando prefijos y sufijos comunes en las palabras.",
      "Identifica rápidamente las vocales para facilitar la organización.",
      "Practica con palabras cortas antes de aumentar la dificultad."
    ],
    maxGames: 25,
    minCards: 8,
    icon: letterOrder,
    settings: {
      maxWords: {
        label: "Número de Palabras",
        type: "number",
        min: 1,
        max: 2,
      },
      duration: {
        label: "Duración (segundos)",
        type: "number",
        min: 5,
        max: 300,
      },
      totalGames: {
        label: "Total de Partidas",
        type: "number",
        min: 1,
        max: 25,
      }
    }
  },
};

export default function LobbyGames() {
  const navigate = useNavigate();
  const { userId } = useAuthContext();

  const handleGameTypeClick = (gameType) => {
    navigate(`/selectDeckGame/${gameType}/${userId}`);
  };

  const handleInfoClick = (gameType) => {
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
        <p><strong>Máxima de Partidas:</strong> ${info.maxGames}</p>
        <br>
        <p><strong>Número Mínimo de Cartas:</strong> ${info.minCards}</p>
        <br>
        <p><strong>Tipos de Cartas Permitidos:</strong></p>
        <ul style="margin-left: 20px;">${info.allowedCardTypes.map(type => `<li>${type}</li>`).join('')}</ul>
        <br>
        <p><strong>Ajustes:</strong></p>
        <ul style="margin-left: 20px;">
          ${info.settings.maxWords ? `<li><strong>${info.settings.maxWords.label}:</strong> ${info.settings.maxWords.min} - ${info.settings.maxWords.max}</li>` : ''}
          <li><strong>${info.settings.duration.label}:</strong> ${info.settings.duration.min} - ${info.settings.duration.max} segundos</li>
          <li><strong>${info.settings.totalGames.label}:</strong> ${info.settings.totalGames.min} - ${info.settings.totalGames.max}</li>
        </ul>
      </div>
    `, icon: 'info',
      confirmButtonText: 'Cerrar',
      width: '70%',
    });
  };

  return (
    <div>
      <h1 className="lobby-title mb-8 mt-8">Catálogo de Juegos</h1>
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
