import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import MainButton from "../components/mainButton.jsx";
import SecondaryButton from "../components/secondaryButton.jsx";
import FormTextInputCreate from "../components/FormTextInputCreate.jsx";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';

export default function CreateDeck() {
  const [form, setForm] = useState({
    description: "",
    theme: "",
    name: "",
    cards: []
  });
  const [errors, setErrors] = useState({});
  const [userCards, setUserCards] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { description, theme, name, cards } = form;
  const navigate = useNavigate();
  const { authenticated } = useAuthContext();
  const { id } = useParams();

  async function fetchUserCards() {
    try {
      if (authenticated) {
        const token = localStorage.getItem('access_token');

        const response = await fetch(`${API_URL}/api/user/${id}/cards`, {
          method: 'GET',
          headers: {
            Authorization: `${token}`,
          },
        });
        const data = await response.json();
        setUserCards(data);
      } else {
        setErrors({ message: 'No estás autenticado. Por favor, inicia sesión.' });
      }
    } catch (err) {
      setErrors({ message: err.message });
    }
  }

  useEffect(() => {
    fetchUserCards();
  }, [id, authenticated]);

  function onInputChange(e) {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    setErrors({});
  }

  function onCardSelect(e, cardId) {
    const { checked } = e.target;
    setForm((prevForm) => {
      const updatedCards = checked
        ? [...prevForm.cards, cardId]
        : prevForm.cards.filter(id => id !== cardId);
      return { ...prevForm, cards: updatedCards };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_URL}/api/decks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    switch (res.status) {
      case 201:
        navigate('/');
        break;
      case 400:
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
  }

  const filteredCards = userCards.filter(card => {
    const matchesTitle = titleFilter ? card.title.toLowerCase().includes(titleFilter.toLowerCase()) : true;
    const matchesTheme = themeFilter ? card.theme.toLowerCase().includes(themeFilter.toLowerCase()) : true;
    const matchesStartDate = startDate ? new Date(card.createdAt) >= new Date(startDate) : true;
    const matchesEndDate = endDate ? new Date(card.createdAt) <= new Date(endDate) : true;
    return matchesTitle && matchesTheme && matchesStartDate && matchesEndDate;
  });

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col items-center">
      <div className="w-full md:w-4/5 flex-1 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4">Crear Mazo</h1>
        {errors.message && (
          <p className="text-yellow-600">{errors.message}</p>
        )}
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div>
            <FormTextInputCreate
              labelFor='Name'
              labelText='Nombre'
              placeholder='Introduce el nombre del mazo'
              name='name'
              value={name}
              onChange={(e) => onInputChange(e)}
              errors={errors}
              isMandatory
            />
          </div>
          <div>
            <FormTextInputCreate
              labelFor='Description'
              labelText='Descripción'
              placeholder='Introduce la descripción del mazo'
              name='description'
              value={description}
              onChange={(e) => onInputChange(e)}
              errors={errors}
              isMandatory
            />
          </div>
          <div>
            <FormTextInputCreate
              labelFor='Theme'
              labelText='Tema'
              placeholder='Introduce el tema del mazo'
              name='theme'
              value={theme}
              onChange={(e) => onInputChange(e)}
              errors={errors}
              isMandatory
            />
          </div>
        </form>
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Selecciona Cartas</h2>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-2">
              <label className="block mb-1">
                Título:
                <input
                  type="text"
                  value={titleFilter}
                  onChange={(e) => setTitleFilter(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </label>
              <button
                onClick={() => setTitleFilter('')}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
              >
                Limpiar
              </button>
            </div>
            <div className="mb-2">
              <label className="block mb-1">
                Tema:
                <input
                  type="text"
                  value={themeFilter}
                  onChange={(e) => setThemeFilter(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </label>
              <button
                onClick={() => setThemeFilter('')}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
              >
                Limpiar
              </button>
            </div>
            <div className="mb-2">
              <label className="block mb-1">
                Fecha de Inicio:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </label>
              <button
                onClick={() => setStartDate('')}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
              >
                Limpiar
              </button>
            </div>
            <div className="mb-2">
              <label className="block mb-1">
                Fecha de Fin:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </label>
              <button
                onClick={() => setEndDate('')}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
              >
                Limpiar
              </button>
            </div>
          </div>
          {filteredCards.length === 0 && !errors && (
            <p className="text-gray-500">No hay cartas disponibles.</p>
          )}
          <div className="h-96 overflow-y-auto border p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCards.map((card) => (
                <div key={card._id} className="border p-4 rounded-lg shadow-lg mb-4">
                  <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                  <p className="mb-2">{card.description}</p>
                  <p className="text-gray-500">Tema: {card.theme}</p>
                  <p className="text-gray-500">Fecha de creación: {new Date(card.createdAt).toLocaleDateString()}</p>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`card-${card._id}`}
                      name="cards"
                      value={card._id}
                      onChange={(e) => onCardSelect(e, card._id)}
                      checked={cards.includes(card._id)}
                    />
                    <label htmlFor={`card-${card._id}`} className="ml-2">Seleccionar</label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-center space-x-4 mt-4'>
        {MainButton('Crear Mazo', '/', handleSubmit)}
        {SecondaryButton('Cancelar', '/')}
      </div>
    </div>
  );
}