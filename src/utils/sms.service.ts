import { Injectable, Logger } from '@nestjs/common';

import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private twilioClient: Twilio;
  private logger = new Logger('SmsService');

  constructor() {
    this.twilioClient = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async sendSms(to: string, message: string): Promise<void> {
    try {
      await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
        to,
      });
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
