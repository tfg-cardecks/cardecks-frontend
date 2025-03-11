import React from 'react';
import { useAuthContext } from '../context/authContext';

export default function Contact() {
  const { authenticated } = useAuthContext();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Contacto</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Dirección de correo electrónico</h2>
          <p className="text-lg text-gray-600">
            <a href="mailto:cardeckstfg@gmail.es" className="text-blue-500 hover:underline">cardeckstfg@gmail.es</a>
          </p>
        </section>
        <section className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Preguntas frecuentes</h2>
          <h3 className="text-xl font-semibold mb-3 text-gray-700">¿Cómo puedo solucionar un problema de cuenta de usuario?</h3>
          <p className="text-lg text-gray-600 mb-4">
            Algunos problemas habituales pueden resolverse en línea:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-600 mb-4">
            <li><a href="/remember-password" className="text-blue-500 hover:underline">Olvidé la contraseña</a></li>
            {authenticated && (
              <li><a href="/user/edit" className="text-blue-500 hover:underline">Editar detalles personales</a></li>
            )}
          </ul>
          <p className="text-lg text-gray-600">
            Otras cuestiones pueden resolverse enviando un correo electrónico a <a href="mailto:cardeckstfg@gmail.es" className="text-blue-500 hover:underline">cardeckstfg@gmail.es</a>.
          </p>
        </section>

        <section className="md:col-span-2">
          <h3 className="text-xl font-semibold mb-3 text-gray-700">¿Cómo informo sobre un problema o hago una solicitud?</h3>

          <p className="text-lg text-gray-600">
            Puedes enviar un correo electrónico al equipo de desarrollo: <a href="mailto:cardeckstfg@gmail.es" className="text-blue-500 hover:underline">cardeckstfg@gmail.es</a>.
          </p>
        </section>
      </div>
    </div>
  );
}