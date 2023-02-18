import { client, v1 } from '@datadog/datadog-api-client';
import { EventCreateRequest } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v1/models/EventCreateRequest';
import env from '../../config/env';
import logger from './loggingApp';
import { CreateEventParams } from '../types/sqs';

class DataDogService {
  private apiInstance: v1.EventsApi | null;

  private params: v1.EventsApiCreateEventRequest | null;

  constructor() {
    this.apiInstance = null;
    this.params = null;
  }

  /**
   * Initiate the DataDog service.
   *
   * This function initiates the DataDog service (Initiate the
   * @datadog/datadog-api-client package's settings).
   *
   * @returns {<void>}
   */
  init() {
    const configuration = client.createConfiguration({
      authMethods: {
        apiKeyAuth: env.datadog.apiKey,
      },
    });
    this.apiInstance = new v1.EventsApi(configuration);
    this.params = {
      body: {
        title: '',
        text: '',
        tags: [`env:${env.server.env}`, 'email-service'],
      },
    };
  }

  /**
   * Create an event.
   *
   * This function gets a body, with a text, and alert type and creates an event in DataDog via
   * the @datadog/datadog-api-client package. It also logs the response from the DataDog API
   * in the S3 log file.
   *
   * @param body - The body is the event's body.
   * @returns {<void>}
   */
  createEvent(body: CreateEventParams | undefined = {}) {
    const params = { ...this.params };
    params.body = { ...params.body, ...(body as EventCreateRequest) };
    if (this.apiInstance && this.params)
      this.apiInstance
        .createEvent(params as v1.EventsApiCreateEventRequest)
        .then((dd) => {
          logger.info(
            `DataDog API called successfully. Returned data: ${JSON.stringify(
              dd
            )}`
          );
        })
        .catch((error) => logger.error(error));
  }
}

export default new DataDogService();
