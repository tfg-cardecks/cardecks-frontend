import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// local imports
import { API_URL } from "../config";
import MainButton from "../components/mainButton.jsx";
import SecondaryButton from "../components/secondaryButton.jsx";
import FormTextInput from "../components/FormTextInput.jsx";

const roles = ["admin", "authenticated", "customer"];

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    password2: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const { email, username, password, password2, role } = form;

  let navigate = useNavigate();

  function onInputChange(e) {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    setErrors({});
  }

  function validateForm() {
    const errors = {};
    if (!form.password2) {
      errors.password2 = "La confirmación de la contraseña es obligatoria";
    }
    if (form.password !== form.password2) {
      errors.password2 = "Las contraseñas no coinciden";
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      switch (response.status) {
        case 201:
          Swal.fire({
            title: "¡Éxito!",
            text: "Usuario registrado con éxito",
            icon: "success",
            confirmButtonText: "Iniciar sesión",
            timer: 1500,
          }).then(() => {
            navigate("/login");
          });
          break;
        case 400:
          setErrors(data);
          break;
        default:
          break;
      }
    } catch (error) {
      setErrors({ message: "Error al registrar el usuario" });
    }
  }

  return (
    <div className="h-screen flex flex-col justify-center bg-fixed home-container">
      <div className="w-1/2 p-11 mx-auto my-11 rounded-md shadow-lg flex flex-col justify-between bg-black bg-opacity-50 border-2 border-black backdrop-blur-sm">
        <h2
          className="text-4xl font-bold text-center mb-4 text-white"
          style={{ marginTop: "0px", marginBottom: "13px" }}
        >
          Registro
        </h2>
        {errors.message && <p className="text-yellow-200">{errors.message}</p>}
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-wrap -mx-3"
        >
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <FormTextInput
              labelFor="Username"
              labelText="Nombre de Usuario"
              placeholder="Introduce tu nombre de usuario"
              name="username"
              value={username}
              onChange={(e) => onInputChange(e)}
              errors={errors}
              isMandatory
            />
            <FormTextInput
              labelFor="Password"
              labelText="Contraseña"
              placeholder="Introduce tu contraseña"
              name="password"
              value={password}
              onChange={(e) => onInputChange(e)}
              type="password"
              errors={errors}
              isMandatory
            />
            <FormTextInput
              labelFor="Password2"
              labelText="Repite la Contraseña"
              placeholder="Introduce tu contraseña de nuevo"
              name="password2"
              value={password2}
              onChange={(e) => onInputChange(e)}
              type="password"
              errors={errors}
              isMandatory
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <FormTextInput
              labelFor="Email"
              labelText="Email"
              placeholder="Introduce tu email"
              name="email"
              value={email}
              onChange={(e) => onInputChange(e)}
              type="email"
              errors={errors}
              isMandatory
            />
            <div className="mb-4">
              <label
                htmlFor="Role"
                className="block text-white text-sm font-bold mb-2"
              >
                Rol *
              </label>
              <select
                name="role"
                value={role}
                onChange={(e) => onInputChange(e)}
                className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option value="">Selecciona tu rol</option>
                {roles.map((rol) => (
                  <option key={rol} value={rol}>
                    {rol}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-yellow-200 text-xs italic">{errors.role}</p>
              )}
            </div>
          </div>
          <div className="flex-row space-x-24 m-auto mt-4">
            <div className="flex items-center justify-center h-full">
              <p className="text-md text-white mb-1 mr-2 text-center">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/login"
                  className="text-green-400 hover:text-green-200"
                  style={{ marginRight: "2rem" }}
                >
                  Inicia sesión ahora
                </Link>
              </p>
            </div>
            <div
              className="flex justify-center"
              style={{ marginLeft: "10px", marginTop: "5%" }}
            >
              {MainButton("Registrar", "/", handleSubmit)}
              {SecondaryButton("Cancelar", "/")}
            </div>
          </div>
        </form>
      </div>
      <br></br>
    </div>
  );
}
