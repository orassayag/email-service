export type MessageFrom = {
  name: string;
  address: string;
};

export type EmailApiSendEmailArgs = {
  from: MessageFrom | string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

export type EmailApiSenderSendEmailResponse = {
  toEmail: string;
  status: 'success' | 'error';
};

export type User = {
  [key: string]: any;
  id: number;
  accountId: number | null;
  email: string;
  firstName: string;
  lastName: string;
};

export type Publisher = {
  id: number;
  name: string;
};

export type Video = {
  id: string;
  name: string;
  slidesCount: number;
};

export type Macros = {
  receiver: User;
  publisher?: Publisher | number;
  video?: Video;
  url?: string;
  accountId: number;
  email: string;
};

export type EmailByEmailTypeArgs = {
  templateType: string;
  macros: Macros;
};

export type TransportEngine = 'SMTP' | 'SES';

export interface IEmailApi {
  sendEmailByEmailType(
    args: EmailByEmailTypeArgs
  ): Promise<EmailApiSenderSendEmailResponse>;
}
