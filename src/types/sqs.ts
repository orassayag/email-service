import { EventAlertType } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v1/models/EventAlertType';

export type CreateEventParams = {
  title?: string;
  text?: string;
  alertType?: EventAlertType;
};
