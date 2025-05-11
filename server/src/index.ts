import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import InfoRoute from './routes/InfoRoute';
import WeatherRoute from './routes/WeatherRoute';
import OpenWeatherService from './services/OpenWeatherService';
import OpenWeatherMapper from './mappers/OpenWeatherMapper';
import ILogger from './utils/Logger.interface';
import { WinstonLogger } from './utils/WinstonLogger';

/**
 * Entry point for the WeatherService application.
 * 
 * This file initializes the Express application, sets up routes, and starts the server.
 * It also configures the OpenWeatherService for fetching weather data and logs application events.
 */

// Create a logger instance using WinstonLogger
const logger: ILogger = new WinstonLogger();

// Load environment variables from .env file
dotenv.config();

// Create an Express application instance
const app = express();

// The port on which the server will listen for incoming requests
const PORT = process.env.PORT;

// If the port is not set, log an error
if (!PORT) {
    logger.error('Port is not set. Please check your .env file.');
    process.exit(1);
} else {
    logger.info(`Server will run on port ${PORT}`);
}

// Setup WeatherService for OpenWeatherService API
const apiKey = process.env.OPENWEATHER_API_KEY;
const baseUrl = process.env.OPENWEATHER_BASE_URL;

// If the API key or base URL is not set, log an error
if (!apiKey || !baseUrl) {
    logger.error('API key or base URL is not set. Please check your .env file.');
    process.exit(1);
} else {
    logger.info('API key and base URL are set.');
}

// Create an instance of an IWeatherService
const weatherMapper = new OpenWeatherMapper(logger);
const weatherService = new OpenWeatherService(logger, apiKey, baseUrl, axios, weatherMapper);

// Create instances of Routes
const infoRoute = new InfoRoute(logger);
const weatherRoute = new WeatherRoute(logger, weatherService);

// Use Routes
app.use('/api/v1/info', infoRoute.getRouter());
app.use('/api/v1/weather', weatherRoute.getRouter());

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});