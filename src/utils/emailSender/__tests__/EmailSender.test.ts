import EmailSender from '../EmailSender';
import {
  MockEmailApi,
  mockSendEmailByEmailType,
} from '../../../testUtils/mockEmailApi';
import { EmailByEmailTypeArgs } from '../../../types/types';

const messageObject = {
  templateName: 'TEST_TEMPLATE',
  macros: {
    receiver: {
      email: 'test@test.com',
    },
  },
};

it('should throw an error if the EmailSender is deactivated', async () => {
  const emailSender = EmailSender.getInstance();
  emailSender.deactivate();
  await expect(
    emailSender.sendEmailByEmailType(
      (messageObject as unknown) as EmailByEmailTypeArgs
    )
  ).rejects.toThrowError('EmailSender is not active');
});

it('should throw an error when sending an email if the EmailApi is not set', async () => {
  const emailSender = EmailSender.getInstance();
  emailSender.activate();
  await expect(
    emailSender.sendEmailByEmailType(
      (messageObject as unknown) as EmailByEmailTypeArgs
    )
  ).rejects.toThrowError('EmailApi is not set');
});

it('should send the email correctly if the EmailSender is active and the EmailApi is set', async () => {
  const emailSender = EmailSender.getInstance();
  const mockEmailApi = new MockEmailApi();

  emailSender.activate();
  emailSender.setEmailApi(mockEmailApi);

  await emailSender.sendEmailByEmailType(
    (messageObject as unknown) as EmailByEmailTypeArgs
  );
  expect(mockSendEmailByEmailType).toHaveBeenCalledTimes(1);
});
