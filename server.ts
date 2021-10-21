import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import logging from './config/logging';
import config from './config/config';
import categoryRoutes from './routes/сategory';
import cardRoutes from './routes/cards';
import userRoutes from './routes/user';
import * as swaggerDocument from './swagger.json';

const NAMESPACE = 'SERVER';
const router = express();

mongoose
  .connect(config.mongo.url, config.mongo.options)
  .then((result) => {
    logging.info(NAMESPACE, 'Connected to mongoDB!');
  })
  .catch((error) => {
    logging.error(NAMESPACE, error.message, error);
  });

router.use((req, res, next) => {
  logging.info(NAMESPACE, `METHOD=[${req.method}], URL - [${req.url}], IP=[${req.socket.remoteAddress}`);
  res.on('finish', () => {
    logging.info(
      NAMESPACE,
      `METHOD - [${req.method}], URL -[${req.url}], IP=[${req.socket.remoteAddress}],
    STATUS=[${res.statusCode}]`,
    );
  });
  return next();
});

router.use(bodyParser.json({ limit: '50mb' }));
router.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
router.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use(cookieParser('secret key'));
router.use(cors());
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }
  next();
});
router.use('/api/categories/', categoryRoutes);
router.use('/api/cards/', cardRoutes);
router.use('/api/user/', userRoutes);

router.use((req, res, next) => {
  const error = new Error('not found');
  return res.status(404).json({
    message: error.message,
  });
});

const httpServer = http.createServer(router);

httpServer.listen(config.server.port, () => {
  logging.info(NAMESPACE, 'Server is running');
});
