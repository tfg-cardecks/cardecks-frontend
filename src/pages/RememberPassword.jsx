import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_URL } from '../config';
import '../styles/UserDetailStyles.css';
import { useNavigate } from 'react-router-dom';

export default function RememberPassword() {
  const [form, setForm] = useState({
    email: '',
  });
  const { email } = form;
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setErrors({});
  };

  async function handleForgotPassword(e) {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/api/user/forgot-password`,
        {
          email: email,
        }
      );
      switch (response.status) {
        case 200:
          Swal.fire({
            icon: 'success',
            title: 'Tienes 15 minutos para cambiar tu contraseña. Si no recibes el correo, por favor revisa tu carpeta de spam',
            showConfirmButton: true,
            timer: 3500,
          });
          break;
        case 404:
          setErrors(response.data);
          break;
        default:
          setErrors(response.data);
      }
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  function getRequiredFieldMessage(fieldName) {
    return `El campo ${fieldName} es obligatorio`;
  }

  function validateForm() {
    let errors = {};
    if (!form.email) {
      errors.message = getRequiredFieldMessage('email');
    }
    return errors;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="container">
        <div className="card" style={{marginTop:"5%", marginBottom:"5%"}}>
          {errors.message && (
            <p className='text-red-500'>{errors.message}</p>
          )}
          <h2 className="title">Solicitud para restablecer la contraseña</h2>
          <hr className="divider" />
          <form onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label htmlFor="email"><strong>Email: </strong> </label>
              <input
                style={{ borderBottom: '1px solid #000', marginLeft: "1%" }}
                type="email"
                id="email"
                name="email"
                value={email}
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
                Enviar correo
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