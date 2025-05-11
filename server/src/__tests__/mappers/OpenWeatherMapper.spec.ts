import OpenWeatherMapper from '../../mappers/OpenWeatherMapper';
import ILogger from '../../utils/Logger.interface';
import { WeatherServiceData } from '../../models/WeatherServiceData';

describe('OpenWeatherMapper', () => {
    let mockLogger: ILogger;
    let mapper: OpenWeatherMapper;

    beforeEach(() => {
        // Mock the logger
        mockLogger = {
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            http: jest.fn(),
        };

        // Create an instance of OpenWeatherMapper
        mapper = new OpenWeatherMapper(mockLogger);
    });

    describe('mapToWeatherServiceData', () => {
        it('should map raw OpenWeather API data to WeatherServiceData', () => {
            // Arrange
            const rawData = {
                current: {
                    weather: [{ id: 800 }],
                    feels_like: 75,
                },
                alerts: [{ event: 'Heat Advisory' }],
            };

            // Act
            const result: WeatherServiceData = mapper.mapToWeatherServiceData(rawData);

            // Assert
            expect(result).toEqual({
                current_condition: 'Clear Sky',
                temperature_description: 'Warm',
                active_alerts: [{ event: 'Heat Advisory' }],
            });
        });

        it('should handle missing weather condition data gracefully', () => {
            // Arrange
            const rawData = {
                current: {
                    weather: [{}],
                    feels_like: 75,
                },
                alerts: [],
            };

            // Act
            const result: WeatherServiceData = mapper.mapToWeatherServiceData(rawData);

            // Assert
            expect(result.current_condition).toBe('Unknown');
        });

        it('should handle missing temperature data gracefully', () => {
            // Arrange
            const rawData = {
                current: {
                    weather: [{ id: 800 }],
                    feels_like: null,
                },
                alerts: [],
            };

            // Act
            const result: WeatherServiceData = mapper.mapToWeatherServiceData(rawData);

            // Assert
            expect(result.temperature_description).toBe('Unknown');
        });

        it('should handle missing alerts gracefully', () => {
            // Arrange
            const rawData = {
                current: {
                    weather: [{ id: 800 }],
                    feels_like: 75,
                },
            };

            // Act
            const result: WeatherServiceData = mapper.mapToWeatherServiceData(rawData);

            // Assert
            expect(result.active_alerts).toEqual([]);
        });
    });

    describe('mapCurrentCondition', () => {
        it('should map a valid weather condition code to a description', () => {
            // Arrange
            const rawData = {
                current: {
                    weather: [{ id: 800 }],
                },
            };

            // Act
            const result = mapper['mapCurrentCondition'](rawData);

            // Assert
            expect(result).toBe('Clear Sky');
        });

        it('should return "Unknown" for an invalid weather condition code', () => {
            // Arrange
            const rawData = {
                current: {
                    weather: [{ id: 'invalid' }],
                },
            };

            // Act
            const result = mapper['mapCurrentCondition'](rawData);

            // Assert
            expect(result).toBe('Unknown');
        });
    });

    describe('mapTempDescription', () => {
        it('should map a valid temperature to a description', () => {
            // Arrange
            const rawData = {
                current: {
                    feels_like: 75,
                },
            };

            // Act
            const result = mapper['mapTempDescription'](rawData);

            // Assert
            expect(result).toBe('Warm');
        });

        it('should return "Unknown" for an invalid temperature', () => {
            // Arrange
            const rawData = {
                current: {
                    feels_like: 'invalid',
                },
            };

            // Act
            const result = mapper['mapTempDescription'](rawData);

            // Assert
            expect(result).toBe('Unknown');
        });
    });

    describe('mapAlerts', () => {
        it('should map valid alerts to an array of alert objects', () => {
            // Arrange
            const rawData = {
                alerts: [{ event: 'Heat Advisory' }, { event: 'Flood Warning' }],
            };

            // Act
            const result = mapper['mapAlerts'](rawData);

            // Assert
            expect(result).toEqual([{ event: 'Heat Advisory' }, { event: 'Flood Warning' }]);
        });

        it('should return an empty array if no alerts are present', () => {
            // Arrange
            const rawData = {};

            // Act
            const result = mapper['mapAlerts'](rawData);

            // Assert
            expect(result).toEqual([]);
        });
    });
});