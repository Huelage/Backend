import { Injectable, Logger } from '@nestjs/common';
import { SendMailOptions, Transporter, createTransport } from 'nodemailer';
import { genEmailMessage } from 'src/common/helpers/helpers';

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
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
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
      from: process.env.EMAIL,
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
