import HandleBars from 'handlebars';
import { EmailApiSendEmailArgs, EmailByEmailTypeArgs } from '../types/types';
import logger from '../logging/loggingApp';
import { MESSAGE_FROM } from '../constants';
import env from '../../config/env';
import SQSError from '../sqs/SQSError';
import Model from '../Model';

const copyrightYear = new Date().getFullYear();
const {
  pcnUI: { url: pcnUI },
} = env;

const prepareEmail = async ({
  templateType,
  macros,
}: EmailByEmailTypeArgs): Promise<EmailApiSendEmailArgs> => {
  logger.info(
    `prepareEmailService.prepareEmail, template type ${templateType}`
  );

  const { accountId, email, video, url } = macros;

  const emailTemplate = await Model.findEmailTemplateByType({
    templateType,
    accountId,
  })

  const { sender, templateObj } = emailTemplate || {};

  if (!templateObj) {
    throw new SQSError({
      message: `prepareEmailService.prepareEmail, no template of type ${templateType}`,
      shouldDeleteMessage: true,
    });
  }

  const from = sender ? JSON.parse(sender) : MESSAGE_FROM;

  const { subject, bodyTxt, bodyHtml } = JSON.parse(templateObj);

  const to = email;

  const templateSubject = HandleBars.compile(subject);
  const templateTxt = HandleBars.compile(bodyTxt);
  const templateHtml = HandleBars.compile(bodyHtml);

  const data = {
    video,
    url,
    copyrightYear,
    host: pcnUI,
  };

  return {
    from,
    to,
    subject: templateSubject(data),
    text: templateTxt(data),
    html: templateHtml(data),
  };
};

export { prepareEmail };
