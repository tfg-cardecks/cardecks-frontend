import React, { useState } from 'react';
import MainButton from '../components/mainButton.jsx';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_URL } from '../config';

export default function RememberPassword() {
  const [form, setForm] = useState({
    email: '',
  });
  const { email } = form;
  const [errors, setErrors] = useState({});

  function handleInputChange(e) {
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
            title: 'You have 15 minutes to change your password. If you don\'t receive the email, please check your spam folder',
            showConfirmButton: true,
            confirmButtonColor: 'var(--talent-highlight)',
            allowOutsideClick: false,
            background: 'var(--talent-secondary)',
            color: 'white',
            timer: 4500,
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
    return `The ${fieldName} field is required`;
  }

  function validateForm() {
    let errors = {};
    if (!form.email) {
      errors.message = getRequiredFieldMessage('email');
    }
    return errors;
  }

  return (
    <div
      className='flex flex-col justify-center'
      style={{
        height: '100vh',
        backgroundAttachment: 'fixed',
        backgroundImage: `url(${MainButton})`,
        backgroundSize: 'cover',
      }}
    >
      <div
        className='h-100 rounded shadow-md flex flex-col justify-between'
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          width: '100%',
          maxWidth: '48rem',
          padding: '2rem',
          margin: '1rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderColor: 'var(--talent-secondary)',
          borderWidth: '1px',
        }}
      >
        <div>
          <h2
            className='font-bold text-center text-white'
            style={{
              fontSize: '4rem',
              marginTop: '2rem',
              marginBottom: '4rem',
            }}
          >
            Request to change password
          </h2>
          <form onSubmit={handleForgotPassword}>
            <div
              className='flex'
              style={{
                marginBottom: '1rem',
              }}
            >
              <label
                htmlFor='Username'
                className='block text-lg font-bold text-white self-center'
                style={{
                  marginBottom: '1rem',
                  marginRight: '2rem',
                  marginLeft: '4rem',
                }}
              >
                Email
              </label>
              <div
                className='flex-grow'
                style={{
                  marginRight: '8rem',
                }}
              >
                <input
                  type='text'
                  className='leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                  }}
                  placeholder='Write your email'
                  name='email'
                  value={email}
                  onChange={handleInputChange}
                />
                {errors.message && (
                  <p className='text-yellow-300'>{errors.message}</p>
                )}
              </div>
            </div>
            <div
              className='flex justify-center items-center'
              style={{ marginTop: '1rem' }}
            >
              <button type='submit'>
                {MainButton('Send email', '/', handleForgotPassword)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}