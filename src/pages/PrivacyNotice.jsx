import React from 'react';

export default function PrivacyNotice() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Aviso de Privacidad y Protección de Datos</h1>
      <p className="text-sm text-gray-500 mb-12 text-center">Última actualización: {new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear()}</p>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">1. Introducción</h2>
          <p className="text-lg text-gray-600">
            En Cardeck, respetamos la privacidad de nuestros usuarios y estamos comprometidos a proteger sus datos personales. Este Aviso de Privacidad explica cómo recopilamos, utilizamos, compartimos y protegemos la información personal que proporcionas al usar nuestra plataforma.
          </p>
        </section>
        
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">2. Responsable del tratamiento de datos</h2>
          <p className="text-lg text-gray-600">
            La entidad responsable del tratamiento de los datos personales recopilados a través de la plataforma es Cardeck. Para cualquier duda o solicitud sobre la protección de tus datos personales, puedes contactarnos a través del correo electrónico: <a href="mailto:cardeck@gmail.es" className="text-blue-500 hover:underline">cardeck@gmail.es</a>.
          </p>
        </section>
        
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">3. Datos personales que recopilamos</h2>
          <p className="text-lg text-gray-600 mb-4">Recopilamos los siguientes tipos de datos personales para poder proporcionarte nuestros servicios:</p>
          <ul className="list-disc list-inside text-lg text-gray-600 space-y-2">
            <li>Datos de registro: Nombre, dirección de correo electrónico, nombre de usuario y contraseña.</li>
            <li>Información de pago: Si decides adquirir algún servicio de pago, recopilaremos la información necesaria para procesar el pago (por ejemplo, tarjeta de crédito, dirección de facturación).</li>
            <li>Datos de uso: Información sobre cómo interactúas con la plataforma, como las cartas que creas, los mazos que organizas, tus preferencias de juego y el historial de interacciones con otros usuarios.</li>
            <li>Datos técnicos: Dirección IP, tipo de dispositivo, sistema operativo y otra información relacionada con tu uso de la plataforma.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">4. Finalidad del tratamiento de los datos</h2>
          <p className="text-lg text-gray-600 mb-4">Tus datos personales serán tratados para los siguientes fines:</p>
          <ul className="list-disc list-inside text-lg text-gray-600 space-y-2">
            <li>Proporcionar los servicios de la plataforma, incluyendo la creación y organización de cartas y mazos.</li>
            <li>Gestionar tu cuenta y ofrecer asistencia técnica.</li>
            <li>Procesar pagos y gestionar transacciones.</li>
            <li>Mejorar y personalizar tu experiencia en la plataforma.</li>
            <li>Cumplir con nuestras obligaciones legales y contractuales.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">5. Compartición de datos</h2>
          <p className="text-lg text-gray-600">
            No compartimos tus datos personales con terceros, salvo en los siguientes casos:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-600 space-y-2">
            <li>Proveedores de servicios: Compartimos tu información con proveedores de servicios que nos ayudan a operar la plataforma (por ejemplo, servicios de hosting, procesamiento de pagos).</li>
            <li>Obligaciones legales: Podemos compartir tus datos si estamos obligados por ley a hacerlo.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">6. Derechos del usuario</h2>
          <p className="text-lg text-gray-600 mb-4">De acuerdo con la legislación aplicable, tienes derecho a:</p>
          <ul className="list-disc list-inside text-lg text-gray-600 space-y-2">
            <li>Acceder a tus datos personales.</li>
            <li>Rectificar cualquier dato incorrecto o incompleto.</li>
            <li>Solicitar la eliminación de tus datos.</li>
            <li>Limitar el tratamiento de tus datos o oponerte al mismo.</li>
          </ul>
          <p className="text-lg text-gray-600">
            Puedes ejercer tus derechos enviándonos un correo electrónico a <a href="mailto:cardeck@gmail.es" className="text-blue-500 hover:underline">cardeck@gmail.es</a>.
          </p>
        </section>
        
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">7. Seguridad de los datos</h2>
          <p className="text-lg text-gray-600">
            Nos tomamos muy en serio la seguridad de tus datos personales y utilizamos medidas adecuadas para protegerlos contra el acceso no autorizado, pérdida o uso indebido. No obstante, ningún sistema de transmisión de datos o almacenamiento es completamente seguro, por lo que no podemos garantizar la seguridad absoluta de la información.
          </p>
        </section>
        
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">8. Uso de cookies y tecnologías similares</h2>
          <p className="text-lg text-gray-600">
            Utilizamos cookies y tecnologías similares para mejorar tu experiencia en la plataforma, analizar el uso de nuestros servicios y personalizar el contenido. Puedes ajustar la configuración de tu navegador para rechazar las cookies, aunque esto puede afectar tu experiencia de uso.
          </p>
        </section>
        
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">9. Cambios en el aviso de privacidad</h2>
          <p className="text-lg text-gray-600">
            Nos reservamos el derecho a modificar este Aviso de Privacidad en cualquier momento. Te notificaremos cualquier cambio significativo mediante un aviso en la plataforma o por otros medios. Te recomendamos revisar este documento periódicamente.
          </p>
        </section>
        
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">10. Contacto</h2>
          <p className="text-lg text-gray-600">
            Si tienes alguna pregunta sobre este Aviso de Privacidad o sobre el tratamiento de tus datos personales, no dudes en contactarnos a través de <a href="mailto:cardeck@gmail.es" className="text-blue-500 hover:underline">cardeck@gmail.es</a>.
          </p>
        </section>
      </div>
    </div>
  );
}