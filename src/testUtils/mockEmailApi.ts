import { EmailApiSenderSendEmailResponse, IEmailApi } from '../types/types';

export const mockSendEmailByEmailType = jest.fn();

export class MockEmailApi implements IEmailApi {
  sendEmailByEmailType(): Promise<EmailApiSenderSendEmailResponse> {
    return mockSendEmailByEmailType();
  }
}
