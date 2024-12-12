import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// local imports
import { useAuthContext } from "../context/authContext";
import { API_URL } from "../config";
import MainButton from "../components/mainButton.jsx";
import SecondaryButton from "../components/secondaryButton.jsx";

export default function Login() {
  const { login } = useAuthContext();
  const [form, setForm] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const { emailOrUsername, password } = form;
  let navigate = useNavigate();

  function onInputChange(e) {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    setErrors({});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      switch (response.status) {
        case 200:
          Swal.fire({
            icon: "info",
            title: "Por favor espera",
            text: "Iniciando sesión. Esto puede tardar un poco.",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            login(data.token, data.role, data.id);
            if (data.isNewUser) {
              Swal.fire({
                icon: "success",
                title: "¡Bienvenido!",
                text: "¿Quieres ir a crear una carta para poder empezar a jugar los juegos?",
                showCancelButton: true,
                confirmButtonText: "Sí",
                cancelButtonText: "No",
              }).then((result) => {
                if (result.isConfirmed) {
                  navigate(`/user/${data.id}/preview`);
                } else {
                  navigate("/user/details");
                }
              });
            } else {
              navigate("/user/details");
            }
          });
          break;
        case 404:
        case 400:
        case 401:
          setErrors(data);
          break;
        default:
          break;
      }
    } catch (error) {
      setErrors({ message: "Error de conexión. Inténtalo de nuevo." });
    }
  }

  return (
    <div className="flex flex-col justify-center bg-fixed home-container">
      <div className="w-1/2 h-1/2 p-11 mx-auto my-11 rounded-md shadow-lg flex flex-col justify-between bg-black bg-opacity-50 border-2 border-black backdrop-blur-sm overflow-auto">
        <h2
          className="text-4xl font-bold text-center mb-4 text-white"
          style={{ marginTop: "0px", marginBottom: "15px", marginRight: "5%" }}
        >
          Iniciar sesión
        </h2>

        {errors.message && <p className="text-yellow-200">{errors.message}</p>}

        <div className="flex items-center justify-center h-full">
          <p className="text-md text-white mb-1 mr-2 text-center">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="text-green-400 hover:text-green-200"
              style={{ marginRight: "2rem" }}
            >
              Regístrate ahora
            </Link>
          </p>
        </div>

        <form onSubmit={(e) => handleSubmit(e)}>
          <div
            className="flex"
            style={{ marginBottom: "1rem", marginTop: "3%" }}
          >
            <label
              htmlFor="emailOrUsername"
              className="block text-lg font-bold text-white self-center text-center"
              style={{
                marginBottom: "1rem",
                marginRight: "2rem",
                marginLeft: "4rem",
              }}
            >
              Usuario
            </label>
            <div className="flex-grow" style={{ marginRight: "10.2rem" }}>
              <input
                type="text"
                className="leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                style={{ width: "100%", padding: "0.5rem 0.75rem", marginLeft: "2.2rem" }}
                placeholder="Escribe tu nombre de usuario"
                name="emailOrUsername"
                value={emailOrUsername}
                onChange={(e) => onInputChange(e)}
              />
              {errors.emailOrUsername && (
                <p className="text-yellow-200 text-xs italic">
                  {errors.emailOrUsername}
                </p>
              )}
            </div>
          </div>
          <div className="flex" style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="Password"
              className="block text-lg font-bold text-white self-center"
              style={{ marginRight: "2rem", marginLeft: "4rem" }}
            >
              Contraseña
            </label>
            <div
              className="flex-grow"
              style={{ marginRight: "8rem", marginLeft: "0.25rem" }}
            >
              <input
                type="password"
                className="leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                style={{ width: "100%", padding: "0.5rem 0.75rem" }}
                placeholder="Introduce tu contraseña"
                name="password"
                value={password}
                onChange={(e) => onInputChange(e)}
              />
              {errors.password && (
                <p className="text-yellow-200 text-xs italic">
                  {errors.password}
                </p>
              )}
            </div>
          </div>
          {errors.errors && errors.errors[0] && errors.errors[0].detail && (
            <p className="text-yellow-200">{errors.errors[0].detail}</p>
          )}
          <div className="flex-row space-x-24 m-auto mt-4">
            <div className="flex items-center justify-center h-full">
              <Link to="/remember-password" className="text-blue-300 hover:text-blue-700">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div
              className="flex justify-center"
              style={{ marginLeft: "10px", marginTop: "2%" }}
            >
              {MainButton("Iniciar", "/", handleSubmit)}
              {SecondaryButton("Cancelar", "/")}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
