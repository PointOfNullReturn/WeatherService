import { AxiosInstance } from 'axios';
import OpenWeatherService from '../../services/OpenWeatherService';
import ILogger from '../../utils/Logger.interface';
import { WeatherMapper } from '../../mappers/WeatherMapper.interface';

describe('OpenWeatherService', () => {
    let mockLogger: ILogger;
    let mockHttpClient: jest.Mocked<AxiosInstance>;
    let mockMapper: jest.Mocked<WeatherMapper>;
    let openWeatherService: OpenWeatherService;

    beforeEach(() => {
        // Mock the logger
        mockLogger = {
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            http: jest.fn(),
        };

        // Mock the HTTP client
        mockHttpClient = {
            get: jest.fn(),
        } as unknown as jest.Mocked<AxiosInstance>;

        // Mock the mapper
        mockMapper = {
            mapToWeatherServiceData: jest.fn(),
        } as unknown as jest.Mocked<WeatherMapper>;

        // Create an instance of OpenWeatherService
        openWeatherService = new OpenWeatherService(
            mockLogger,
            'test-api-key',
            'https://api.openweathermap.org/data/3.0/onecall',
            mockHttpClient,
            mockMapper
        );
    });

    describe('getWeatherByCoordinates', () => {
        it('should fetch weather data and map it successfully', async () => {
            // Arrange
            const mockApiResponse = { data: { temp: 25, condition: 'Clear' } };
            const mockMappedResponse = { current_condition: 'Clear', temperature_description: 'Cold',active_alerts: [] };
            mockHttpClient.get.mockResolvedValue(mockApiResponse);
            mockMapper.mapToWeatherServiceData.mockReturnValue(mockMappedResponse);

            // Act
            const result = await openWeatherService.getWeatherByCoordinates(40.7128, -74.0060);

            // Assert
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                'https://api.openweathermap.org/data/3.0/onecall?lat=40.7128&lon=-74.006&exclude=minutely,hourly,daily&units=imperial&appid=test-api-key'
            );
            expect(mockMapper.mapToWeatherServiceData).toHaveBeenCalledWith(mockApiResponse.data);
            expect(result).toEqual(mockMappedResponse);
        });

        it('should log an error and rethrow it if the API call fails', async () => {
            // Arrange
            const mockError = new Error('API error');
            mockHttpClient.get.mockRejectedValue(mockError);

            // Act & Assert
            await expect(openWeatherService.getWeatherByCoordinates(40.7128, -74.0060)).rejects.toThrow(mockError);
            expect(mockLogger.error).toHaveBeenCalledWith(
                'Error fetching weather data from OpenWeather API',
                { error: mockError, lat: 40.7128, lon: -74.006 }
            );
        });

        it('should log an error and rethrow it if the mapper throws an error', async () => {
            // Arrange
            const mockApiResponse = { data: { temp: 25, condition: 'Clear' } };
            const mockMappingError = new Error('Mapping error');
            mockHttpClient.get.mockResolvedValue(mockApiResponse);
            mockMapper.mapToWeatherServiceData.mockImplementation(() => {
                throw mockMappingError;
            });

            // Act & Assert
            await expect(openWeatherService.getWeatherByCoordinates(40.7128, -74.0060)).rejects.toThrow(mockMappingError);
            expect(mockLogger.error).toHaveBeenCalledWith(
                'Error fetching weather data from OpenWeather API',
                { error: mockMappingError, lat: 40.7128, lon: -74.006 }
            );
        });

        it('should log initialization when the service is created', () => {
            // Assert
            expect(mockLogger.info).toHaveBeenCalledWith('OpenWeatherService initialized with API key and base URL');
        });
    });
});