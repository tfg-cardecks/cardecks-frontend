import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/authContext";
import axios from "axios";
import { API_URL } from '../config';
import AnimatedCards from "../components/AnimatedCards";
import Slider from "react-slick";
import '../styles/FondoCartas.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import imagen1 from '../images/imagen1.png';
import imagen2 from '../images/imagen2.png';
import imagen3 from '../images/imagen3.png';

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
      <AnimatedCards initialCount={5} interval={3000} minDistance={20} maxCount={15} />
      <div className="container mx-auto flex flex-col items-center text-center mt-20">
        <div>
          {authenticated ? (
            <h2 className="text-4xl">
              Welcome <span className="font-bold">{userName}</span>!
            </h2>
          ) : null}
        </div>
        <div className="mt-12 p-6 bg-white border border-black rounded-lg shadow-lg" style={{ marginBottom: '10%', width: '85%', marginTop: '6%' }}>
          <Slider {...settings}>

            <div className="flex flex-col items-start justify-between">
              <div className="flex flex-row w-full p-4">
                <div className="w-1/2 p-2">
                  <br />
                  <br />
                  <h3 className="text-4xl font-bold">Create Your Own Cards and Take Control of Your Learning!</h3>
                  <br />
                  <p className="text-lg">With Cardecks, you can design custom study cards to make learning more engaging and effective. Tailor your study sessions to suit your personal needs and goals!</p>
                  <p className="text-lg">Remember, it's your study, your style!</p>
                </div>
                <div className="w-1/2 p-2">
                  <img src={imagen1} alt="Feature 1" className="w-full h-max" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start justify-between">
              <div className="flex flex-row w-full p-4">
                <div className="w-1/2 p-2">
                  <br />
                  <br />
                  <br />
                  <h3 className="text-4xl font-bold">Learn English while having fun
                    !</h3>
                  <br />
                  <p className="text-lg">Discover a different way to learn English with interactive and challenging games. Improve your vocabulary, grammar and comprehension without realizing it while you immerse yourself in a fun and educational experience.</p>
                  <p className="text-lg">Learning has never been so entertaining!</p>

                </div>
                <div className="w-1/2 p-2">
                  <img src={imagen2} alt="Feature 2" className="w-full h-max" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start justify-between">
              <div className="flex flex-row w-full p-4">
                <div className="w-1/2 p-2">
                  <br />
                  <h3 className="text-4xl font-bold">Turn studying into a game: Download our manuals and start now!</h3>
                  <br />
                  <p className="text-lg">Access a collection of workbooks designed to make learning more fun and effective. With our interactive guides, you'll learn at your own pace while enjoying every step of the way</p>
                  <p className="text-lg">It's time to turn studying into an adventure you won't want to leave!</p>
                </div>
                <div className="w-1/2 p-2">
                  <img src={imagen3} alt="Feature 3" className="w-full h-max" />
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
}