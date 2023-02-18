// Singleton pattern
import {
  EmailApiSenderSendEmailResponse,
  EmailByEmailTypeArgs,
  IEmailApi,
} from '../../types/types';

export default class EmailSender implements IEmailApi {
  private isActive = false;

  private emailApi: IEmailApi | undefined;

  private static emailSenderInstance: EmailSender;

  private constructor() {
    // no-op
  }

  activate(): void {
    this.isActive = true;
  }

  static getInstance(): EmailSender {
    if (!this.emailSenderInstance) {
      this.emailSenderInstance = new EmailSender();
    }
    return this.emailSenderInstance;
  }

  static resetEmailSenderInstance(): void {
    this.emailSenderInstance = new EmailSender();
  }

  deactivate(): void {
    this.isActive = false;
  }

  setEmailApi(emailApi: IEmailApi): void {
    this.emailApi = emailApi;
  }

  async sendEmailByEmailType(
    args: EmailByEmailTypeArgs
  ): Promise<EmailApiSenderSendEmailResponse> {
    this.validateEmailSender();
    return this.emailApi!.sendEmailByEmailType(args);
  }

  private validateEmailSender(): void {
    if (!this.isActive) {
      throw new Error('EmailSender is not active');
    }

    if (!this.emailApi) {
      throw new Error('EmailApi is not set');
    }
  }
}
