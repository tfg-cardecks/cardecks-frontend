import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/authContext';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import '../styles/UserDetailStyles.css';
import Swal from 'sweetalert2';

export default function UserDetail() {
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { authenticated, userId, logout } = useAuthContext();

  async function fetchUserData() {
    try {
      if (authenticated) {
        const currentUserId = localStorage.getItem('userId');
        const response = await axios.get(`${API_URL}/api/users`);
        const userData = response.data.find((user) => user._id === currentUserId);
        switch (response.status) {
          case 200:
            setUser(userData);
            break;
          case 403:
          case 404:
            setErrors(userData);
            break;
          default:
            break;
        }
      } else {
        setErrors({ message: 'No estás autenticado. Por favor, inicia sesión.' });
      }
    } catch (error) {
      setErrors({ message: error.response.data.message });
    }
  }

  useEffect(() => {
    fetchUserData();
  }, [authenticated]);

  async function handleDelete() {
    try {
      const alert = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar',
        timer: 5000,
      });

      const token = localStorage.getItem('access_token');
      if (alert.isConfirmed) {
        const res = await fetch(`${API_URL}/api/user/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
        });
        if (res.status === 204) {
          Swal.fire({
            icon: 'success',
            title: 'Usuario eliminado',
            text: 'Se ha dado de baja correctamente.',
            showConfirmButton: false,
            timer: 1500,
          });
          logout();
          navigate('/');
        }
      }
    } catch (error) {
      setErrors('Error al eliminar el usuario. Inténtalo de nuevo más tarde.');
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="container">
        <div className="card">
          {errors.message && (
            <p className='text-blue-700'>{errors.message}</p>
          )}
          <h2 className="title">Detalles del Usuario</h2>
          <hr className="divider" />
          <div className="info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Nombre de Usuario:</strong> {user.username}</p>
            <p><strong>Rol:</strong> {user.role}</p>
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-200 to-red-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-red-300 focus:outline-none"
            >
              Darse de baja
            </button>
            <button
              onClick={() => navigate('/user/edit')}
              className="bg-gradient-to-r from-blue-200 to-blue-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-blue-300 focus:outline-none"
            >
              Editar Detalles
            </button>
            <button
              onClick={() => navigate('/user/edit/password')}
              className="bg-gradient-to-r from-orange-200 to-orange-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-orange-300 focus:outline-none"
            >
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}