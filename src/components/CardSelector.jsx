import React from 'react';
import { API_URL } from '../config';


export default function CardSelector({ allCards, selectedCards, onCardSelection }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {allCards.map((card) => (
        <div key={card._id} className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold mb-2">{card.title.replace(/(-[a-z0-9]{6,})+$/, '')}</h2>
          <p className="mb-2">{card.description}</p>
          <p className="text-gray-500">Tema: {card.theme}</p>
          <p className="text-gray-500">Fecha de creación: {new Date(card.createdAt).toLocaleDateString()}</p>
          <div className="flex justify-between items-center">
            {card.frontImageUrl && (
              <div className="text-center">
                <img
                  src={`${API_URL}${card.frontImageUrl}`}
                  alt={`${card.title} Delantera`}
                  style={{
                    width: `${card.cardWidth / 2}px`,
                    height: `${card.cardHeight / 2}px`,
                    border: '2px solid black'
                  }}
                  className="mt-2 rounded"
                  onError={(e) => { console.log('Error al cargar la imagen delantera:', e); }}
                />
                <p className="mt-2">Delantera</p>
              </div>
            )}
            {card.backImageUrl && (
              <div className="text-center">
                <img
                  src={`${API_URL}${card.backImageUrl}`}
                  alt={`${card.title} Trasera`}
                  style={{
                    width: `${card.cardWidth / 2}px`,
                    height: `${card.cardHeight / 2}px`,
                    border: '2px solid black'
                  }}
                  className="mt-2 rounded"
                  onError={(e) => { console.log('Error al cargar la imagen trasera:', e); }}
                />
                <p className="mt-2">Trasera</p>
              </div>
            )}
          </div>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={selectedCards.includes(card._id)}
                onChange={() => onCardSelection(card._id)}
                className="form-checkbox"
              />
              <span className="ml-2">Seleccionar</span>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}