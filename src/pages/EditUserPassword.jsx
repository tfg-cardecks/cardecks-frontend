import React, { useState } from 'react';
import { useAuthContext } from '../context/authContext';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/UserDetailStyles.css';

export default function EditUserPassword() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { userId } = useAuthContext();
  const { currentPassword, newPassword } = form;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({});
  };
  
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.patch(
        `${API_URL}/api/user/${userId}/password`,
        form,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      switch (response.status) {
        case 200:
          Swal.fire({
            icon: 'success',
            title: 'Contraseña Actualizada',
            text: 'Tu contraseña ha sido actualizada correctamente.',
          });
          navigate('/user/details');
          break;
        case 400:
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

          <h2 className="title">Cambiar Contraseña del Usuario</h2>
          <hr className="divider" />
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="currentPassword"><strong>Contraseña Actual: </strong> </label>
              <input
                style={{ borderBottom: '1px solid #000', marginLeft: "1%" }}
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={currentPassword}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group" style={{ marginTop: "2%" }}>
              <label htmlFor="newPassword"><strong>Nueva Contraseña:</strong> </label>
              <input
                style={{ borderBottom: '1px solid #000', marginLeft: "1%" }}
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
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
                Cambiar Contraseña
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