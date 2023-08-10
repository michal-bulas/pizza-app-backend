import { config } from './config/config';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import Logging from './library/Logging';
import pizzaRoutes from './routes/Pizza';
import ingredientRoutes from './routes/Ingredient';
import actionRoutes from './routes/Action';

const router = express();

// Connect to MongoDB
mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority', dbName: `lignumhardPizza` })
  .then(() => {
    Logging.info('Connected to MongoDB');
    StartServer();
  })
  .catch((error) => {
    Logging.error('Connecting error: ');
    Logging.error(error);
  });

// Start server when Mongo Connects
const StartServer = () => {
  router.use((req, res, next) => {
    // Request Log
    Logging.info(`Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    // Response Log
    res.on('finish', () => {
      Logging.info(`Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
    });

    next();
  });

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  // Rules
  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
    }

    next();
  });

  // Routes
  router.use('/pizzas', pizzaRoutes);
  router.use('/ingredients', ingredientRoutes);
  router.use('/actions', actionRoutes);

  // Health Check
  router.get('/ping', (req, res, next) => {
    res.status(200).json({ message: 'pong' });
  });

  // Error Handler
  router.use((req, res, next) => {
    const error = new Error('Not Found');
    Logging.error(error);

    return res.status(404).json({ error: error.message });
  });

  http.createServer(router).listen(config.server.port, () => Logging.info(`Server listening on port ${config.server.port}`));
};
