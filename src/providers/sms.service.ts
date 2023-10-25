import { Injectable, Logger } from '@nestjs/common';
import { env } from '../config/env.config';

import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private twilioClient: Twilio;
  private logger = new Logger('SmsService');

  constructor() {
    this.twilioClient = new Twilio(
      env.twilio_account_sid,
      env.twilio_auth_token,
    );
  }

  async sendSms(to: string, message: string): Promise<void> {
    try {
      await this.twilioClient.messages.create({
        body: message,
        from: env.twilio_phone_number,
        to,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
