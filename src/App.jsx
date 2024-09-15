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
          {/* RUTAS PRIVADAS */}
          <Route
            path='/user/details'
            element={
              <UserDetail />
            }
          />
          <Route
            path='/user/:id/my-cards'
            element={
              <MyCards />
            }
          />
          <Route
            path='/user/:id/my-decks'
            element={
              <MyDecks />
            }
          />
          <Route
            path='/user/:id/create-deck'
            element={
              <CreateDeck />
            }
          />
          <Route path="/deck/:id" element={<DeckDetails />} />

        </Routes>
        <Footer />
      </AuthContextProvider>
    </Router>
  );
}