import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Middleware to validate the API key in the request headers.
 * 
 * In development mode, this middleware bypasses API key validation.
 * In production mode, it validates the API key against the environment variable `WEATHER_SERVICE_API_KEY`.
 */
export const apiKeyValidator: RequestHandler = (req: Request, res: Response, next: NextFunction) =>  {
    if (process.env.NODE_ENV === 'development') {
        // If in development mode, skip API key validation
        return next();
    }

    // Get the API key from the request headers or query parameters
    const apiKey = req.headers['x-api-key'] || req.query.apikey;

    if (!apiKey) {
        // If the API key is missing, respond with a 401 Unauthorized status
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    if (apiKey !== process.env.WEATHER_SERVICE_API_KEY) {
        // If the API key is invalid, respond with a 403 Forbidden status
        res.status(403).json({ error: 'Forbidden' });
        return;
    }

    // If the API key is valid, proceed to the next middleware or route handler
    return next();
};