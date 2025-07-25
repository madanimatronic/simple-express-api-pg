import { env } from '@/config/env';
import nodemailer from 'nodemailer';

export class EmailService {
  private readonly transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: true,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  async sendVerificationEmail(to: string, emailVerificationUUID: string) {
    // TODO: Убрать хардкод /api/auth/verify-email/ (см. backlog)
    const emailVerificationLink = `${env.API_URL}/api/auth/verify-email/${emailVerificationUUID}`;

    await this.transporter.sendMail({
      from: `Test mailer ${env.SMTP_USER}`,
      to,
      subject: `Активация аккаунта в ${env.APP_NAME}`,
      html: `
      <div>
        <h1>Активация аккаунта по ссылке:</h1>
        <a href="${emailVerificationLink}">${emailVerificationLink}</a>
      </div>
      `,
    });
  }
}
