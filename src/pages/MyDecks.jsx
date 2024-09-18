import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuthContext } from '../context/authContext';
import Swal from 'sweetalert2';

export default function MyDecks() {
  const { authenticated } = useAuthContext();
  const [decks, setDecks] = useState([]);
  const [error, setError] = useState(null);
  const [nameFilter, setNameFilter] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

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
  };

  useEffect(() => {
    fetchDecks();
  }, [id, authenticated]);

  const filteredDecks = decks.filter(deck => {
    const matchesName = nameFilter ? deck.name.toLowerCase().includes(nameFilter.toLowerCase()) : true;
    const matchesTheme = themeFilter ? deck.theme === themeFilter : true;
    const matchesStartDate = startDate ? new Date(deck.createAt) >= new Date(startDate) : true;
    const matchesEndDate = endDate ? new Date(deck.createAt) <= new Date(endDate) : true;
    return matchesName && matchesTheme && matchesStartDate && matchesEndDate;
  });

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

  return (
    <div className="container mx-auto p-4 w-4/5">
      <h1 className="text-3xl font-bold mb-4">
        Mis Mazos ({filteredDecks.length})
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-2">
          <label className="block mb-1">
            Nombre:
            <input
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </label>
          <button
            onClick={() => setNameFilter('')}
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
      <div className="flex space-x-4 mb-4">
        <input id="fileInput" type="file" onChange={handleFileChange} />
        <button
          onClick={handleImportDeck}
          className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-green-300 focus:outline-none"
        >
          Importar Mazo
        </button>
      </div>
      {filteredDecks.length === 0 && !error && (
        <p className="text-gray-500">No hay mazos disponibles.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDecks.map((deck) => (
          <div
            key={deck._id}
            className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => navigate(`/deck/${deck._id}`)}
          >
            <h2 className="text-xl font-bold mb-2">
              {deck.name}
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