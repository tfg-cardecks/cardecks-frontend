import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Stage, Layer, Text, Image, Rect } from 'react-konva';
import useImage from 'use-image';
import '../styles/CreateCard.css'; 
import { API_URL } from '../config';

export default function CreateCard({ title, theme, cardType, userId, cardWidth = 300, cardHeight = 500 }) {
  const [text, setText] = useState('Texto de ejemplo');
  const [fontSize, setFontSize] = useState(20);
  const [color, setColor] = useState('#000000');
  const [side, setSide] = useState('front'); 
  const [imageUrl, setImageUrl] = useState('');
  const [image] = useImage(imageUrl);
  const [frontText, setFrontText] = useState(null);
  const [backText, setBackText] = useState(null); 
  const [backElements, setBackElements] = useState([]);
  const [frontImageUrl, setFrontImageUrl] = useState('');
  const [backImageUrl, setBackImageUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const loadCanvasState = () => {
      const frontJson = localStorage.getItem('frontCanvasState');
      const backJson = localStorage.getItem('backCanvasState');
      if (frontJson) {
        setFrontText(JSON.parse(frontJson));
      }
      if (backJson) {
        setBackElements(JSON.parse(backJson));
      }
    };

    loadCanvasState();
  }, []);

  useEffect(() => {
    const saveCanvasState = () => {
      localStorage.setItem('frontCanvasState', JSON.stringify(frontText));
      localStorage.setItem('backCanvasState', JSON.stringify(backElements));
    };

    saveCanvasState();
  }, [frontText, backElements]);

  const handleAddText = () => {
    const newText = {
      type: 'text',
      text: text,
      fontSize: fontSize,
      fill: color,
      x: 50,
      y: 50,
      draggable: true,
    };

    if (side === 'front' && !frontText) {
      setFrontText(newText);
    } else if (side === 'back' && cardType === 'txtTxt' && !backText) {
      setBackText(newText);
      setBackElements([...backElements, newText]);
    }
  };

  const handleImageUrlUpload = () => {
    if (!imageUrl) return;

    const newImage = {
      type: 'image',
      src: imageUrl,
      x: 55,
      y: 160,
      width: 200,
      height: 200,
    };

    if (side === 'front') {
      setFrontImageUrl(`/images/${title}_front.png`);
      setFrontText(newImage);
    } else if (side === 'back' && cardType === 'txtImg') {
      setBackImageUrl(`/images/${title}_back.png`);
      setBackElements([newImage]); 
    }
  };

  const handleDragEnd = (e) => {
    const { x, y } = e.target.position();
    if (side === 'front') {
      setFrontText({ ...frontText, x, y });
    } else if (side === 'back') {
      const updatedBackText = { ...backText, x, y };
      setBackElements(backElements.map(el => el === backText ? updatedBackText : el));
      setBackText(updatedBackText);
    }
  };

  const handleTextChange = (e) => {
    if (side === 'front') {
      setFrontText({ ...frontText, text: e.target.value });
    } else if (side === 'back') {
      const updatedBackText = { ...backText, text: e.target.value };
      setBackElements(backElements.map(el => el === backText ? updatedBackText : el));
      setBackText(updatedBackText);
    }
  };

  const handleDeleteText = () => {
    if (side === 'front') {
      setFrontText(null);
    } else if (side === 'back') {
      setBackElements(backElements.filter(el => el !== backText));
      setBackText(null);
    }
  };

  const handleDeleteImage = () => {
    if (side === 'back' && cardType === 'txtImg') {
      setBackElements([]);
    }
  };

  const handleCreateCard = async () => {
    try {
      const cardData = {
        title,
        theme,
        cardType,
        userId,
        frontSide: {
          text: frontText && frontText.type === 'text' ? [{
            content: frontText.text,
            fontSize: frontText.fontSize,
            color: frontText.fill,
            left: frontText.x,
            top: frontText.y,
          }] : [],
          images: frontText && frontText.type === 'image' ? [{
            url: frontText.src,
            left: frontText.x,
            top: frontText.y,
            width: frontText.width,
            height: frontText.height,
          }] : [],
        },
        backSide: {
          text: backElements.filter(el => el.type === 'text').map(el => ({
            content: el.text,
            fontSize: el.fontSize,
            color: el.fill,
            left: el.x,
            top: el.y,
          })),
          images: backElements.filter(el => el.type === 'image').map(el => ({
            url: el.src,
            left: el.x,
            top: el.y,
            width: el.width,
            height: el.height,
          })),
        },
        frontImageUrl: `/images/${title}_front.png`,
        backImageUrl: `/images/${title}_back.png`,
      };
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
          'timeout': 10000
        },
        body: JSON.stringify(cardData),
      });
      const data = await response.json();
      switch (response.status) {
        case 201:
          navigate(`/card/${data._id}`);
          break;
        case 400:
          setErrorMessage(data.message);
          break;
        case 401:
          setErrorMessage(data.message);
          break;
        case 404:
          setErrorMessage(data.message);
          break;
        case 500:
          setErrorMessage(data.message.split(':')[1] + ". Imagen no soportada pruebe con otra");
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error al crear la carta. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className="create-card-container">
      <h1 className="text-3xl font-bold mb-8">Crear Carta</h1>
      {errorMessage && (
        <pre className="text-red-500 whitespace-pre-wrap" style={{marginBottom:"2%"}}>{errorMessage}</pre>
      )}
      <div className="card-info bg-gray-100 p-4 rounded-lg shadow-md mb-8">
        <div className="card-info-item">
          <span className="font-bold text-lg">Título:</span>
          <span className="text-lg ml-2">{title}</span>
        </div>
        <div className="card-info-item">
          <span className="font-bold text-lg">Tema:</span>
          <span className="text-lg ml-2">{theme}</span>
        </div>
        <div className="card-info-item">
          <span className="font-bold text-lg">Tipo de Carta:</span>
          <span className="text-lg ml-2">{cardType === 'txtImg' ? 'Texto e Imagen' : 'Texto y Texto'}</span>
        </div>
      </div>
      <div className="toolbar bg-white p-4 rounded-lg shadow-md mb-8">
        {(cardType !== 'txtImg' || side !== 'back') && (
          <div className="toolbar-group mb-4">
            <label className="block font-bold mb-2">Texto:</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <div className="flex space-x-2 mt-2">
              <button
                onClick={handleAddText}
                disabled={(side === 'front' && frontText !== null) || (side === 'back' && backText !== null && cardType === 'txtTxt')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Añadir Texto
              </button>
              {(frontText || (side === 'back' && backElements.length > 0)) && (
                <button
                  onClick={handleDeleteText}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Eliminar Texto
                </button>
              )}
            </div>
          </div>
        )}
        {(cardType !== 'txtImg' || side !== 'back') && (
          <div className="toolbar-group mb-4">
            <label className="block font-bold mb-2">Tamaño de fuente:</label>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="border p-2 rounded w-full"
            />
          </div>
        )}
        {(cardType !== 'txtImg' || side !== 'back') && (
          <div className="toolbar-group mb-4">
            <label className="block font-bold mb-2">Color:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        )}
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
        {cardType === 'txtImg' && side === 'back' && (
          <div className="toolbar-group mb-4">
            <label className="block font-bold mb-2">URL de la Imagen:</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value)
                setErrorMessage('')
              }}
              className="border p-2 rounded w-full"
            />
            <button
              onClick={handleImageUrlUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition"
            >
              Cargar Imagen
            </button>
          </div>
        )}
        {cardType === 'txtImg' && side === 'back' && backElements.length > 0 && (
          <div className="toolbar-group mb-4">
            <button
              onClick={handleDeleteImage}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Eliminar Imagen
            </button>
          </div>
        )}
        <button
          className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-green-300 focus:outline-none w-full"
          onClick={handleCreateCard}
        >
          Crear Carta
        </button>
      </div>
      <div className="canvas-container">
        <Stage width={cardWidth} height={cardHeight} className="card-canvas">
          <Layer>
            {side === 'front' && (
              <>
                <Rect
                  x={0}
                  y={100}
                  width={200}
                  height={200}
                  stroke="red"
                  dash={[4, 4]}
                />
              </>
            )}
            {side === 'back' && (
              <>
                {cardType === 'txtTxt' && (
                  <Rect
                    x={0}
                    y={100}
                    width={200}
                    height={300}
                    stroke="red"
                    dash={[4, 4]}
                  />
                )}
              </>
            )}
            {side === 'front' && frontText && frontText.type === 'text' && (
              <Text
                {...frontText}
                onDragEnd={handleDragEnd}
                onDblClick={() => {
                  const newText = prompt('Edita el texto:', frontText.text);
                  if (newText !== null) {
                    setFrontText({ ...frontText, text: newText });
                  }
                }}
              />
            )}
            {side === 'front' && frontText && frontText.type === 'image' && (
              <Image
                image={image}
                {...frontText}
              />
            )}
            {side === 'back' && backElements.map((element, index) => {
              if (element.type === 'text') {
                return (
                  <Text
                    key={index}
                    {...element}
                    onDragEnd={handleDragEnd}
                    onDblClick={() => {
                      const newText = prompt('Edita el texto:', element.text);
                      if (newText !== null) {
                        setBackElements(backElements.map(el => el === element ? { ...element, text: newText } : el));
                      }
                    }}
                  />
                );
              } else if (element.type === 'image') {
                return (
                  <Image
                    key={index}
                    image={image}
                    {...element}
                    onDragEnd={handleDragEnd}
                  />
                );
              }
              return null;
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}