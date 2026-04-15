import React, { useState } from 'react';
import type { ContactFormData, ContactFormStatus } from '../types/contact';
import './ContactForm.css';

interface ContactFormProps {
  onClose?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<ContactFormStatus>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Simular envío del formulario (aquí irá la integración con un servicio real)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // En producción, aquí enviarías los datos a un servidor
      console.log('Form submitted:', formData);

      setStatus('success');
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        setStatus('idle');
      }, 3000);
    } catch {
      // Error silently
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="contact-form-container">
      <div className="contact-form-card">
        <div className="form-header">
          <div className="form-icon">✨</div>
          <h1>¡Felicitaciones, Maestro Pokémon!</h1>
          <p className="form-subtitle">
            Desbloqueaste el formulario de contacto
          </p>
        </div>

        {status === 'success' ? (
          <div className="success-message">
            <div className="success-icon">🎉</div>
            <h2>¡Mensaje enviado!</h2>
            <p>Me pondré en contacto contigo pronto.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Nombre *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={status === 'sending'}
                placeholder="Tu nombre completo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={status === 'sending'}
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Teléfono *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={status === 'sending'}
                placeholder="Tu número de teléfono"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Asunto *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                disabled={status === 'sending'}
                placeholder="Asunto de tu mensaje"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Mensaje *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={status === 'sending'}
                placeholder="Tu mensaje aquí..."
                rows={5}
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? '📤 Enviando...' : '📤 Enviar Mensaje'}
              </button>
              {onClose && (
                <button type="button" className="close-button" onClick={onClose}>
                  ❌ Cerrar
                </button>
              )}
            </div>
          </form>
        )}

        {status === 'error' && (
          <div className="error-message">
            <p>Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.</p>
          </div>
        )}
      </div>
    </div>
  );
};
