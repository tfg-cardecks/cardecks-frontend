import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuthContext } from '../context/authContext';
import Swal from 'sweetalert2';

export default function MyCards() {
  const { authenticated } = useAuthContext();
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [titleFilter, setTitleFilter] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [alphabetFilter, setAlphabetFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(10);
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  async function fetchCards() {
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
        if (response.status === 200) {
          setCards(data.map(card => ({
            ...card,
            frontImageError: false,
            backImageError: false,
            frontImageErrorMessage: '',
            backImageErrorMessage: ''
          })));
        } else {
          setError(data.message);
        }
      } else {
        setError('No estás autenticado. Por favor, inicia sesión.');
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchCards();
  }, [id, authenticated]);

  const filteredCards = cards.filter(card => {
    const matchesTitle = titleFilter ? card.title.toLowerCase().includes(titleFilter.toLowerCase()) : true;
    const matchesTheme = themeFilter ? card.theme === themeFilter : true;
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  async function handleImportCard(event) {
    event.preventDefault();
    if (!file) {
      setError("No se ha seleccionado ningún archivo.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/card/import`, {
        method: 'POST',
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      if (res.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Carta importada',
          text: 'Se ha importado correctamente la carta.',
          showConfirmButton: false,
          timer: 1500,
        });
        fetchCards();
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  const handleImageError = (cardId, side) => {
    setImageErrors((prevErrors) => ({
      ...prevErrors,
      [cardId]: {
        ...prevErrors[cardId],
        [side]: true,
      },
    }));
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="container mx-auto p-4 w-4/5">
      <h1 className="text-3xl font-bold mb-4">
        Mis Cartas ({sortedCards.length})
      </h1>
      {error && <p className="text-red-500">{error}</p>}
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
        <div className="mb-2">
          <label className="block mb-1">
            Tipo de Carta:
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">Todos</option>
              <option value="Texto e Imagen">Texto e Imagen</option>
              <option value="Texto y Texto">Texto y Texto</option>
            </select>
          </label>
          <button
            onClick={() => setTypeFilter('')}
            className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
          >
            Limpiar
          </button>
        </div>
        <div className="mb-2">
          <label className="block mb-1">
            Ordenar por:
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
          </label>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex flex-wrap">
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
      <div className="flex space-x-4 mb-4">
        <input id="fileInput" type="file" onChange={handleFileChange} />
        <button
          onClick={handleImportCard}
          className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-green-300 focus:outline-none"
        >
          Importar Carta
        </button>
      </div>
      <div className="mb-4">
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
      {sortedCards.length === 0 && !error && (
        <p className="text-gray-500">No hay cartas disponibles.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCards.map((card) => (
          <div
            key={card._id}
            className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => navigate(`/card/${card._id}`)}
          >
            <h2 className="text-xl font-bold mb-2">{card.title.replace(/(-[a-z0-9]{6,})+$/, '')}</h2>
            <p className="mb-2">{card.description}</p>
            <p className="text-gray-500">Tema: {card.theme}</p>
            <p className="text-gray-500">Fecha de creación: {new Date(card.createdAt).toLocaleDateString()}</p>
            {imageErrors[card._id]?.front && <p className="text-red-600">No se ha podido cargar la imagen delantera</p>}
            {imageErrors[card._id]?.back && <p className="text-red-600">No se ha podido cargar la imagen trasera</p>}

            <div className="flex justify-between items-center space-x-4">
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
                    onError={() => handleImageError(card._id, 'front')}
                  />
                  <p className={`mt-2 ${imageErrors[card._id]?.front ? 'text-red-500' : ''}`}>Delantera</p>
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
                    onError={() => handleImageError(card._id, 'back')}
                  />
                  <p className={`mt-2 ${imageErrors[card._id]?.back ? 'text-red-500' : ''}`}>Trasera</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
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
    </div>
  );
}