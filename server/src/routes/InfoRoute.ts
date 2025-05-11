import { Router, Request, Response } from 'express';
import ILogger from '../utils/Logger.interface';

/**
 * InfoRoute handles HTTP requests to provide metadata about the WeatherService API.
 * 
 * This class defines a route that returns information about the API, such as its name,
 * version, and description. It also logs incoming requests for monitoring purposes.
 */
export default class InfoRoute {
    
    /**
     * The endpoint for fetching info data.
     */
    private static readonly VERSION_ENDPOINT = '/version';

    /**
     * The Express router instance for defining routes.
     */
    private router: Router;

    /**
     * The logger instance for logging HTTP requests and errors.
     */
    private logger: ILogger;

    /**
     * Constructs a new InfoRoute instance.
     * 
     * @param logger - An instance of a logger for logging HTTP requests and errors.
     */
    constructor(logger: ILogger) {
        this.logger = logger;
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * Initializes the routes for the InfoRoute class.
     * 
     * Defines the root (`/version`) endpoint for providing API metadata.
     */
    private initializeRoutes() {
        this.router.get(InfoRoute.VERSION_ENDPOINT, this.getInfo.bind(this));
    }

    /**
     * Handles GET requests to the root (`/`) endpoint.
     * 
     * Logs the request details and responds with metadata about the WeatherService API.
     * 
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     */
    private getInfo(req: Request, res: Response) {
        try {
            this.logger.http(req.ip, 'GET', req.url, req.query);
            res.status(200).json({
            service: 'WeatherService API',
            version: '1.0.0',
            description: 'This API provides weather information based on coordinates.'
            });
        } catch (error) {
            this.logger.error('Error while processing request:', {
                error,
                ip: req.ip,
                url: req.url,
                query: req.query
            });
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Returns the Express router instance for this route.
     * 
     * @returns The router instance.
     */
    public getRouter(): Router {
        return this.router;
    }

}