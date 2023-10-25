import { Injectable, Logger } from '@nestjs/common';
import { SendMailOptions, Transporter, createTransport } from 'nodemailer';
import { genEmailMessage } from '../common/helpers/helpers';
import { env } from '../config/env.config';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private logger = new Logger('EmailService');

  constructor() {
    this.transporter = createTransport({
      // Configure the SMTP settings for your email provider
      // For example, for Gmail:
      service: 'gmail',
      auth: {
        user: env.email,
        pass: env.email_password,
      },
    });
  }

  async sendOtpToEmail(input: {
    to: string;
    otp: number;
    name: string;
  }): Promise<void> {
    const { to, otp, name } = input;
    const mailOptions: SendMailOptions = {
      from: env.email,
      to,
      subject: 'HUELAGE OTP VERIFICATION',
      html: genEmailMessage({ name, otp }),
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
