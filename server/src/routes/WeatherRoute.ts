import { Router, Request, Response } from 'express';
import { CoordinatesQuery } from '../types/CoordinatesQuery';
import IWeatherService from '../services/WeatherService.interface';
import ILogger from '../utils/Logger.interface';

/**
 * WeatherRoute handles HTTP requests related to weather data.
 * 
 * This class defines the routes for fetching weather data based on geographic coordinates
 * and validates the input before passing it to the weather service.
 */
export default class WeatherRoute {
    
    /**
     * The endpoint for fetching weather data by geographic coordinates.
     */
    private static readonly COORDINATES_ENDPOINT = '/coordinates';

    /**
     * Error messages used for input validation and error responses.
     */
    private static readonly ERRORS = {
        MISSING_COORDINATES: 'Latitude and Longitude are required',
        INVALID_LATITUDE: 'Latitude must be between -90 and 90',
        INVALID_LONGITUDE: 'Longitude must be between -180 and 180',
        INVALID_COORDINATES: 'Invalid coordinates provided',
        INVALID_COORDINATES_TYPE: 'Coordinates must be numbers',
        FETCH_FAILED: 'Failed to fetch weather data',  
    };

    /**
     * The logger instance for logging HTTP requests and errors.
     */
    private logger: ILogger;

    /**
     * Express router instance for defining routes.
     */
    private router: Router;

    /**
     * The weather service instance for fetching weather data.
     */
    private weatherService: IWeatherService;

    /**
     * Constructor for the WeatherRoute class.
     * 
     * @param logger - An instance of a logger for logging HTTP requests and errors.
     * @param weatherService - An instance of a weather service for fetching weather data.
     */
    constructor(logger: ILogger, weatherService: IWeatherService) {
        this.logger = logger;
        this.weatherService = weatherService;
        this.router = Router();
        
        this.initializeRoutes();
    }

    /**
     * Initializes the routes for the WeatherRoute class.
     * 
     * Defines the `/coordinates` endpoint for fetching weather data by geographic coordinates.
     */
    private initializeRoutes() {
        this.router.get(WeatherRoute.COORDINATES_ENDPOINT, this.getWeatherByCoordinates.bind(this));
    }

    /**
     * Handles GET requests to the `/coordinates` endpoint.
     * 
     * Logs the request details, validates the input coordinates, and fetches weather data
     * using the weather service. Responds with the weather data or an error message.
     * 
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     */
    private async getWeatherByCoordinates(req: Request, res: Response) {
        // Log the incoming request
        this.logger.http(req.ip, 'GET', req.url, req.query);

        const { lat, lon } = req.query as unknown as CoordinatesQuery;

        // Validate the presence of latitude and longitude
        if (!lat || !lon) {
            res.status(400).json({ error: WeatherRoute.ERRORS.MISSING_COORDINATES });
            return;
        }

        // Validate coordinates
        const coordinateValidationResult = this.areCoordinatesValid(lat, lon);

        if (!coordinateValidationResult.areValid) {
            this.logger.error(coordinateValidationResult.errorMessage || 'Unknown validation error');
            res.status(400).json({ error: coordinateValidationResult.errorMessage });
            return;
        }

        // Get the validated latitude and longitude
        const { latitude, longitude } = coordinateValidationResult;

        try {
            // Fetch weather data from the weather service using the validated coordinates
            if (latitude !== undefined && longitude !== undefined) {
                const weatherData = await this.weatherService.getWeatherByCoordinates(latitude, longitude);
                res.status(200).json(weatherData);
            } else {
                res.status(400).json({ error: WeatherRoute.ERRORS.INVALID_COORDINATES });
            }
        } catch (error) {
            // Log the error and respond with a 500 status code
            this.logger.error(WeatherRoute.ERRORS.FETCH_FAILED, error, latitude, longitude);
            res.status(500).json({ error: WeatherRoute.ERRORS.FETCH_FAILED });
        }
    }

    /**
     * Returns the Express router instance for this route.
     * 
     * @returns The router instance.
     */
    public getRouter() {
        return this.router;
    }

    /**
     * Validates and parses latitude and longitude values.
     * 
     * Ensures that the provided latitude and longitude are valid numbers
     * and fall within the acceptable geographic ranges.
     * 
     * @param lat - The latitude value as a string.
     * @param lon - The longitude value as a string.
     * @returns An object containing:
     *   - `areValid`: A boolean indicating whether the coordinates are valid.
     *   - `latitude`: The parsed latitude as a number (if valid).
     *   - `longitude`: The parsed longitude as a number (if valid).
     *   - `errorMessage`: A string describing the validation error (if invalid).
     * 
     * @example
     * // Valid coordinates
     * const result = areCoordinatesValid("40.7128", "-74.0060");
     * console.log(result); // { areValid: true, latitude: 40.7128, longitude: -74.0060 }
     * 
     * @example
     * // Invalid latitude
     * const result = areCoordinatesValid("100", "-74.0060");
     * console.log(result); // { areValid: false, errorMessage: "Latitude must be between -90 and 90" }
     * 
     * @example
     * // Invalid longitude
     * const result = areCoordinatesValid("40.7128", "-200");
     * console.log(result); // { areValid: false, errorMessage: "Longitude must be between -180 and 180" }
     */
    private areCoordinatesValid(lat: string, lon: string): {areValid: boolean, latitude?: number, longitude?: number, errorMessage?: string} {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        if (isNaN(latitude) || isNaN(longitude)) {
            return { areValid: false, errorMessage: WeatherRoute.ERRORS.INVALID_COORDINATES_TYPE };
        }

        if (latitude < -90 || latitude > 90) {
            return { areValid: false, errorMessage: WeatherRoute.ERRORS.INVALID_LATITUDE};
        }

        if (longitude < -180 || longitude > 180) {
            return { areValid: false, errorMessage: WeatherRoute.ERRORS.INVALID_LONGITUDE };
        }

        return { areValid: true, latitude, longitude };
    }
}