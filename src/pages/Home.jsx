import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/authContext";
import axios from "axios";
import { API_URL } from '../config';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import imagen1 from '../images/imagen1.png';
import imagen2 from '../images/imagen2.png';


export default function Home() {
  const { authenticated } = useAuthContext();
  const [userName, setUserName] = useState(null);

  async function fetchUserData() {
    try {
      if (authenticated) {
        const currentUserId = localStorage.getItem("userId");
        const response = await axios.get(`${API_URL}/api/users`);
        const user = response.data.find(user => user._id === currentUserId);
        setUserName(user.username);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [authenticated]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="flex flex-col justify-start home-container">
      <div className="container mx-auto flex flex-col items-center text-center mt-12">
        <div>
          {authenticated ? (
            <h2 className="text-4xl">
              ¡Bienvenido <span className="font-bold">{userName}</span>!
            </h2>
          ) : null}
        </div>
        <div className="mt-12 p-6 bg-white border border-black rounded-lg shadow-lg" style={{ marginBottom: '10%', width: '90%' }}>
          <Slider {...settings}>
            <div className="flex flex-col items-start justify-between">
              <div className="flex flex-row w-full p-4">
                <div className="w-1/2 p-2">
                  <h3 className="text-4xl font-bold mt-4">¡Crea tus propias FlashCards y toma el control de tu aprendizaje!</h3>
                  <br />
                  <p className="text-lg">Con Cardecks, puedes diseñar tarjetas de estudio personalizadas para hacer que el aprendizaje sea más atractivo y efectivo. ¡Adapta tus sesiones de estudio a tus necesidades y objetivos personales!</p>
                  <p className="text-lg">¡Recuerda, es tu estudio, tu estilo!</p>
                </div>
                <div className="w-1/2 p-2">
                  <img src={imagen1} alt="Característica 1" className="w-3/4" style={{ marginLeft: "15%" }} />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start justify-between">
              <div className="flex flex-row w-full p-4">
                <div className="w-1/2 p-2">
                  <h3 className="text-4xl font-bold mt-4">¡Aprende cualquier cosa mientras te diviertes jugando!</h3>
                  <br />
                  <p className="text-lg">Descubre una nueva forma de aprender cualquier tema mientras te diviertes. Personaliza tus cartas y participa en juegos interactivos que te ayudarán a mejorar tus conocimientos de manera entretenida y eficaz.</p>
                  <p className="text-lg">¡Aprender nunca ha sido tan entretenido!</p>
                </div>
                <div className="w-1/2 p-2">
                  <img src={imagen2} alt="Característica 2" className="h-10/12" style={{ marginLeft: "30%", width: '45%', marginTop: "-2%" }} />
                </div>
              </div>
            </div>
          </Slider>
        </div>
        <div className="flex flex-row w-11/12 p-4">
          <div className="w-1/2 p-2">
            <br />
            <h3 className="text-4xl font-bold">¿Qué es una Flashcard?</h3>
            <br />
            <p className="text-lg">Las flashcards son tarjetas de estudio que tienen una pregunta o concepto en un lado y la respuesta o explicación en el otro.</p>
            <br />
            <p className="text-lg">Estas tarjetas te permiten practicar lo que sabes y repasar lo que necesitas mejorar. Al revisar las tarjetas varias veces y en diferentes momentos, tu cerebro recuerda mejor la información. Es como tener una forma divertida y organizada de estudiar, lo que te ayuda a aprender más rápido y recordar lo que has estudiado por más tiempo.</p>
          </div>
          <div className="w-1/2 p-2 flex flex-row justify-center items-center">
            <img src={imagen1} alt="Característica 3" className="w-3/4 h-10/12" style={{ marginTop: "-5%" }} />
          </div>
        </div>

        <div className="flex flex-row w-11/12 p-4">
          <div className="w-1/2 p-2 flex flex-row justify-center items-center">
            <img src={imagen2} alt="Característica 3" className="h-10/12" style={{ width: '45%', marginTop: "-2%" }} />
          </div>

          <div className="w-1/2 p-2">
            <br />
            <h3 className="text-4xl font-bold">¿Qué es un Juego Educativo?</h3>
            <br />
            <p className="text-lg">Los juegos educativos en nuestra aplicación están diseñados para hacer que el aprendizaje sea una experiencia más divertida e interactiva. En lugar de estudiar de manera tradicional, los usuarios pueden aprender jugando, lo que les ayuda a mantenerse motivados y retener la información de manera más efectiva.</p>
            <br />
            <p className="text-lg">En nuestra aplicación, los juegos educativos utilizan cartas personalizadas para ofrecer una experiencia de aprendizaje única y dinámica.</p>
          </div>
        </div>
      </div>
    </div>
  );
}