export type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type ContactFormStatus = 'idle' | 'sending' | 'success' | 'error';
