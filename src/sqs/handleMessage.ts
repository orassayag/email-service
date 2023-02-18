import { Message } from '@aws-sdk/client-sqs';
import NodemailerEmailApi from '../utils/NodemailerEmailApi';
import logger from '../logging/loggingApp';
import EmailSender from '../utils/emailSender/EmailSender';
import { deleteFromSQS, keepInSQS } from './handleError';
import SQSError from './SQSError';

const emailSender = EmailSender.getInstance();
emailSender.activate();

const handleMessage = async (sqsMessage: Message): Promise<void> => {
  const { MessageAttributes, Body = '{}' } = sqsMessage;
  let macros;
  try {
    macros = JSON.parse(Body);
  } catch (e) {
    throw new SQSError({
      message: `handleMessage.handleMessage: Message Body could not be parsed: ${JSON.stringify(
        e
      )}`,
      shouldDeleteMessage: true,
    });
  }
  if (!MessageAttributes?.type?.StringValue) {
    throw new SQSError({
      message: 'handleMessage.handleMessage: No template types was sent',
      shouldDeleteMessage: true,
    });
  }
  try {
    emailSender.setEmailApi(new NodemailerEmailApi('SES'));
    await emailSender.sendEmailByEmailType({
      macros,
      templateType: MessageAttributes.type.StringValue,
    });
    logger.info(
      `SQS - message was handled successfully. Message details: ${
        sqsMessage ? JSON.stringify(sqsMessage) : 'no message'
      }`
    );
  } catch (err) {
    if (err instanceof SQSError && err.shouldDeleteMessage) {
      deleteFromSQS(sqsMessage, err.message);
    }
    keepInSQS(sqsMessage, JSON.stringify(err));
  }
};

export default handleMessage;
