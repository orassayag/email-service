import { Message } from '@aws-sdk/client-sqs';
import DataDog from '../logging/DataDog';
import { CreateEventParams } from '../types/sqs';

const createDDEventBody = (
  SQSMessage: Message,
  extraInfo?: string
): CreateEventParams => {
  const info: any = {
    SQSMessage: SQSMessage || 'no SQSMessage',
  };
  if (extraInfo) {
    info.extraInfo = extraInfo;
  }
  const stringInfo = JSON.stringify(info);

  return {
    title: 'Email was not sent',
    text: stringInfo,
    alertType: 'error',
  };
};

// Will log the error to DataDog and return nothing, thus, the message will be removed from SQS
const deleteFromSQS = (SQSMessage: Message, extraInfo?: string): void =>
  DataDog.createEvent(createDDEventBody(SQSMessage, extraInfo));

// Will log the error to DataDog and throw the Error, thus, the message will be kept in SQS
const keepInSQS = (SQSMessage: Message, extraInfo?: string): void => {
  const DDEventBody = createDDEventBody(SQSMessage, extraInfo);
  DataDog.createEvent(DDEventBody);

  throw new Error(JSON.stringify(DDEventBody));
};

export { deleteFromSQS, keepInSQS };
