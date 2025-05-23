import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from './context/authContext';
// local imports
import Register from "./pages/Register";
import Login from "./pages/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import UserDetail from "./pages/UserDetail";
import UserDetailStatistics from "./pages/UserDetailStatistics";
import MyCards from "./pages/MyCards";
import MyDecks from "./pages/MyDecks";
import CreateDeck from "./pages/CreateDeck";
import DeckDetails from "./pages/DeckDetails";
import DeckDetailsEdit from "./pages/DeckDetailsEdit";
import CardDetails from "./pages/CardDetails";
import CardDetailsEdit from "./pages/CardDetailsEdit";
import PreviewFormCard from "./pages/PreviewFormCard";
import CreateTxtImgCard from "./pages/CreateTxtImgCard";
import CreateTxtTxtCard from "./pages/CreateTxtTxtCard";
import PrivacyNotice from "./pages/PrivacyNotice";
import Contact from "./pages/Contact";
import TermsOfUse from "./pages/TermsOfUse";
import LobbyGames from "./pages/LobbyGames";
import RememberPassword from "./pages/RememberPassword";
import EditUserDetail from "./pages/EditUserDetail";
import EditUserPassword from "./pages/EditUserPassword";
import ResetPassword from "./pages/ResetPassword";
import SelectDeckGame from "./pages/SelectDeckGame";
import WordSearchGame from "./pages/games/WordSearchGame";
import HangmanGame from "./pages/games/HangmanGame";
import GuessTheImageGame from "./pages/games/GuessTheImageGame";
import MatchingGame from "./pages/games/MatchingGame";
import LetterOrderGame from "./pages/games/LetterOrderGame";
import ErrorPage from "./pages/ErrorPage";

export default function App() {
  return (
    <Router>
      <AuthContextProvider>
        <Header />
        <Routes>
          {/* RUTAS PUBLICAS */}
          <Route index element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/privacy-notice' element={<PrivacyNotice />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/terms-of-use' element={<TermsOfUse />} />
          <Route path='/remember-password' element={<RememberPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          {/* RUTAS PRIVADAS */}
          <Route path='/user/details' element={<UserDetail />} />
          <Route path='/user/statistics' element={<UserDetailStatistics />} />
          <Route path='/user/:id/my-cards' element={<MyCards />} />
          <Route path='/user/:id/my-decks' element={<MyDecks />} />
          <Route path="/user/edit" element={<EditUserDetail />} />
          <Route path="/user/edit/password" element={<EditUserPassword />} />
          <Route path='/user/:id/create-deck' element={<CreateDeck />} />
          <Route path="/card/:id" element={<CardDetails />} />
          <Route path="/deck/:id" element={<DeckDetails />} />
          <Route path="/deck/edit/:id" element={<DeckDetailsEdit />} />
          <Route path="/card/edit/:id" element={<CardDetailsEdit />} />
          <Route path="/user/:id/preview" element={<PreviewFormCard />} />
          <Route path="/create-card/txtImg" element={<CreateTxtImgCard />} />
          <Route path="/create-card/txtTxt" element={<CreateTxtTxtCard />} />
          <Route path="/lobby" element={<LobbyGames />} />
          <Route path="/selectDeckGame/:gameType/:id" element={<SelectDeckGame />} />
          <Route path="/wordSearchGame/:wordSearchGameId" element={<WordSearchGame />} />
          <Route path="/hangmanGame/:hangmanGameId" element={<HangmanGame />} />
          <Route path="/guessTheImageGame/:guessTheImageGameId" element={<GuessTheImageGame />} />
          <Route path="/matchingGame/:matchingGameId" element={<MatchingGame />} />
          <Route path="/letterOrderGame/:letterOrderGameId" element={<LetterOrderGame />} />
          {/* Ruta para manejar URLs no válidas */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <Footer />
      </AuthContextProvider>
    </Router>
  );
}