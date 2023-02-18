import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import logger from '../logging/loggingApp';

import {
  EmailApiSendEmailArgs,
  EmailApiSenderSendEmailResponse,
  EmailByEmailTypeArgs,
  IEmailApi,
  TransportEngine,
} from '../types/types';
import { prepareEmail } from './prepareEmail';
import getTransport from './getTransporter';

export default class NodemailerEmailApi implements IEmailApi {
  private transporter: Mail;

  constructor(engine: TransportEngine = 'SES') {
    this.transporter = nodemailer.createTransport(getTransport(engine));
  }

  async sendEmailByEmailType(
    args: EmailByEmailTypeArgs
  ): Promise<EmailApiSenderSendEmailResponse> {
    const preparedEmail = await prepareEmail(args);
    await this.sendEmail(preparedEmail);
    return {
      toEmail: preparedEmail.to,
      status: 'success',
    };
  }

  private async sendEmail(args: EmailApiSendEmailArgs): Promise<void> {
    const res = await this.transporter.sendMail(args);

    logger.info(res);
  }
}
