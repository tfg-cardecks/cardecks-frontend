import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/authContext";
import Typewriter from "../components/typewriter.jsx";
import axios from "axios";
import { API_URL } from '../config';
import MainButton from "../components/mainButton.jsx";
import SecondaryButton from "../components/secondaryButton.jsx";
import AnimatedCards from "../components/AnimatedCards"; // Importa el nuevo componente
import '../styles/FondoCartas.css'; // Importa el archivo CSS

export default function Home() {
  const { authenticated } = useAuthContext();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
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
    fetchUserData();
  }, [authenticated]);

  return (
    <div className="flex flex-col justify-start home-container">
              <AnimatedCards initialCount={5} interval={3000} minDistance={20} maxCount={15} /> 

      <div className="container mx-auto flex flex-col items-center text-center mt-20">
        <h1 className="home-title">
          <span className="blinker">| </span>
          <Typewriter text="Welcome to IT TALENT" delay={100} />
          <br />
        </h1>
        <h2>
          Prepare for a <strong>revolution</strong>
          <br />
          in hiring computer professionals
        </h2>
        <h3><strong>Join us now!</strong></h3>

        <div>
          {authenticated ? (
            <h2>
              Welcome {userName}!
            </h2>
          ) : (
            <div className="flex gap-24 mt-12">
              {MainButton("Register", "/register", "")}
              {SecondaryButton("Log in", "/login", "")}
            </div>
          )}

          <br></br>
          <br></br>
          <br></br>
          <br></br>
        </div>
      </div>
    </div>
  );
}