import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // Configure the SMTP settings for your email provider
      // For example, for Gmail:
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });
  }

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: 'your-email@gmail.com',
      to,
      subject,
      text: content,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
