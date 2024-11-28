import React from 'react';
import { useParams } from 'react-router-dom';
import SelectDeckGameWordSearch from './gamesSelector/SelectDeckGameWordSearch';
import SelectDeckGameHangman from './gamesSelector/SelectDeckGameHangman';
import SelectDeckGameGuessTheImage from './gamesSelector/SelectDeckGameGuessTheImage';

export default function SelectDeckGame() {
  const { gameType } = useParams();

  switch (gameType) {
    case 'WordSearchGame':
      return <SelectDeckGameWordSearch />;
    case 'HangmanGame':
      return <SelectDeckGameHangman />;
    case 'GuessTheImageGame':
      return <SelectDeckGameGuessTheImage />;
    default:
      return <div>Juego no encontrado</div>;
  }
}