import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// local imports
import { API_URL } from "../config";
import MainButton from "../components/mainButton.jsx";
import SecondaryButton from "../components/secondaryButton.jsx";
import FormTextInput from "../components/FormTextInput.jsx";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    password2: "",
    role: "authenticated",
  });

  const [errors, setErrors] = useState({});
  const { email, username, password, password2, role } = form;
  const [checkedTerms, setCheckedTerms] = useState(false);
  const [checkedPriv, setCheckedPriv] = useState(false);

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
    if (checkedTerms === false) {
      setErrors({ message: "Debes aceptar los términos y condiciones" });
      return;
    } else if (checkedPriv === false) {
      setErrors({ message: "Debes aceptar la política de privacidad" });
      return;
    } else {
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
  }

  function showTerms() {
    Swal.fire({
      html: `
        <div style="text-align: left;">
          <h1 class="text-4xl font-bold mb-8 text-center text-gray-800">Términos de Uso de Cardecks</h1>
          <p class="text-sm text-gray-500 mb-12 text-center">Última actualización: ${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}</p>
          <div class="space-y-12">
            <section>
              <p class="text-lg text-gray-600">
                ¡Bienvenido a <strong>Cardecks</strong>! Te invitamos a leer estos términos detenidamente antes de acceder o usar nuestra plataforma. Si tienes alguna pregunta o inquietud, estamos aquí para ayudarte.
              </p>
            </section>
            <section>
              <h2 class="text-3xl font-semibold mb-4 text-gray-700">1. Aceptación de los Términos</h2>
              <p class="text-lg text-gray-600">
                Al registrarte en Cardecks, reconoces que has tenido la oportunidad de leer, entender y aceptar estos Términos de Uso y nuestra Política de Privacidad. Por favor, revisa estos términos antes de continuar. Si no los aceptas, puedes contactarnos con cualquier duda antes de utilizar nuestros servicios.
              </p>
            </section>
            <section>
              <h2 class="text-3xl font-semibold mb-4 text-gray-700">2. Modificación de los Términos</h2>
              <p class="text-lg text-gray-600">
                Ocasionalmente, podremos actualizar estos Términos de Uso para reflejar cambios en el servicio, requisitos de cumplimiento o mejoras. Cardecks proporcionará un aviso claro de los cambios importantes a través de la plataforma y, cuando sea posible, por correo electrónico. En los casos en que los cambios afecten tus derechos u obligaciones, describiremos las modificaciones y solicitaremos tu consentimiento explícito para continuar usando la plataforma. Si prefieres no aceptar las actualizaciones, puedes dejar de usar nuestros servicios en cualquier momento. Te recomendamos revisar estos términos periódicamente para estar informado.
              </p>
            </section>
            <section>
              <h2 class="text-3xl font-semibold mb-4 text-gray-700">3. Uso de la Plataforma</h2>
              <ul class="list-disc list-inside text-lg text-gray-600 space-y-2">
                <li><strong>Edad:</strong> Debes tener al menos 13 años para utilizar Cardecks. Los usuarios menores de 13 años necesitan el consentimiento de un padre o tutor.</li>
                <li><strong>Registro:</strong> Aceptas proporcionar información precisa y actualizada durante el registro y eres responsable de mantener la confidencialidad de tu cuenta y contraseña.</li>
                <li><strong>Uso Aceptable:</strong> Tu uso de Cardecks debe cumplir con todas las leyes y regulaciones aplicables y no debe:
                  <ul class="list-disc list-inside ml-4">
                    <li>Infringir derechos de propiedad intelectual.</li>
                    <li>Transmitir contenido dañino, abusivo, ofensivo o ilegal.</li>
                  </ul>
                </li>
              </ul>
            </section>
            <section>
              <h2 class="text-3xl font-semibold mb-4 text-gray-700">4. Propiedad Intelectual</h2>
              <p class="text-lg text-gray-600">
                Todo el contenido y los derechos de propiedad intelectual asociados con Cardecks son propiedad de Cardecks o sus licenciantes. La reproducción, distribución, modificación o creación de obras derivadas requiere autorización previa.
              </p>
            </section>
            <section>
              <h2 class="text-3xl font-semibold mb-4 text-gray-700">5. Contenido de Usuario</h2>
              <ul class="list-disc list-inside text-lg text-gray-600 space-y-2">
                <li><strong>Responsabilidad:</strong> Eres responsable del contenido que creas y compartes en Cardecks. Al hacerlo, afirmas que posees los derechos sobre dicho contenido y que no infringe derechos de terceros.</li>
                <li><strong>Licencia:</strong> Al cargar contenido, otorgas a Cardecks una licencia no exclusiva, mundial y gratuita para usar, reproducir y distribuir este contenido en nuestra plataforma. Conservas la propiedad de tu contenido y puedes seguir usándolo en otras plataformas.</li>
              </ul>
            </section>
            <section>
              <h2 class="text-3xl font-semibold mb-4 text-gray-700">6. Limitación de Responsabilidad</h2>
              <p class="text-lg text-gray-600">
                Aunque nos esforzamos por ofrecer una plataforma segura y confiable, ten en cuenta lo siguiente:
              </p>
              <ul class="list-disc list-inside text-lg text-gray-600 space-y-2">
                <li><strong>Disponibilidad de la Plataforma:</strong> Cardecks no puede garantizar la disponibilidad ininterrumpida del servicio ni la precisión del contenido en todo momento.</li>
                <li><strong>Contenido y Servicios de Terceros:</strong> Cardecks no es responsable por el contenido, los servicios o los fallos técnicos de terceros que estén fuera de nuestro control.</li>
                <li><strong>Responsabilidad del Usuario:</strong> Los usuarios deben cumplir con las obligaciones legales pertinentes. Esta limitación de responsabilidad se aplica en la máxima medida permitida por la ley.</li>
              </ul>
            </section>
            <section>
              <h2 class="text-3xl font-semibold mb-4 text-gray-700">7. Ley Aplicable</h2>
              <p class="text-lg text-gray-600">
                Estos Términos de Uso se rigen e interpretan de acuerdo con las leyes aplicables en tu país de residencia, garantizando que tus derechos estén protegidos bajo la legislación local.
              </p>
            </section>
            <section>
              <h2 class="text-3xl font-semibold mb-4 text-gray-700">8. Jurisdicción</h2>
              <p class="text-lg text-gray-600">
                En caso de disputas legales que no puedan resolverse de manera informal, las disputas podrán remitirse a los tribunales competentes de Sevilla, España, o según lo estipulen las normativas locales de tu país de residencia.
              </p>
            </section>
            <section>
              <h2 class="text-3xl font-semibold mb-4 text-gray-700">9. Contacto</h2>
              <p class="text-lg text-gray-600">
                Si tienes preguntas o comentarios sobre estos Términos de Uso, no dudes en contactarnos en <a href="mailto:cardeckstfg@gmail.es" class="text-blue-500 hover:underline">cardeckstfg@gmail.es</a>.
              </p>
            </section>
          </div>
        </div>
      `,
      width: '1000px',
      confirmButtonText: 'Cerrar',
    });
  }

  function showPriv() {
    Swal.fire({
      html: `
        <div style="text-align: left;">
          <h1 class="text-4xl font-bold mb-8 text-center text-gray-800">Aviso de Privacidad y Protección de Datos</h1>
          <p class="text-sm text-gray-500 mb-12 text-center">Última actualización: ${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}</p>
          <div class="space-y-12">
            <section>
              <h2 class="text-3xl font-semibold mb-4 text-gray-700">1. Introducción</h2>
              <p class="text-lg text-gray-600">
                En Cardeck, respetamos la privacidad de nuestros usuarios y estamos comprometidos a proteger sus datos personales. Este Aviso de Privacidad explica cómo recopilamos, utilizamos, compartimos y protegemos la información personal que proporcionas al usar nuestra plataforma.
              </p>
            </section>

            <section>
              <h2 class="text-3xl font-semibold mb-4 text-gray-700">2. Responsable del tratamiento de datos</h2>
              <p class="text-lg text-gray-600">
                La entidad responsable del tratamiento de los datos personales recopilados a través de la plataforma es Cardeck. Para cualquier pregunta o solicitud relacionada con la protección de tus datos personales, puedes contactarnos a través del correo electrónico: <a href="mailto:cardeckstfg@gmail.es" class="text-blue-500 hover:underline">cardeckstfg@gmail.es</a>.
              </p>
            </section>

            <section>
              <h2 class="text-3xl font-semibold mb-4 text-gray-700">3. Datos personales que recopilamos</h2>
              <p class="text-lg text-gray-600 mb-4">Recopilamos los siguientes tipos de datos personales para poder proporcionarte nuestros servicios:</p>
              <ul class="list-disc list-inside text-lg text-gray-600 space-y-2">
                <li><strong>Datos de registro:</strong> Dirección de correo electrónico, nombre de usuario y contraseña.</li>
                <li><strong>Información de pago:</strong> Si decides adquirir algún servicio de pago, recopilaremos la información necesaria para procesar el pago (por ejemplo, tarjeta de crédito, dirección de facturación).</li>
                <li><strong>Datos de uso:</strong> Información sobre cómo interactúas con la plataforma, como las cartas que creas, los mazos que organizas y tus preferencias de juego.</li>
              </ul>
            </section>

            <section>
              <h2 class="text-3xl font-semibold mb-4 text-gray-700">4. Finalidad del tratamiento de los datos</h2>
              <p class="text-lg text-gray-600 mb-4">Tus datos personales serán tratados para los siguientes fines:</p>
              <ul class="list-disc list-inside text-lg text-gray-600 space-y-2">
                <li>Proporcionar los servicios de la plataforma, incluyendo la creación y organización de cartas y mazos.</li>
                <li>Gestionar tu cuenta y ofrecer asistencia técnica.</li>
                <li>Procesar pagos y gestionar transacciones.</li>
                <li>Mejorar y personalizar tu experiencia en la plataforma.</li>
                <li>Cumplir con nuestras obligaciones legales y contractuales.</li>
              </ul>
            </section>

            <section>
              <h2 class="text-3xl font-semibold mb-4 text-gray-700">5. Compartición de datos</h2>
              <p class="text-lg text-gray-600">
                No compartimos tus datos personales con terceros, salvo en los siguientes casos:
              </p>
              <ul class="list-disc list-inside text-lg text-gray-600 space-y-2">
                <li><strong>Proveedores de servicios:</strong> Compartimos tu información con proveedores que nos ayudan a operar la plataforma (por ejemplo, servicios de hosting, procesamiento de pagos).</li>
                <li><strong>Obligaciones legales:</strong> Podemos compartir tus datos si estamos obligados por ley a hacerlo.</li>
              </ul>
            </section>

            <section>
              <h2 class="text-3xl font-semibold mb-4 text-gray-700">6. Derechos del usuario</h2>
              <p class="text-lg text-gray-600 mb-4">De acuerdo con la legislación aplicable, tienes derecho a:</p>
              <ul class="list-disc list-inside text-lg text-gray-600 space-y-2">
                <li>Acceder a tus datos personales.</li>
                <li>Rectificar cualquier dato incorrecto o incompleto.</li>
                <li>Solicitar la eliminación de tus datos.</li>
                <li>Limitar el tratamiento de tus datos o oponerte al mismo.</li>
              </ul>
              <p class="text-lg text-gray-600">
                Puedes ejercer tus derechos enviándonos un correo electrónico a <a href="mailto:cardeckstfg@gmail.es" class="text-blue-500 hover:underline">cardeckstfg@gmail.es</a>.
              </p>
            </section>

            <section>
              <h2 class="text-3xl font-semibold mb-4 text-gray-700">7. Seguridad de los datos</h2>
              <p class="text-lg text-gray-600">
                Nos tomamos muy en serio la seguridad de tus datos personales y utilizamos medidas adecuadas para protegerlos contra el acceso no autorizado, pérdida o uso indebido. No obstante, ningún sistema de transmisión de datos o almacenamiento es completamente seguro, por lo que no podemos garantizar la seguridad absoluta de la información.
              </p>
            </section>

            <section>
              <h2 class="text-3xl font-semibold mb-4 text-gray-700">8. Uso de cookies y tecnologías similares</h2>
              <p class="text-lg text-gray-600">
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia en la plataforma, analizar el uso de nuestros servicios y personalizar el contenido. Puedes ajustar la configuración de tu navegador para rechazar las cookies, aunque esto puede afectar tu experiencia de uso.
              </p>
            </section>

            <section>
              <h2 class="text-3xl font-semibold mb-4 text-gray-700">9. Cambios en el aviso de privacidad</h2>
              <p class="text-lg text-gray-600">
                Podemos actualizar este Aviso de Privacidad ocasionalmente para reflejar cambios en nuestros servicios, cumplir con requisitos legales o mejorar la protección de datos. Cuando realicemos cambios importantes, te notificaremos mediante un aviso en la plataforma y, cuando sea posible, por correo electrónico. Estos cambios solo entrarán en vigor después de un período de notificación de al menos 30 días, durante el cual tendrás la oportunidad de revisarlos y decidir si continuar utilizando la plataforma. Te recomendamos revisar este Aviso periódicamente para estar al tanto de cualquier modificación.
              </p>
            </section>

            <section>
              <h2 class="text-3xl font-semibold mb-4 text-gray-700">10. Contacto</h2>
              <p class="text-lg text-gray-600">
                Si tienes alguna pregunta sobre este Aviso de Privacidad o sobre el tratamiento de tus datos personales, no dudes en contactarnos a través de <a href="mailto:cardeckstfg@gmail.es" class="text-blue-500 hover:underline">cardeckstfg@gmail.es</a>.
              </p>
            </section>
          </div>
        </div>
      `,
      width: '1000px',
      confirmButtonText: 'Cerrar',
    });
  }

  return (
    <div className=" flex flex-col justify-center bg-fixed home-container">
      <div className="w-1/2 h-1/2 p-11 mx-auto my-11 rounded-md shadow-lg flex flex-col justify-between bg-black bg-opacity-50 border-2 border-black backdrop-blur-sm">
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
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={checkedTerms}
                onChange={(e) => setCheckedTerms(e.target.checked)}
              />
              <span className="ml-2 text-white">
                Acepto los{" "}
                <button
                  type="button"
                  className="text-green-400 hover:text-green-200 underline"
                  onClick={showTerms}
                >
                  términos de uso
                </button>
              </span>
            </label>
          </div>
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={checkedPriv}
                onChange={(e) => setCheckedPriv(e.target.checked)}
              />
              <span className="ml-2 text-white">
                Acepto el{" "}
                <button
                  type="button"
                  className="text-green-400 hover:text-green-200 underline"
                  onClick={showPriv}
                >
                  aviso de privacidad y protección de datos
                </button>
              </span>
            </label>
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