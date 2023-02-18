import * as ses from '@aws-sdk/client-ses';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import SESTransport from 'nodemailer/lib/ses-transport';
import * as env from '../../config/env';
import { TransportEngine } from '../types/types';

const {
  smtpServer,
  aws: { region },
} = env;
const { host, port, username, password } = smtpServer;

const deliverBySES = 'SES';

const transporterSMTP = {
  host,
  port: +port,
  auth: {
    user: username,
    pass: password,
  },
} as SMTPTransport.Options;

const sesClient = new ses.SES({ region });

const transporterSes = {
  SES: { ses: sesClient, aws: ses },
} as SESTransport.Options;

const getTransport = (engine: TransportEngine): SMTPTransport.Options  =>
  engine === deliverBySES ? transporterSes : transporterSMTP;

export default getTransport;
