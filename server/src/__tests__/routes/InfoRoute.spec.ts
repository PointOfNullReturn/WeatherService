import { Request, Response } from 'express';
import InfoRoute from '../../routes/InfoRoute';
import ILogger from '../../utils/Logger.interface';

describe('InfoRoute', () => {
    let mockLogger: ILogger;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let infoRoute: InfoRoute;

    beforeEach(() => {
        // Mock the logger
        mockLogger = {
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            http: jest.fn(),
        };

        // Mock the request and response objects
        mockRequest = {
            ip: '127.0.0.1',
            url: '/version',
            query: {},
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Create an instance of InfoRoute
        infoRoute = new InfoRoute(mockLogger);
    });

    describe('getInfo', () => {
        it('should return API metadata with a 200 status code', () => {
            // Act
            const getInfoHandler = infoRoute['getInfo'].bind(infoRoute);
            getInfoHandler(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                service: 'WeatherService API',
                version: '1.0.0',
                description: 'This API provides weather information based on coordinates.',
            });
        });

        it('should log the HTTP request details', () => {
            // Act
            const getInfoHandler = infoRoute['getInfo'].bind(infoRoute);
            getInfoHandler(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockLogger.http).toHaveBeenCalledWith(
                '127.0.0.1',
                'GET',
                '/version',
                {}
            );
        });

        it('should handle unexpected errors gracefully', () => {
            // Arrange
            mockLogger.http = jest.fn(() => {
                throw new Error('Unexpected error');
            });

            // Act
            const getInfoHandler = infoRoute['getInfo'].bind(infoRoute);
            getInfoHandler(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockLogger.error).toHaveBeenCalledWith('Error while processing request:', {
                error: expect.any(Error),
                ip: '127.0.0.1',
                url: '/version',
                query: {},
            });
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        });

        it('should handle missing IP address gracefully', () => {
            // Arrange
            (mockRequest as any).ip = undefined;

            // Act
            const getInfoHandler = infoRoute['getInfo'].bind(infoRoute);
            getInfoHandler(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockLogger.http).toHaveBeenCalledWith(
                undefined,
                'GET',
                '/version',
                {}
            );
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('should handle unexpected query parameters gracefully', () => {
            // Arrange
            mockRequest.query = { unexpected: 'value' };

            // Act
            const getInfoHandler = infoRoute['getInfo'].bind(infoRoute);
            getInfoHandler(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockLogger.http).toHaveBeenCalledWith(
                '127.0.0.1',
                'GET',
                '/version',
                { unexpected: 'value' }
            );
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });
    });

    describe('getRouter', () => {
        it('should return an Express router instance', () => {
            // Act
            const router = infoRoute.getRouter();

            // Assert
            expect(router).toBeDefined();
            expect(typeof router.use).toBe('function'); // Check if it's an Express router
        });
    });
});