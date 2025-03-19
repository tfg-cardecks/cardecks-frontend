import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuthContext } from '../context/authContext';
import Swal from 'sweetalert2';
import { FaTimes } from 'react-icons/fa';

export default function MyDecks() {
  const { authenticated } = useAuthContext();
  const [decks, setDecks] = useState([]);
  const [error, setError] = useState(null);
  const [nameFilter, setNameFilter] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [alphabetFilter, setAlphabetFilter] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [decksPerPage, setDecksPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [showThemeFilter, setShowThemeFilter] = useState(false);
  const [showStartDateFilter, setShowStartDateFilter] = useState(false);
  const [showEndDateFilter, setShowEndDateFilter] = useState(false);
  const [showSortOption, setShowSortOption] = useState(false);

  async function fetchDecks() {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/user/${id}/decks`, {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
        },
      });
      const data = await response.json();
      switch (response.status) {
        case 401:
          setError(data);
          break;
        case 404:
          setError(data);
          break;
        case 200:
          setDecks(data);
          break;
        default:
          break;
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchDecks();
  }, [id, authenticated]);

  const filteredDecks = decks.filter(deck => {
    const matchesName = nameFilter ? deck.name.toLowerCase().includes(nameFilter.toLowerCase()) : true;
    const matchesTheme = themeFilter ? deck.theme === themeFilter : true;
    const matchesStartDate = startDate ? new Date(deck.createAt) >= new Date(startDate) : true;
    const matchesEndDate = endDate ? new Date(deck.createAt) <= new Date(endDate) : true;
    const matchesAlphabet = alphabetFilter ? deck.name.startsWith(alphabetFilter) : true;
    return matchesName && matchesTheme && matchesStartDate && matchesEndDate && matchesAlphabet;
  });

  const sortedDecks = filteredDecks.sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'createdAt-asc':
        return new Date(a.createAt) - new Date(b.createAt);
      case 'createdAt-desc':
        return new Date(b.createAt) - new Date(a.createAt);
      default:
        return 0;
    }
  });

  const indexOfLastCard = currentPage * decksPerPage;
  const indexOfFirstCard = indexOfLastCard - decksPerPage;
  const currentDecks = sortedDecks.slice(indexOfFirstCard, indexOfLastCard);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  async function handleImportDeck(event) {
    event.preventDefault();

    if (!file) {
      setError("No se ha seleccionado ningún archivo.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/deck/import`, {
        method: 'POST',
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });
      if (res.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Mazo importado',
          text: 'Se ha importado correctamente el mazo.',
          showConfirmButton: false,
          timer: 1500,
        });
        fetchDecks();
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="container mx-auto p-4 w-4/5">
      <h1 className="text-3xl font-bold mb-4">
        Mis Mazos
      </h1>
      <h1 className="text-3xl font-bold mb-4">
        Número de Mazos: {sortedDecks.length}
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="border p-2 rounded w-full"
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
      <div className="mb-4">
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
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
        <input
          id="fileInput"
          type="file"
          onChange={handleFileChange}
          className="w-full md:w-auto"
        />
        <button
          onClick={handleImportDeck}
          className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-green-300 focus:outline-none w-full md:w-auto"
        >
          Importar Mazo
        </button>
      </div>
      <div className="mb-4">
        <label className="block mb-1">
          Mazos por página:
          <select
            id="decksPerPage"
            value={decksPerPage}
            onChange={(e) => {
              setDecksPerPage(Number(e.target.value));
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
        {Array.from({ length: Math.ceil(sortedDecks.length / decksPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {sortedDecks.length === 0 && !error && (
        <p className="text-gray-500">No hay mazos disponibles.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentDecks.map((deck) => (
          <div
            key={deck._id}
            className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => navigate(`/deck/${deck._id}`)}
          >
            <h2 className="text-xl font-bold mb-2">
              {deck.name.replace(/(-[a-z0-9]{6,})+$/, '')}
            </h2>
            <p className="mb-2">{deck.description}</p>
            <p className="text-gray-500">Tema: {deck.theme}</p>
            <p className="text-gray-500">Fecha de creación: {new Date(deck.createAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}