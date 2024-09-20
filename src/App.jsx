import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from './context/authContext';
// local imports
import Register from "./pages/Register";
import Login from "./pages/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import UserDetail from "./pages/UserDetail";
import MyCards from "./pages/MyCards";
import MyDecks from "./pages/MyDecks";
import CreateDeck from "./pages/CreateDeck";
import DeckDetails from "./pages/DeckDetails";
import DeckDetailsEdit from "./pages/DeckDetailsEdit";
import CardDetails from "./pages/CardDetails";
import CardDetailsEdit from "./pages/CardDetailsEdit";
import PreviewForm from "./pages/PreviewForm";
import CreateTxtImgCard from "./pages/CreateTxtImgCard";
import CreateTxtTxtCard from "./pages/CreateTxtTxtCard";
import PrivacyNotice from "./pages/PrivacyNotice";
import Contact from "./pages/Contact";
import TermsOfUse from "./pages/TermsOfUse";

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
          <Route path= '/privacy-notice' element={<PrivacyNotice />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/terms-of-use' element={<TermsOfUse />} />
          {/* RUTAS PRIVADAS */}
          <Route path='/user/details' element={<UserDetail />} />
          <Route path='/user/:id/my-cards' element={<MyCards />} />
          <Route path='/user/:id/my-decks' element={<MyDecks />} />
          <Route path='/user/:id/create-deck' element={<CreateDeck />} />
          <Route path="/card/:id" element={<CardDetails />} />
          <Route path="/deck/:id" element={<DeckDetails />} />
          <Route path="/deck/edit/:id" element={<DeckDetailsEdit />} />
          <Route path="/card/edit/:id" element={<CardDetailsEdit />} />
          <Route path="/user/:id/preview" element={<PreviewForm />} />
          <Route path="/create-card/txtImg" element={<CreateTxtImgCard />} />
          <Route path="/create-card/txtTxt" element={<CreateTxtTxtCard />} />
        </Routes>
        <Footer />
      </AuthContextProvider>
    </Router>
  );
}