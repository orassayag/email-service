import { EmailApiSenderSendEmailResponse, IEmailApi } from '../types/types';
import { vi } from 'vitest';

export const mockSendEmailByEmailType = vi.fn();

export class MockEmailApi implements IEmailApi {
  sendEmailByEmailType(): Promise<EmailApiSenderSendEmailResponse> {
    return mockSendEmailByEmailType();
  }
}
