import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';
import { API_URL } from '../config';
import CardSelector from '../components/CardSelector';

export default function DeckDetailsEdit() {
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const [allCards, setAllCards] = useState([]);
  const { authenticated } = useAuthContext();
  const [error, setErrors] = useState('');
  const [formData, setFormData] = useState({
    theme: '',
    description: '',
    cards: []
  });
  const navigate = useNavigate();

  async function fetchDeck() {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/deck/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
        },
      });
      const data = await res.json();
      switch (res.status) {
        case 200:
          setDeck(data);
          setFormData({
            theme: data.theme,
            description: data.description,
            cards: data.cards.map(card => card._id)
          });
          break;
        case 404:
          setErrors(data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchUserCards() {
    try {
      const token = localStorage.getItem('access_token');
      const currentUserId = localStorage.getItem("userId");
      const res = await fetch(`${API_URL}/api/user/${currentUserId}/cards`, {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
        },
      });
      const data = await res.json();
      if (res.status === 200) {
        setAllCards(data);
      } else {
        setErrors(data);
      }
    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    fetchDeck();
    fetchUserCards();
  }, [id, authenticated]);

  async function handleUpdate() {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/deck/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          theme: formData.theme,
          description: formData.description,
          cards: formData.cards
        })
      });

      const data = await res.json();
      switch (res.status) {
        case 200:
          navigate(`/deck/${id}`);
          break;
        case 400:
          console.log(data);
          setErrors(data);
          break;
        case 401:
          setErrors(data);
          break;
        case 404:
          setErrors(data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCardSelection = (cardId) => {
    setFormData((prevFormData) => {
      const newCards = prevFormData.cards.includes(cardId)
        ? prevFormData.cards.filter(id => id !== cardId)
        : [...prevFormData.cards, cardId];
      return { ...prevFormData, cards: newCards };
    });
  };

  const handleCancel = () => {
    navigate(`/deck/${id}`);
  };

  return (
    deck ? (
      <div className="container mx-auto p-4 w-4/5">
        <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4">{deck.name}</h1>
          {error && <p className="text-red-600">{error.message}</p>}
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="w-full">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="theme">
                Tema
              </label>
              <input
                type="text"
                name="theme"
                id="theme"
                value={formData.theme}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Descripción
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Seleccionar Cartas
              </label>
              <div className="h-96 overflow-y-auto border p-4 rounded-lg">
                <CardSelector
                  allCards={allCards}
                  selectedCards={formData.cards}
                  onCardSelection={handleCardSelection}
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-200 to-blue-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-blue-300 focus:outline-none"
              >
                Actualizar Mazo
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gradient-to-r from-red-200 to-red-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-red-300 focus:outline-none"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    )
      : (
        <div className="container mx-auto p-4 w-4/5">
          <h1 className="text-3xl font-bold mb-4">Cargando...</h1>
        </div>
      )
  );
}