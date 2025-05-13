import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';
import { API_URL } from '../config';
import Swal from 'sweetalert2';

export default function CardDetail() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const { authenticated } = useAuthContext();
  const [error, setErrors] = useState(null);
  const [imageErrors, setImageErrors] = useState({ front: false, back: false });
  const navigate = useNavigate();

  async function fetchCard() {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/card/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
        },
      });

      const data = await res.json();
      switch (res.status) {
        case 200:
          setCard(data);
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
      setErrors('Error al cargar la carta');
    }
  }

  useEffect(() => {
    fetchCard();
  }, [id, authenticated]);

  function handleUpdate() {
    navigate(`/card/edit/${id}`);
  }

  async function handleDelete() {
    try {
      const alert = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
      });

      if (alert.isConfirmed) {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${API_URL}/api/card/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
        });

        if (res.status === 204) {
          Swal.fire({
            icon: 'success',
            title: 'Carta eliminada',
            text: 'Se ha eliminado correctamente la carta.',
            showConfirmButton: false,
            timer: 1500,
          });
          navigate('/');
        } else {
          const data = await res.json();
          setErrors(data);
        }
      }
    } catch (error) {
      setErrors('Error al eliminar la carta. Inténtalo de nuevo más tarde.');
    }
  }

  async function handleExportCard() {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/card/export/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
      });

      if (res.status === 200) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${card.title}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        Swal.fire({
          icon: 'success',
          title: 'Carta exportada',
          text: 'Se ha exportado correctamente la carta.',
          showConfirmButton: false,
          timer: 1500,
        });

      } else {
        const data = await res.json();
        setErrors(data);
      }
    } catch (error) {
      setErrors('Error al exportar la carta. Inténtalo de nuevo más tarde.');
    }
  }

  const handleImageError = (side) => {
    setImageErrors((prevErrors) => ({
      ...prevErrors,
      [side]: true,
    }));
  };

  return (
    card ? (
      <div className="container mx-auto p-4 w-full md:w-4/5">
        <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 text-center">{card.title.replace(/(-[a-z0-9]{6,})+$/, '')}</h1>
          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
          {imageErrors.front && <p className="text-red-600 mb-4 text-center">No se ha podido cargar la imagen delantera</p>}
          {imageErrors.back && <p className="text-red-600 mb-4 text-center">No se ha podido cargar la imagen trasera</p>}
          <p className="mb-2 text-lg text-gray-700 text-center">{card.description}</p>
          <p className="text-gray-500 mb-2 text-center">Tema: {card.theme}</p>
          <p className="text-gray-500 mb-4 text-center">Fecha de creación: {new Date(card.createdAt).toLocaleDateString()}</p>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 lg:space-x-4 lg:mt-4">
            <button
              onClick={handleUpdate}
              className="bg-gradient-to-r from-blue-200 to-blue-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-blue-300 focus:outline-none w-full md:w-auto"
            >
              Editar Carta
            </button>

            <button
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-200 to-red-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-red-300 focus:outline-none w-full md:w-auto"
            >
              Eliminar
            </button>

            <button
              onClick={handleExportCard}
              className="bg-gradient-to-r from-yellow-200 to-yellow-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-yellow-300 focus:outline-none w-full md:w-auto"
            >
              Exportar Carta
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-6 space-y-6 md:space-y-0 md:space-x-6 w-full">
            {card.frontImageUrl && (
              <div className="text-center w-full md:w-1/2">
                <img
                  src={`${API_URL}${card.frontImageUrl}`}
                  alt={`${card.title} Delantera`}
                  style={{
                    width: '100%',
                    maxWidth: `${card.cardWidth}px`,
                    height: 'auto',
                    border: '2px solid black',
                  }}
                  className="mt-2 rounded shadow-md"
                  onError={() => handleImageError('front')}
                />
                <p className="mt-2 text-black">Delantera</p>
              </div>
            )}
            {card.backImageUrl && (
              <div className="text-center w-full md:w-1/2">
                <img
                  src={`${API_URL}${card.backImageUrl}`}
                  alt={`${card.title} Trasera`}
                  style={{
                    width: '100%',
                    maxWidth: `${card.cardWidth}px`,
                    height: 'auto',
                    border: '2px solid black',
                  }}
                  className="mt-2 rounded shadow-md"
                  onError={() => handleImageError('back')}
                />
                <p className="mt-2 text-black">Trasera</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
      : (
        <div className="container mx-auto p-4 w-full md:w-4/5">
          <h1 className="text-3xl font-bold mb-4 text-center">Cargando...</h1>
        </div>
      )
  );
}