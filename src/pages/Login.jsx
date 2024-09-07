import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/authContext'
import { API_URL } from '../config'
import AnimatedCards from "../components/AnimatedCards";
import '../styles/FondoCartas.css';
import MainButton from "../components/mainButton.jsx";
import Swal from 'sweetalert2'

export default function Login() {
  const { login } = useAuthContext()
  const apiURL = API_URL
  const [form, setForm] = useState({
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const { username, password } = form
  let navigate = useNavigate()

  function onInputChange(e) {
    const { name, value } = e.target
    setForm((prevForm) => ({ ...prevForm, [name]: value }))
    setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    try {
      const response = await fetch(`${apiURL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      switch (response.status) {
        case 200:
          Swal.fire({
            icon: 'info',
            title: 'Please wait',
            text: 'Logging in progress. This might take some time.',
            showConfirmButton: true,
            confirmButtonColor: 'black',
            allowOutsideClick: false,
            background: 'gray',
            color: 'white',
            timer: 1000,
          }).then(() => {

            login(data.token, data.role , data.id)
            navigate('/user/details')
          })
          break
        case 401:
        case 404:
        case 400:
          setErrors(data)
          break
        default:
          break
      }

    } catch (error) {
      console.error(error);
    }
  }

  function validateForm() {
    let errors = {}

    if (!form.username) {
      errors.username = 'Username is required'
    }
    if (!form.password) {
      errors.password = 'Password is required'
    }
    return errors
  }

  return (

    <div
      className=' flex flex-col justify-center bg-fixed home-container'>
      <AnimatedCards initialCount={5} interval={3000} minDistance={20} maxCount={15} />
      <div
        style={{
          width: '50%',
          height: '50%',
          padding: '1.5rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '3%',
          marginBottom: '3%',
          borderRadius: '0.375rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderColor: 'black',
          backdropFilter: 'blur(8px)',
          borderWidth: '2px',
          overflow: 'auto',
        }}>
        <h2
          className='text-4xl font-bold text-center mb-4 text-white'
          style={{ marginTop: '0px', marginBottom: '15px', marginRight: '5%' }}>
          Log in
        </h2>

        {errors.message && (
          <p className='text-yellow-200'>{errors.message}</p>
        )}

        <div
          className='flex items-center justify-center h-full'
        >
          <p className='text-md text-white mb-1 mr-2 text-center'>
            Don't have an account?{' '}
            <Link
              to='/register'
              className='text-green-400 hover:text-green-200'
              style={{ marginRight: '2rem' }}>
              Register now
            </Link>
          </p>
        </div>

        <form onSubmit={(e) => handleSubmit(e)}>
          <div className='flex' style={{ marginBottom: '1rem', marginTop: '3%' }}>
            <label htmlFor='Username' className='block text-lg font-bold text-white self-center text-center' style={{ marginBottom: '1rem', marginRight: '2rem', marginLeft: '4rem' }}>
              Username
              <br></br>
              or email
            </label>
            <div className='flex-grow' style={{ marginRight: '8rem' }}>
              <input type='text' className='leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline' style={{ width: '100%', padding: '0.5rem 0.75rem' }} placeholder='Write your username' name='username' value={username} onChange={(e) => onInputChange(e)} />
              {errors.username && <p className='text-yellow-200 text-xs italic'>{errors.username}</p>}
            </div>
          </div>
          <div className='flex' style={{ marginBottom: '1rem' }}>
            <label htmlFor='Password' className='block text-lg font-bold text-white self-center' style={{ marginRight: '2rem', marginLeft: '4rem' }}>
              Password
            </label>
            <div className='flex-grow' style={{ marginRight: '8rem', marginLeft: '0.25rem' }}>
              <input type='password' className='leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline' style={{ width: '100%', padding: '0.5rem 0.75rem' }} placeholder='Enter your password' name='password' value={password} onChange={(e) => onInputChange(e)} />
              {errors.password && <p className='text-yellow-200 text-xs italic'>{errors.password}</p>}
            </div>
          </div>
          {errors.errors && errors.errors[0] && errors.errors[0].detail && <p className='text-yellow-200'>{errors.errors[0].detail}</p>}
          <div className="flex justify-center">
            <div className="flex justify-center" style={{ marginLeft: '20%' }}>
              {MainButton('Log in', '/', handleSubmit)}
            </div>
            <div className='flex items-center justify-center h-full'>
              <Link to='/' className='text-blue-300 hover:text-blue-700'>
                ¿Forgot your password?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}