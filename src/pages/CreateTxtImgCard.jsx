import React from 'react';
import CreateCard from './CreateCard';
import { useLocation, useNavigate } from 'react-router-dom';

export default function CreateTxtImgCard() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {
    navigate('/'); 
    return null; 
  }

  const { title, theme, cardType, userId, cardWidth = 300, cardHeight = 500 } = location.state;

  return (
    <CreateCard
      title={title}
      theme={theme}
      cardType={cardType}
      userId={userId}
      cardWidth={cardWidth}
      cardHeight={cardHeight}
    />
  );
}