import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/authContext";
import axios from "axios";
import { API_URL } from '../config';
import AnimatedCards from "../components/AnimatedCards";
import Slider from "react-slick";
import '../styles/FondoCartas.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import carta from '../images/carta.png';
import carta1 from '../images/carta1.png';
import imagen1 from '../images/imagen1.png';
import imagen2 from '../images/imagen2.png';
import imagen3 from '../images/imagen3.png';
import juego from '../images/juego.png';
import manual from '../images/manual.png';


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
      <AnimatedCards pageClass="home-page" animationClass="home-animation" />
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
                  <h3 className="text-4xl font-bold">Create Your Own FlashCards and Take Control of Your Learning!</h3>
                  <br />
                  <p className="text-lg">With Cardecks, you can design custom study flaschcards to make learning more engaging and effective. Tailor your study sessions to suit your personal needs and goals!</p>
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
                  <h3 className="text-4xl font-bold">Learn English while having fun!</h3>
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
        <div className="flex flex-row w-11/12 p-4">
          <div className="w-1/2 p-2">
            <br />
            <h3 className="text-4xl font-bold">What is a Flashcard?</h3>
            <br />
            <p className="text-lg">Flashcards are study cards that have a question or concept on one side and the answer or explanation on the other.</p>
            <br />
            <p className="text-lg">These flashcards allow you to practice what you know and review what you need to improve. By reviewing the flashcards multiple times and at different times, your brain remembers the information better. It's like having a fun and organized way of studying, which helps you learn faster and remember what you've studied for longer.</p>
          </div>
          <div className="w-1/2 p-2 flex flex-row justify-center items-center">
            <img src={carta} alt="Feature 3" className="max-w-72 min-h-px mr-2" />
            <img src={carta1} alt="Feature 4" className="max-w-72 min-h-px ml-2" />
          </div>
        </div>

        <div className="flex flex-row w-11/12 p-4">
          <div className="w-1/2 p-2 flex flex-row justify-center items-center">
            <img src={juego} alt="Feature 3" className="w-full h-auto mr-2" style={{ maxWidth: '1000px', maxHeight: '1000px' }} />
          </div>

          <div className="w-1/2 p-2">
            <br />
            <h3 className="text-4xl font-bold">What is an Educational Game?</h3>
            <br />
            <p className="text-lg">The educational games in our app are designed to make learning a more fun and interactive experience. Instead of studying in a traditional way, users can learn by playing, which helps them stay motivated and retain information more effectively.</p>
            <br />
            <p className="text-lg">Our games allow users to practice vocabulary, grammar, and other topics in an entertaining way. Learning through play helps users enjoy the process more and incorporate it into their daily study routine without feeling overwhelmed.</p>
          </div>
        </div>

        <div className="flex flex-row w-11/12 p-4">
          <div className="w-1/2 p-2">
            <br />
            <h3 className="text-4xl font-bold">Manuals</h3>
            <br />
            <p className="text-lg">In our app, you have access to a variety of manuals designed to help you get the most out of your card games. These manuals will guide you in creating and customizing your own games using the decks and cards.</p>
            <br />
            <p className="text-lg">They will teach you how to set up your games, how to apply the rules, and how to enjoy a complete and personalized gaming experience. With our manuals, you can design and play with rules that suit your preferences, ensuring that every game session is fun and tailored to your needs.</p>
          </div>
          <div className="w-1/2 p-2 flex flex-row justify-center items-center">
            <img src={manual} alt="Feature 3" className="w-full min-h-px mr-2" />
          </div>
        </div>

      </div>
    </div>
  );
}