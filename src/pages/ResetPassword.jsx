import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import Swal from 'sweetalert2';
import '../styles/UserDetailStyles.css';

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length) {
      setError(errors.message);
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/user/forgot-password/${token}`, { newPassword });
      switch (response.status) {
        case 200:
          Swal.fire({
            title: 'Contraseña restablecida',
            text: `${response.data.message}`,
            icon: 'success',
            showConfirmButton: false,
            timer: 2000
          });
          navigate('/login');
          break;
        case 400:
        case 404:
          setError(response.data.message);
          break;
        default:
          setError(response.data.message);
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  function validateForm() {
    const errors = {};
    if (!newPassword2) {
      errors.message = "La confirmación de la contraseña es obligatoria";
    }
    if (newPassword !== newPassword2) {
      errors.message = "Las contraseñas no coinciden";
    }
    return errors;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="container">
        <div className="card">
          <h2 className="title">Restablecer Contraseña</h2>
          <hr className="divider" />
          {error && (
            <p className='text-red-500'>{error}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="newPassword"><strong>Nueva Contraseña: </strong> </label>
              <input
                style={{ borderBottom: '1px solid #000', marginLeft: "1%" }}
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="form-group" style={{ marginTop: "2%" }}>
              <label htmlFor="newPassword2"><strong>Repite Contraseña:</strong> </label>
              <input
                style={{ borderBottom: '1px solid #000', marginLeft: "1%" }}
                type="password"
                id="newPassword2"
                name="newPassword2"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-200 to-green-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-green-300 focus:outline-none"
              >
                Restablecer Contraseña
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
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