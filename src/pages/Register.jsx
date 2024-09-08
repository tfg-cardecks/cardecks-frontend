import React, { useState } from 'react'
import { API_URL } from '../config'
import MainButton from "../components/mainButton.jsx";
import SecondaryButton from "../components/secondaryButton.jsx";
import FormTextInput from "../components/FormTextInput.jsx";
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import AnimatedCards from "../components/AnimatedCards";
import '../styles/FondoCartas.css';

const countries = [
  "Argentina",
  "Australia",
  "Brazil",
  "Canada",
  "China",
  "France",
  "Germany",
  "India",
  "Italy",
  "Japan",
  "Mexico",
  "Russia",
  "South Africa",
  "Spain",
  "United Kingdom",
  "United States",
];

const roles = [
  "admin",
  "authenticated",
  "customer",
];

const typesOfUser = [
  "Student",
  "Teacher",
  "Other",
];


export default function Register() {

  const [form, setForm] = useState({
    name: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    password2: '',
    location: '',
    role: '',
    typeOfUser: '',
  })

  const [errors, setErrors] = useState({})
  const {
    name,
    lastName,
    email,
    username,
    password,
    password2,
    location,
    role,
    typeOfUser,
  } = form

  let navigate = useNavigate()

  function onInputChange(e) {
    const { name, value } = e.target
    setForm((prevForm) => ({ ...prevForm, [name]: value }))
    setErrors({})
  }

  function validateForm() {
    const errors = {}
    if (!form.name) {
      errors.name = 'Name is required'
    }
    if (!form.lastName) {
      errors.lastName = 'LastName is required'
    }
    if (!form.email) {
      errors.email = 'Email is required'
    }
    if (!form.username) {
      errors.username = 'Username is required'
    }
    if (!form.password) {
      errors.password = 'Password is required'
    }
    if (!form.password2) {
      errors.password2 = 'Password confirmation is required'
    }
    if (form.password !== form.password2) {
      errors.password2 = 'Passwords do not match'
    }
    if (!form.location) {
      errors.location = 'Location is required'
    }
    if (!form.role) {
      errors.role = 'Role is required'
    }
    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })
      const data = await response.json()

      switch (response.status) {
        case 201:
          Swal.fire({
            title: 'Success!',
            text: 'User registered successfully',
            icon: 'success',
            confirmButtonText: 'Log in',
          }).then(() => {
            navigate('/login')
          })
          break
        case 400:
          setErrors(data)
          break
        default:
          break
      }

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div
      className='h-screen flex flex-col justify-center bg-fixed home-container'>
      <AnimatedCards pageClass="register-page" animationClass="register-animation" />
      <div
        style={{
          width: '50%',
          padding: '1.5rem',
          marginLeft: 'auto',
          marginRight: 'auto',
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
          style={{ marginTop: '0px', marginBottom: '13px' }}>
          Register
        </h2>
        {errors.message && (
          <p className='text-yellow-200'>{errors.message}</p>
        )}
        <form onSubmit={(e) => handleSubmit(e)} className='flex flex-wrap -mx-3'>
          <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
            <FormTextInput
              labelFor='Name'
              labelText='Name'
              placeholder='Enter your Name'
              name='name'
              value={name}
              onChange={(e) => onInputChange(e)}
              errors={errors}
              isMandatory
            />

            <FormTextInput
              labelFor='LastName'
              labelText='LastName'
              placeholder='Enter your LastName'
              name='lastName'
              value={lastName}
              onChange={(e) => onInputChange(e)}
              errors={errors}
              isMandatory
            />
            <FormTextInput
              labelFor='Username'
              labelText='Username'
              placeholder='Enter your Username'
              name='username'
              value={username}
              onChange={(e) => onInputChange(e)}
              errors={errors}
              isMandatory
            />
            <FormTextInput
              labelFor='Password'
              labelText='Password'
              placeholder='Enter your Password'
              name='password'
              value={password}
              onChange={(e) => onInputChange(e)}
              type='password'
              errors={errors}
              isMandatory
            />
            <FormTextInput
              labelFor='Password2'
              labelText='Repeat Password'
              placeholder='Enter your Password again'
              name='password2'
              value={password2}
              onChange={(e) => onInputChange(e)}
              type='password'
              errors={errors}
              isMandatory
            />
          </div>
          <div className='w-full md:w-1/2 px-3'>
            <FormTextInput
              labelFor='Email'
              labelText='Email'
              placeholder='Enter your Email'
              name='email'
              value={email}
              onChange={(e) => onInputChange(e)}
              type='email'
              errors={errors}
              isMandatory
            />
            <div className='mb-4'>
              <label htmlFor='Location' className='block text-white text-sm font-bold mb-2'>
                Location *
              </label>
              <select
                name='location'
                value={location}
                onChange={(e) => onInputChange(e)}
                className='block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              >
                <option value=''>Select your country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.location && <p className='text-yellow-200 text-xs italic'>{errors.location}</p>}
            </div>
            <div className='mb-4'>
              <label htmlFor='Role' className='block text-white text-sm font-bold mb-2'>
                Role *
              </label>
              <select
                name='role'
                value={role}
                onChange={(e) => onInputChange(e)}
                className='block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              >
                <option value=''>Select your role</option>
                {roles.map((rol) => (
                  <option key={rol} value={rol}>
                    {rol}
                  </option>
                ))}
              </select>
              {errors.role && <p className='text-yellow-200 text-xs italic'>{errors.role}</p>}
            </div>
            <div className='mb-4'>
              <label htmlFor='Role' className='block text-white text-sm font-bold mb-2'>
                Type Of User
              </label>
              <select
                name='typeOfUser'
                value={typeOfUser}
                onChange={(e) => onInputChange(e)}
                className='block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              >
                <option value=''>Select your type of User</option>
                {typesOfUser.map((typeUser) => (
                  <option key={typeUser} value={typeUser}>
                    {typeUser}
                  </option>
                ))}
              </select>
              {errors.typeOfUser && <p className='text-yellow-200 text-xs italic'>{errors.typeOfUser}</p>}
            </div>

          </div>
          <div className='flex-row space-x-24 m-auto mt-4'>
            <div
              className='flex items-center justify-center h-full'
            >
              <p className='text-md text-white mb-1 mr-2 text-center'>
                Already have an account?{' '}
                <Link
                  to='/login'
                  className='text-green-400 hover:text-green-200'
                  style={{ marginRight: '2rem' }}>
                  Log in now
                </Link>
              </p>
            </div>
            <div className='flex justify-center' style={{ marginLeft: '10px', marginTop: '5%' }}>
              {MainButton('Register', '/', handleSubmit)}
              {SecondaryButton('Cancel', '/')}
            </div>
          </div>
        </form>
      </div>
      <br></br>
    </div>
  )
}