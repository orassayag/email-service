import EmailSender from '../utils/emailSender/EmailSender';

beforeEach(async () => {
  EmailSender.resetEmailSenderInstance();
});
