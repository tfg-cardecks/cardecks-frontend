import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from './context/authContext';
// local imports
import Register from "./pages/Register";
import Login from "./pages/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import UserDetail from "./pages/UserDetail";

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
          {/* <Route path='/user/details' element={<UserDetail />} /> */}
          <Route
							path='/user/details'
							element={
									<UserDetail />
							}
						/>

        </Routes>
        <Footer />
      </AuthContextProvider>
    </Router>
  );
}