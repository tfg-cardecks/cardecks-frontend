import React from 'react';

export default function TermsOfUse() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Términos de Uso de Cardecks</h1>
      <p className="text-sm text-gray-500 mb-12 text-center">Última actualización: {new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear()}</p>

      <div className="space-y-12">
        <section>
          <p className="text-lg text-gray-600">
            ¡Bienvenido a <strong>Cardecks</strong>! Te invitamos a leer estos términos detenidamente antes de acceder o usar nuestra plataforma. Si tienes alguna pregunta o inquietud, estamos aquí para ayudarte.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">1. Aceptación de los Términos</h2>
          <p className="text-lg text-gray-600">
            Al registrarte en Cardecks, reconoces que has tenido la oportunidad de leer, entender y aceptar estos Términos de Uso y nuestra Política de Privacidad. Por favor, revisa estos términos antes de continuar. Si no los aceptas, puedes contactarnos con cualquier duda antes de utilizar nuestros servicios.
          </p>
        </section>
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">2. Modificación de los Términos</h2>
          <p className="text-lg text-gray-600">
            Ocasionalmente, podremos actualizar estos Términos de Uso para reflejar cambios en el servicio, requisitos de cumplimiento o mejoras. Cardecks proporcionará un aviso claro de los cambios importantes a través de la plataforma y, cuando sea posible, por correo electrónico. En los casos en que los cambios afecten tus derechos u obligaciones, describiremos las modificaciones y solicitaremos tu consentimiento explícito para continuar usando la plataforma. Si prefieres no aceptar las actualizaciones, puedes dejar de usar nuestros servicios en cualquier momento. Te recomendamos revisar estos términos periódicamente para estar informado.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">3. Uso de la Plataforma</h2>
          <ul className="list-disc list-inside text-lg text-gray-600 space-y-2">
            <li><strong>Edad:</strong> Debes tener al menos 13 años para utilizar Cardecks. Los usuarios menores de 13 años necesitan el consentimiento de un padre o tutor.</li>
            <li><strong>Registro:</strong> Aceptas proporcionar información precisa y actualizada durante el registro y eres responsable de mantener la confidencialidad de tu cuenta y contraseña.</li>
            <li><strong>Uso Aceptable:</strong> Tu uso de Cardecks debe cumplir con todas las leyes y regulaciones aplicables y no debe:
              <ul className="list-disc list-inside ml-4">
                <li>Infringir derechos de propiedad intelectual.</li>
                <li>Transmitir contenido dañino, abusivo, ofensivo o ilegal.</li>
              </ul>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">4. Propiedad Intelectual</h2>
          <p className="text-lg text-gray-600">
            Todo el contenido y los derechos de propiedad intelectual asociados con Cardecks son propiedad de Cardecks o sus licenciantes. La reproducción, distribución, modificación o creación de obras derivadas requiere autorización previa.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">5. Contenido de Usuario</h2>
          <ul className="list-disc list-inside text-lg text-gray-600 space-y-2">
            <li><strong>Responsabilidad:</strong> Eres responsable del contenido que creas y compartes en Cardecks. Al hacerlo, afirmas que posees los derechos sobre dicho contenido y que no infringe derechos de terceros.</li>
            <li><strong>Licencia:</strong> Al cargar contenido, otorgas a Cardecks una licencia no exclusiva, mundial y gratuita para usar, reproducir y distribuir este contenido en nuestra plataforma. Conservas la propiedad de tu contenido y puedes seguir usándolo en otras plataformas.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">6. Limitación de Responsabilidad</h2>
          <p className="text-lg text-gray-600">
            Aunque nos esforzamos por ofrecer una plataforma segura y confiable, ten en cuenta lo siguiente:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-600 space-y-2">
            <li><strong>Disponibilidad de la Plataforma:</strong> Cardecks no puede garantizar la disponibilidad ininterrumpida del servicio ni la precisión del contenido en todo momento.</li>
            <li><strong>Contenido y Servicios de Terceros:</strong> Cardecks no es responsable por el contenido, los servicios o los fallos técnicos de terceros que estén fuera de nuestro control.</li>
            <li><strong>Responsabilidad del Usuario:</strong> Los usuarios deben cumplir con las obligaciones legales pertinentes. Esta limitación de responsabilidad se aplica en la máxima medida permitida por la ley.</li>

          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">7. Ley Aplicable</h2>
          <p className="text-lg text-gray-600">
            Estos Términos de Uso se rigen e interpretan de acuerdo con las leyes aplicables en tu país de residencia, garantizando que tus derechos estén protegidos bajo la legislación local.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">8. Jurisdicción</h2>
          <p className="text-lg text-gray-600">
            En caso de disputas legales que no puedan resolverse de manera informal, las disputas podrán remitirse a los tribunales competentes de Sevilla, España, o según lo estipulen las normativas locales de tu país de residencia.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">9. Contacto</h2>
          <p className="text-lg text-gray-600">
            Si tienes preguntas o comentarios sobre estos Términos de Uso, no dudes en contactarnos en <a href="mailto:cardeckstfg@gmail.es" className="text-blue-500 hover:underline">cardeckstfg@gmail.es</a>.
          </p>
        </section>
      </div>
    </div>
  );
}