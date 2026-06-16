import { beforeEach } from 'vitest';
import EmailSender from '../utils/emailSender/EmailSender';

beforeEach(async () => {
  EmailSender.resetEmailSenderInstance();
});
