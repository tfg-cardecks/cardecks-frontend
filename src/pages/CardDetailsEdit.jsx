import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export default function CardDetailsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [theme, setTheme] = useState('');
  const [frontText, setFrontText] = useState(null);
  const [backText, setBackText] = useState(null);
  const [backElements, setBackElements] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [side, setSide] = useState('front');
  const [errorMessage, setErrorMessage] = useState('');
  const fetchCard = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/card/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
        },
      });
      const data = await response.json();
      setCard(data);
      setTheme(data.theme);
      setFrontText(data.frontSide.text[0] || null);
      setBackText(data.backSide.text[0] || null);
      setBackElements([...data.backSide.text, ...data.backSide.images]);
      setImageUrl(data.backSide.images[0]?.url || '');
    } catch (error) {
      console.error('Error fetching card:', error);
      setErrorMessage('Error al cargar la carta. Inténtalo de nuevo más tarde.');
    }
  };


  useEffect(() => {
    fetchCard();
  }, [id]);

  const isValidImageUrl = (url) => {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
  };

  const handleImageUrlUpload = () => {
    if (!imageUrl) {
      setErrorMessage('Por favor, introduce una URL de imagen.');
      return;
    }

    if (!isValidImageUrl(imageUrl)) {
      setErrorMessage('URL de imagen no válida. Por favor, introduce una URL que termine en .jpeg, .jpg, .gif, o .png.');
      return;
    }

    const newImage = {
      type: 'image',
      url: imageUrl,
      left: 55,
      top: 160,
      width: 200,
      height: 200,
    };

    if (side === 'back' && card.cardType === 'txtImg') {
      setBackElements([newImage]);
    }
  };

  const validateParagraph = (text, maxCharsPerLine, maxTotalChars) => {
    const lines = text.split('\n');
    let totalChars = 0;
    for (let line of lines) {
      if (line.length > maxCharsPerLine) {
        return false;
      }
      totalChars += line.length;
    }
    return totalChars <= maxTotalChars;
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (side === 'back' && !validateParagraph(newText, 25, 200)) {
      setErrorMessage('El párrafo tiene líneas que exceden el número máximo de caracteres permitidos 25');
      return;
    }
    setErrorMessage('');
    if (side === 'front') {
      setFrontText({ ...frontText, content: newText });
    } else if (side === 'back') {
      const updatedBackText = { ...backText, content: newText };
      setBackElements(backElements.map(el => el === backText ? updatedBackText : el));
      setBackText(updatedBackText);
    }
  };

  const handleDeleteImage = () => {
    if (side === 'back' && card.cardType === 'txtImg') {
      setBackElements([]);
    }
  };

  const handleUpdateCard = async () => {
    try {
      const updatedCardData = {
        _id: card._id,
        title: card.title,
        theme,
        cardType: card.cardType,
        frontSide: {
          text: frontText ? [{
            content: frontText.content,
            fontSize: frontText.fontSize,
            color: frontText.color,
            left: frontText.left,
            top: frontText.top,
          }] : [],
        },
        backSide: {
          text: card.cardType === 'txtTxt' ? [{
            content: backText.content,
            fontSize: backText.fontSize,
            color: backText.color,
            left: backText.left,
            top: backText.top,
          }] : [],
          images: card.cardType === 'txtImg' ? backElements : [],
        },
      };
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/card/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify(updatedCardData),
      });

      const data = await response.json();
      switch (response.status) {
        case 200:
          navigate(`/card/${data._id}`);
          break;
        case 404:
          setErrorMessage(data.message);
          break;
        case 400:
          setErrorMessage(data.message.split(': ').pop().trim());
          break;
        case 500:
          setErrorMessage(data.message);
        default:
          break;
      }
    } catch (error) {
      console.error('Error updating card:', error);
      setErrorMessage('Error al actualizar la carta. Inténtalo de nuevo más tarde.');
    }
  };

  if (!card) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center">
      <div className="w-1/2">
        <h1 className="text-3xl font-bold mb-8 text-center">Editar Carta</h1>
        {errorMessage && (
          <pre className="text-red-500 whitespace-pre-wrap mb-4">{errorMessage}</pre>
        )}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-8">
          <div className="mb-4">
            <label className="block font-bold mb-2">Tema:</label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="toolbar-group mb-4">
            <label className="block font-bold mb-2">Parte:</label>
            <select
              value={side}
              onChange={(e) => setSide(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="front">Delantera</option>
              <option value="back">Trasera</option>
            </select>
          </div>
          {side === 'front' && (
            <div className="mb-4">
              <label className="block font-bold mb-2">Texto Delantero:</label>
              <p className="text-sm text-gray-600 mb-2">Cambia el texto aquí para actualizarlo en la imagen de la carta.</p>
              <textarea
                type="text"
                value={frontText?.content || ''}
                onChange={handleTextChange}
                className="border p-2 rounded w-full"
              />
            </div>
          )}
          {side === 'back' && card.cardType === 'txtTxt' && (
            <div className="mb-4">
              <label className="block font-bold mb-2">Texto Trasero:</label>
              <textarea
                type="text"
                value={backText?.content || ''}
                onChange={handleTextChange}
                className="border p-2 rounded w-full"
              />
            </div>
          )}
          {side === 'back' && card.cardType === 'txtImg' && (
            <div className="mb-4">
              <label className="block font-bold mb-2">URL de la Imagen:</label>
              <p className="text-sm text-gray-600 mb-2">Introduce la URL de la imagen y haz clic en "Cargar Imagen" para actualizarla en la carta.</p>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setErrorMessage('');
                }}
                className="border p-2 rounded w-full"
              />
              <div className="flex justify-center mt-2">
                <button
                  onClick={handleImageUrlUpload}
                  className="bg-gradient-to-r from-blue-200 to-blue-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-blue-300 focus:outline-none"
                >
                  Cargar Imagen
                </button>
                {backElements.some(el => el.type === 'image') && (
                  <button
                    onClick={handleDeleteImage}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Eliminar Imagen
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-center">
            <button
              className="bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-green-300 focus:outline-none"
              onClick={handleUpdateCard}
            >
              Actualizar Carta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}