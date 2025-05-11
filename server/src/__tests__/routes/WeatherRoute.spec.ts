import { Request, Response } from 'express';
import WeatherRoute from '../../routes/WeatherRoute';
import IWeatherService from '../../services/WeatherService.interface';
import ILogger from '../../utils/Logger.interface';

describe('WeatherRoute', () => {
    let mockLogger: ILogger;
    let mockWeatherService: IWeatherService;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let weatherRoute: WeatherRoute;

    beforeEach(() => {
        // Mock the logger
        mockLogger = {
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            http: jest.fn(),
        };

        // Mock the weather service
        mockWeatherService = {
            getWeatherByCoordinates: jest.fn(),
        };

        // Mock the request and response objects
        mockRequest = {
            ip: '127.0.0.1',
            query: {},
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Create an instance of WeatherRoute
        weatherRoute = new WeatherRoute(mockLogger, mockWeatherService);
    });

    describe('getWeatherByCoordinates', () => {
        it('should return 400 if latitude or longitude is missing', async () => {
            // Arrange
            mockRequest.query = { lat: '40.7128' }; // Missing longitude

            // Act
            const handler = weatherRoute['getWeatherByCoordinates'].bind(weatherRoute);
            await handler(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: WeatherRoute['ERRORS'].MISSING_COORDINATES,
            });
        });

        it('should return 400 if latitude is invalid', async () => {
            // Arrange
            mockRequest.query = { lat: '100', lon: '-74.0060' }; // Invalid latitude

            // Act
            const handler = weatherRoute['getWeatherByCoordinates'].bind(weatherRoute);
            await handler(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: WeatherRoute['ERRORS'].INVALID_LATITUDE,
            });
        });

        it('should return 400 if longitude is invalid', async () => {
            // Arrange
            mockRequest.query = { lat: '40.7128', lon: '-200' }; // Invalid longitude

            // Act
            const handler = weatherRoute['getWeatherByCoordinates'].bind(weatherRoute);
            await handler(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: WeatherRoute['ERRORS'].INVALID_LONGITUDE,
            });
        });

        it('should return 500 if the weather service throws an error', async () => {
            // Arrange
            mockRequest.query = { lat: '40.7128', lon: '-74.0060' };
            (mockWeatherService.getWeatherByCoordinates as jest.Mock).mockRejectedValue(
                new Error('Service error')
            );

            // Act
            const handler = weatherRoute['getWeatherByCoordinates'].bind(weatherRoute);
            await handler(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockLogger.error).toHaveBeenCalledWith(
                WeatherRoute['ERRORS'].FETCH_FAILED,
                expect.any(Error),
                40.7128,
                -74.006
            );
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: WeatherRoute['ERRORS'].FETCH_FAILED,
            });
        });

        it('should return 200 with weather data if the request is valid', async () => {
            // Arrange
            mockRequest.query = { lat: '40.7128', lon: '-74.0060' };
            const mockWeatherData = { temperature: 25, condition: 'Clear' };
            (mockWeatherService.getWeatherByCoordinates as jest.Mock).mockResolvedValue(
                mockWeatherData
            );

            // Act
            const handler = weatherRoute['getWeatherByCoordinates'].bind(weatherRoute);
            await handler(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockWeatherData);
        });
    });

    describe('areCoordinatesValid', () => {
        it('should return false if latitude or longitude is not a number', () => {
            // Act
            const result = weatherRoute['areCoordinatesValid']('abc', '-74.0060');

            // Assert
            expect(result).toEqual({
                areValid: false,
                errorMessage: WeatherRoute['ERRORS'].INVALID_COORDINATES_TYPE,
            });
        });

        it('should return false if latitude is out of range', () => {
            // Act
            const result = weatherRoute['areCoordinatesValid']('100', '-74.0060');

            // Assert
            expect(result).toEqual({
                areValid: false,
                errorMessage: WeatherRoute['ERRORS'].INVALID_LATITUDE,
            });
        });

        it('should return false if longitude is out of range', () => {
            // Act
            const result = weatherRoute['areCoordinatesValid']('40.7128', '-200');

            // Assert
            expect(result).toEqual({
                areValid: false,
                errorMessage: WeatherRoute['ERRORS'].INVALID_LONGITUDE,
            });
        });

        it('should return true if latitude and longitude are valid', () => {
            // Act
            const result = weatherRoute['areCoordinatesValid']('40.7128', '-74.0060');

            // Assert
            expect(result).toEqual({
                areValid: true,
                latitude: 40.7128,
                longitude: -74.006,
            });
        });
    });
});