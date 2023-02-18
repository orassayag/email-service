import express from 'express';
import 'express-async-errors';
import { createServer } from 'http';
import fs from 'fs';

const app = express();
const router = express.Router();

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
});

router.get('/health', (req, res) => {
  res.status(200).send('Ok');
});

router.get('/version', (req, res) => {
  fs.readFile('version.txt', 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    res.send(data);
  });
});

app.use('/api/v1', router);

const server = createServer(app);

export default server;
