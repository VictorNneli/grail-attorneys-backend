import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

interface NotifyParams {
  name: string;
  email: string;
  subject: string;
}

export const sendContactNotification = async ({ name, email, subject }: NotifyParams): Promise<void> => {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;

  if (!adminEmail) {
    console.warn('ADMIN_NOTIFY_EMAIL not set — skipping notification email');
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `New contact form submission: ${subject}`,
      text: `New message from ${name} (${email}).\n\nSubject: ${subject}\n\nCheck the admin panel to view the full message.`
    });
  } catch (error) {
    console.error('Failed to send notification email:', error);
  }
};