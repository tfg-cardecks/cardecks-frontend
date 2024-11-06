import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import Swal from 'sweetalert2';

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

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
    <div className="reset-password-container">
      <h1>Restablecer Contraseña</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="form-group">
          <label htmlFor="newPassword">Nueva Contraseña:</label>
          <input
            type="password"
            id="newPassword"
            name='newPassword'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label htmlFor="newPassword2">Repite Contraseña:</label>
          <input
            type="password"
            id="newPassword2"
            name='newPassword2'
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
            required
          />

        </div>
        <button type="submit">Restablecer Contraseña</button>
      </form>
    </div>
  );
}