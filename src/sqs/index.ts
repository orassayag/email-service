import { Consumer } from 'sqs-consumer';
import EmailSender from '../utils/emailSender/EmailSender';
import env from '../../config/env';
import handleMessage from './handleMessage';

const {
  sqs: { emailServiceQueueUrl },
  aws: { region },
} = env as any;

const emailSender = EmailSender.getInstance();
emailSender.activate();

const sqs = Consumer.create({
  queueUrl: emailServiceQueueUrl,
  region,
  messageAttributeNames: ['type'],
  handleMessage,
});

export default sqs;
