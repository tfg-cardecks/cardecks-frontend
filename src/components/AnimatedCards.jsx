import React, { useEffect, useState } from "react";
import carta from "../images/carta.png";
import '../styles/FondoCartas.css'; // Importa el archivo CSS

const images = [carta];

// Define las seis posiciones fijas para las columnas
const fixedPositions = [
  { left: '10%' },
  { left: '25%' },
  { left: '40%' },
  { left: '55%' },
  { left: '70%' },
  { left: '85%' }
];

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

const AnimatedCards = ({ initialCount = 6, interval = 3000, maxCount = 30 }) => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // Inicializa las cartas
    const initialCards = Array.from({ length: initialCount }, (_, index) => ({
      image: getRandomImage(),
      position: fixedPositions[index % fixedPositions.length]
    }));
    setCards(initialCards);

    // Genera nuevas cartas en intervalos regulares
    const intervalId = setInterval(() => {
      setCards((prevCards) => {
        if (prevCards.length >= maxCount) {
          clearInterval(intervalId);
          return prevCards;
        }
        const newCard = {
          image: getRandomImage(),
          position: fixedPositions[prevCards.length % fixedPositions.length]
        };
        return [...prevCards, newCard];
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, [initialCount, interval, maxCount]);

  return (
    <>
      {cards.map((card, index) => (
        <img
          key={index}
          src={card.image}
          alt="Carta"
          className="animated-image"
          style={{ top: '0%', left: card.position.left }}
        />
      ))}
    </>
  );
};

export default AnimatedCards;