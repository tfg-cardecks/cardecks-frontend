import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';
import CardSelector from '../components/CardSelector';
import FormTextInputCreate from '../components/FormTextInputCreate.jsx';
import Swal from 'sweetalert2';
import { FaTimes } from 'react-icons/fa';

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
  const [typeFilter, setTypeFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [alphabetFilter, setAlphabetFilter] = useState('');
  const { description, theme, name, cards } = form;
  const navigate = useNavigate();
  const { authenticated } = useAuthContext();
  const { id } = useParams();
  const [cardsPerPage, setCardsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showThemeFilter, setShowThemeFilter] = useState(false);
  const [showStartDateFilter, setShowStartDateFilter] = useState(false);
  const [showEndDateFilter, setShowEndDateFilter] = useState(false);
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [showSortOption, setShowSortOption] = useState(false);
  const [themeSuggestions, setThemeSuggestions] = useState([]);

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
        switch (response.status) {
          case 200:
            setUserCards(data);
            break;
          case 404:
            setErrors(data);
            break;
          default:
            break;
        }
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

  function onCardSelect(cardId) {
    setForm((prevForm) => {
      const updatedCards = prevForm.cards.includes(cardId)
        ? prevForm.cards.filter(id => id !== cardId)
        : [...prevForm.cards, cardId];
      return { ...prevForm, cards: updatedCards };
    });
  }

  function capitalizeAfterHyphen(str) {
    return str.replace(/-./g, match => match.toUpperCase());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    const modifiedForm = {
      ...form,
      name: capitalizeAfterHyphen(form.name)
    };

    const res = await fetch(`${API_URL}/api/decks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
      body: JSON.stringify(modifiedForm),
    });
    const data = await res.json();
    switch (res.status) {
      case 201:
        Swal.fire({
          title: 'Mazo creado',
          text: 'El mazo se ha creado correctamente.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(`/deck/${data._id}`);
        break;
      case 400:
      case 401:
      case 404:
      case 403:
        setErrors(data);
        break;
      default:
        break;
    }
  }

  const handleCancel = () => {
    navigate('/');
  };

  const handleThemeSearch = async (e) => {
    const query = e.target.value;
    setForm((prevForm) => ({ ...prevForm, theme: query }));
    if (query.length > 2) {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/api/deckAutocomplete?query=${query}`, {
          method: 'GET',
          headers: {
            Authorization: `${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setThemeSuggestions(data);
        } else {
          console.error("Error fetching theme suggestions:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching theme suggestions:", error);
      }
    } else {
      setThemeSuggestions([]);
    }
  };

  const filteredCards = userCards.filter(card => {
    const matchesTitle = titleFilter ? card.title.toLowerCase().includes(titleFilter.toLowerCase()) : true;
    const matchesTheme = themeFilter ? card.theme.toLowerCase().includes(themeFilter.toLowerCase()) : true;
    const matchesStartDate = startDate ? new Date(card.createdAt) >= new Date(startDate) : true;
    const matchesEndDate = endDate ? new Date(card.createdAt) <= new Date(endDate) : true;
    const matchesType = typeFilter ? (typeFilter === 'Texto e Imagen' ? card.cardType === 'txtImg' : card.cardType === 'txtTxt') : true;
    const matchesAlphabet = alphabetFilter ? card.title.startsWith(alphabetFilter) : true;
    return matchesTitle && matchesTheme && matchesStartDate && matchesEndDate && matchesType && matchesAlphabet;
  });

  const sortedCards = filteredCards.sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.title.localeCompare(b.title);
      case 'name-desc':
        return b.title.localeCompare(a.title);
      case 'createdAt-asc':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'createdAt-desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = sortedCards.slice(indexOfFirstCard, indexOfLastCard);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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
              onChange={handleThemeSearch}
              errors={errors}
              isMandatory
            />
            {themeSuggestions.length > 0 && (
              <ul className="mt-2 border border-gray-300 rounded-md max-h-40 overflow-auto">
                {themeSuggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => setForm((prevForm) => ({ ...prevForm, theme: suggestion }))}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </form>
        <div>
          <h2 className="text-xl font-bold mb-2 text-center">Selecciona las Cartas</h2>
          <div className="flex justify-center items-center mb-4">
            <input
              type="text"
              placeholder="Título"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              className="border p-2 rounded w-40"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-500 text-white px-4 py-2 rounded ml-2 flex items-center"
            >
              <FaTimes className={`transition-transform ${showFilters ? 'rotate-45' : ''}`} />
            </button>
          </div>
          {showFilters && (
            <div className="mb-4 flex justify-center">
              <div className="flex flex-wrap justify-center gap-4">
                <div className="mb-2">
                  <label className="block mb-1">
                    <input
                      type="checkbox"
                      checked={showThemeFilter}
                      onChange={() => setShowThemeFilter(!showThemeFilter)}
                      className="mr-2"
                    />
                    Tema
                  </label>
                  {showThemeFilter && (
                    <input
                      type="text"
                      value={themeFilter}
                      onChange={(e) => setThemeFilter(e.target.value)}
                      className="border p-2 rounded w-full"
                    />
                  )}
                </div>
                <div className="mb-2">
                  <label className="block mb-1">
                    <input
                      type="checkbox"
                      checked={showStartDateFilter}
                      onChange={() => setShowStartDateFilter(!showStartDateFilter)}
                      className="mr-2"
                    />
                    Fecha de Inicio
                  </label>
                  {showStartDateFilter && (
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border p-2 rounded w-full"
                    />
                  )}
                </div>
                <div className="mb-2">
                  <label className="block mb-1">
                    <input
                      type="checkbox"
                      checked={showEndDateFilter}
                      onChange={() => setShowEndDateFilter(!showEndDateFilter)}
                      className="mr-2"
                    />
                    Fecha de Fin
                  </label>
                  {showEndDateFilter && (
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border p-2 rounded w-full"
                    />
                  )}
                </div>
                <div className="mb-2">
                  <label className="block mb-1">
                    <input
                      type="checkbox"
                      checked={showTypeFilter}
                      onChange={() => setShowTypeFilter(!showTypeFilter)}
                      className="mr-2"
                    />
                    Tipo de Carta
                  </label>
                  {showTypeFilter && (
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="border p-2 rounded w-full"
                    >
                      <option value="">Todos</option>
                      <option value="Texto e Imagen">Texto e Imagen</option>
                      <option value="Texto y Texto">Texto y Texto</option>
                    </select>
                  )}
                </div>
                <div className="mb-2">
                  <label className="block mb-1">
                    <input
                      type="checkbox"
                      checked={showSortOption}
                      onChange={() => setShowSortOption(!showSortOption)}
                      className="mr-2"
                    />
                    Ordenar por
                  </label>
                  {showSortOption && (
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="border p-2 rounded w-full"
                    >
                      <option value="">Seleccionar</option>
                      <option value="name-asc">Nombre (A-Z)</option>
                      <option value="name-desc">Nombre (Z-A)</option>
                      <option value="createdAt-asc">Fecha de creación (más antiguas)</option>
                      <option value="createdAt-desc">Fecha de creación (más recientes)</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="mb-4 flex justify-center">
            <div className="flex flex-wrap justify-center">
              {alphabet.map(letter => (
                <button
                  key={letter}
                  onClick={() => setAlphabetFilter(letter)}
                  className={`px-2 py-1 m-1 rounded ${alphabetFilter === letter ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {letter}
                </button>
              ))}
              <button
                onClick={() => setAlphabetFilter('')}
                className="px-2 py-1 m-1 rounded bg-gray-200 text-gray-700"
              >
                Limpiar
              </button>
            </div>
          </div>
          <div className="mb-4 flex justify-center">
            <label className="block mb-1">
              Cartas por página:
              <select
                id="cardsPerPage"
                value={cardsPerPage}
                onChange={(e) => {
                  setCardsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border p-2 rounded w-full"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
          </div>
          <div className="flex justify-center mb-4">
            {Array.from({ length: Math.ceil(sortedCards.length / cardsPerPage) }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {sortedCards.length === 0 && !errors && (
            <p className="text-gray-500">No hay cartas disponibles.</p>
          )}
          <div className="h-96 p-4 rounded-lg">
            <CardSelector
              allCards={currentCards}
              selectedCards={cards}
              onCardSelection={onCardSelect}
            />
          </div>
        </div>
      </div>
      <div className='flex justify-center space-x-4 mt-4'>
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-green-300 focus:outline-none"
        >
          Crear Mazo
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gradient-to-r from-red-200 to-red-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-red-300 focus:outline-none"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}