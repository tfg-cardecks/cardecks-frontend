import React from 'react';

export default function TermsOfUse() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Términos de Uso de Cardecks</h1>
      <p className="text-sm text-gray-500 mb-12 text-center">Última actualización: {new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear()}</p>
      
      <div className="space-y-12">
        <section>
          <p className="text-lg text-gray-600">
            Bienvenido a Cardecks. Al acceder y utilizar nuestra plataforma, aceptas cumplir con los siguientes términos de uso. Si no estás de acuerdo con estos términos, te recomendamos que no utilices nuestro servicio.
          </p>
        </section>
        
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">1. Aceptación de los Términos</h2>
          <p className="text-lg text-gray-600">
            Al registrarte y utilizar Cardecks, aceptas estos Términos de Uso y nuestra Política de Privacidad. Estos términos pueden ser actualizados en cualquier momento, y te recomendamos revisarlos periódicamente.
          </p>
        </section>
        
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">2. Uso de la Plataforma</h2>
          <ul className="list-disc list-inside text-lg text-gray-600 space-y-2">
            <li><strong>Edad:</strong> Debes tener al menos 13 años para utilizar Cardecks. Si eres menor de 13 años, necesitarás el consentimiento de un padre o tutor.</li>
            <li><strong>Registro:</strong> Al registrarte, proporcionas información veraz y actualizada. Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.</li>
            <li><strong>Uso Aceptable:</strong> No puedes utilizar Cardecks para:
              <ul className="list-disc list-inside ml-4">
                <li>Violar leyes o regulaciones aplicables.</li>
                <li>Infringir derechos de propiedad intelectual.</li>
                <li>Transmitir contenido dañino, abusivo, ofensivo o ilegal.</li>
              </ul>
            </li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">3. Propiedad Intelectual</h2>
          <p className="text-lg text-gray-600">
            Todos los derechos de propiedad intelectual sobre Cardecks y su contenido son propiedad de Cardecks o de sus licenciantes. No puedes reproducir, distribuir, modificar ni crear obras derivadas de la plataforma sin nuestra autorización previa.
          </p>
        </section>
        
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">4. Contenido de Usuario</h2>
          <ul className="list-disc list-inside text-lg text-gray-600 space-y-2">
            <li><strong>Responsabilidad:</strong> Eres responsable del contenido que creas y compartes en Cardecks. Al hacerlo, garantizas que tienes el derecho de usar dicho contenido y que no infringe derechos de terceros.</li>
            <li><strong>Licencia:</strong> Al subir contenido, nos otorgas una licencia no exclusiva, mundial y gratuita para utilizar, reproducir y distribuir dicho contenido en nuestra plataforma. Retienes todos los derechos sobre tu contenido y puedes seguir utilizándolo en otras plataformas o contextos fuera de Cardecks.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">5. Limitación de Responsabilidad</h2>
          <p className="text-lg text-gray-600">
            Cardecks no se hace responsable de:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-600 space-y-2">
            <li>Daños directos, indirectos, incidentales o consecuentes que puedan surgir del uso de la plataforma.</li>
            <li>La calidad, precisión o disponibilidad del contenido creado por los usuarios.</li>
            <li>La responsabilidad de los usuarios al utilizar la plataforma. Eres responsable de cumplir con todas las leyes y regulaciones aplicables al utilizar nuestros servicios.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">6. Modificaciones</h2>
          <p className="text-lg text-gray-600">
            Nos reservamos el derecho a modificar o interrumpir Cardecks en cualquier momento. También podemos actualizar estos Términos de Uso, notificándote mediante un aviso en la plataforma o a través del correo electrónico.
          </p>
        </section>
        
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">7. Legislación Aplicable</h2>
          <p className="text-lg text-gray-600">
            Estos Términos de Uso se regirán por las leyes de España y la Unión Europea. Cualquier disputa que surja en relación con estos términos será sometida a la jurisdicción de los tribunales de Sevilla, España, salvo que la legislación aplicable exija lo contrario. Si utilizas Cardecks desde otra ubicación, eres responsable de cumplir con las leyes locales pertinentes.
          </p>
        </section>
        
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">8. Contacto</h2>
          <p className="text-lg text-gray-600">
            Si tienes preguntas o comentarios sobre estos Términos de Uso, puedes contactarnos en <a href="mailto:cardeck@gmail.es" className="text-blue-500 hover:underline">cardeck@gmail.es</a>.
          </p>
        </section>
      </div>
    </div>
  );
}