import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormTextInputCreate from '../components/FormTextInputCreate';

export default function PreviewFormCard() {
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [cardType, setCardType] = useState('txtImg');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  const validate = () => {
    const newErrors = {};
    if (!title) {
      newErrors.title = 'El título es obligatorio';
    } else if (title.length < 3) {
      newErrors.title = 'Título demasiado corto';
    } else if (title.length > 50) {
      newErrors.title = 'Título demasiado largo';
    }

    if (!theme) {
      newErrors.theme = 'El tema es obligatorio';
    } else if (theme.length < 3) {
      newErrors.theme = 'El tema es demasiado corto';
    } else if (theme.length > 50) {
      newErrors.theme = 'El tema es demasiado largo';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      navigate(`/create-card/${cardType}`, { state: { title, theme, cardType, userId: id } });
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  function onInputChange(e) {
    const { name, value } = e.target;
    if (name === 'title') {
      setTitle(value);
    } else if (name === 'theme') {
      setTheme(value);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center mb-8">
      <div className="w-full md:w-4/5 flex-1 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Vista Previa de la Carta</h1>
        {errors.message && (
          <p className="text-yellow-600">{errors.message}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <FormTextInputCreate
              labelFor='title'
              labelText='Título'
              placeholder='Introduce el título de la carta'
              name='title'
              value={title}
              onChange={onInputChange}
              errors={errors}
              isMandatory
            />
          </div>
          <div>
            <FormTextInputCreate
              labelFor='theme'
              labelText='Tema'
              placeholder='Introduce el tema de la carta'
              name='theme'
              value={theme}
              onChange={onInputChange}
              errors={errors}
              isMandatory
            />
          </div>
          <div className="form-group">
            <label htmlFor="cardType" className="block mb-2 font-bold">
              Tipo de Carta <span className="text-red-500">*</span>
            </label>
            <select
              id="cardType"
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            >
              <option value="txtImg">Texto e Imagen</option>
              <option value="txtTxt">Texto y Texto</option>
            </select>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-green-300 focus:outline-none w-40"
            >
              Crear Carta
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gradient-to-r from-red-200 to-red-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-red-300 focus:outline-none w-40"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}