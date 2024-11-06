import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/authContext';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/UserDetailStyles.css';

export default function EditUserDetail() {
  const [user, setUser] = useState({ username: '', email: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { authenticated, userId } = useAuthContext();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
    setErrors({});
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.patch(
        `${API_URL}/api/user/${userId}`,
        { username: user.username, email: user.email },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      switch (response.status) {
        case 200:
          Swal.fire({
            icon: 'success',
            title: 'Perfil Actualizado',
            text: 'Tus detalles han sido actualizados correctamente.',
          });
          navigate('/user/details');
          break;
        case 400:
        case 401:
        case 404:
          setErrors({ message: response.data.message });
          break;
        default:
          break;
      }
    } catch (error) {
      setErrors({ message: error.response?.data?.message || error.message });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="container">
        <div className="card">
          {errors.message && (
            <p className='text-red-500'>{errors.message}</p>
          )}
          <h2 className="title">Editar Detalles del Usuario</h2>
          <hr className="divider" />
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username"><strong>Nombre de Usuario: </strong> </label>
              <input
                style={{ borderBottom: '1px solid #000', marginLeft: "1%" }}
                type="text"
                id="username"
                name="username"
                value={user.username}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group" style={{ marginTop: "2%" }}>
              <label htmlFor="email"><strong>Email:</strong> </label>
              <input
                style={{ borderBottom: '1px solid #000', marginLeft: "1%" }}
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-200 to-green-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-green-300 focus:outline-none"
              >
                Guardar Cambios
              </button>
              <button
                type="button"
                onClick={() => navigate('/user/details')}
                className="bg-gradient-to-r from-red-200 to-red-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-red-300 focus:outline-none"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}