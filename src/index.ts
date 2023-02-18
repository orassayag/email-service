import server from './app';
import logger from './logging/loggingApp';
import env from '../config/env';
import sqs from './sqs';
import DataDog from './logging/DataDog';

const { port = 5000 } = env.server;

DataDog.init();

sqs.start();

server.listen(port, async () => {
  logger.info(`Listening on port ${port}`);
});
