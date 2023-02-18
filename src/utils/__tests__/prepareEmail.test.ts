import sinon from 'sinon';
import { prepareEmail } from '../prepareEmail';
import { EmailByEmailTypeArgs } from '../../types/types';
import { MESSAGE_FROM } from '../../constants';
import Model from '../../Model';

const wrongTemplate = 'NON_EXIST_TEMPLATE';
const properTemplate = 'EXIST_TEMPLATE';
const template = {
  subject: 'test-subject',
  bodyTxt: 'test-bodyTxt',
  bodyHtml: 'test-bodyHtml',
};
const stubbedResponseObj = {
  sender: JSON.stringify(MESSAGE_FROM),
  templateObj: JSON.stringify(template),
};
const properArgsForPrep: EmailByEmailTypeArgs = {
  templateType: properTemplate,
  macros: {
    accountId: 1,
    email: 'orassayag@orassayag.com',
    receiver: {
      id: 1,
      accountId: null,
      email: 'test@test.com',
      firstName: 'testFirstName',
      lastName: 'testLastName',
    },
  },
};

const dbStub = sinon.stub(Model, 'findEmailTemplateByType');
dbStub.withArgs({ templateType: wrongTemplate }).resolves(null);
dbStub
  .withArgs({ templateType: properTemplate, accountId: null })
  .resolves(stubbedResponseObj);

describe('Prepare email tests', () => {
  it('should return error if no Template was found for email type', async () => {
    await expect(
      prepareEmail({
        ...properArgsForPrep,
        templateType: wrongTemplate,
      })
    ).rejects.toThrowError(
      'prepareEmailService.prepareEmail, no template of type NON_EXIST_TEMPLATE'
    );
  });

  it('should trigger an email sending when all the requirements met', async () => {
    const result = await prepareEmail(
      (properArgsForPrep as unknown) as EmailByEmailTypeArgs
    );
    expect(result).toStrictEqual({
      from: MESSAGE_FROM,
      to: properArgsForPrep.macros.receiver.email,
      subject: template.subject,
      text: template.bodyTxt,
      html: template.bodyHtml,
    });
  });
});
