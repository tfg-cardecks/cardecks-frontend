import React from 'react';
import { useParams } from 'react-router-dom';
import SelectDeckGameWordSearch from './gamesSelector/SelectDeckGameWordSearch';
import SelectDeckGameHangman from './gamesSelector/SelectDeckGameHangman';
import SelectDeckGameGuessTheImage from './gamesSelector/SelectDeckGameGuessTheImage';
import SelectDeckGameMatchingGame from './gamesSelector/SelectDeckGameMatchingGame';
import SelectDeckGameLetterOrderGame from './gamesSelector/SelectDeckGameLetterOrderGame';

export default function SelectDeckGame() {
  const { gameType } = useParams();

  switch (gameType) {
    case 'WordSearchGame':
      return <SelectDeckGameWordSearch />;
    case 'HangmanGame':
      return <SelectDeckGameHangman />;
    case 'GuessTheImageGame':
      return <SelectDeckGameGuessTheImage />;
    case 'MatchingGame':
      return <SelectDeckGameMatchingGame />;
    case 'LetterOrderGame':
      return <SelectDeckGameLetterOrderGame />;
    default:
      return <div>Juego no encontrado</div>;
  }
}