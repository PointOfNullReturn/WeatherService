import { WeatherMapper } from './WeatherMapper.interface';
import { WeatherServiceData } from '../models/WeatherServiceData';
import ILogger from '../utils/Logger.interface';

/**
 * OpenWeatherMapper is responsible for mapping raw data from the OpenWeather API
 * into the application's internal `WeatherServiceData` format.
 */
export default class OpenWeatherMapper implements WeatherMapper {

    // Temperature thresholds as named constants in Imperial units (Fahrenheit)
    private static readonly TEMP_EXTREMELY_COLD_UPPER = -4;
    private static readonly TEMP_VERY_COLD_UPPER = 14;
    private static readonly TEMP_COLD_UPPER = 32;
    private static readonly TEMP_CHILLY_UPPER = 50;
    private static readonly TEMP_COOL_UPPER = 59;
    private static readonly TEMP_MILD_UPPER = 68;
    private static readonly TEMP_WARM_UPPER = 77;
    private static readonly TEMP_HOT_UPPER = 86;
    private static readonly TEMP_VERY_HOT_UPPER = 95;

    private static readonly UNKNOWN_VALUE = 'Unknown';

    private logger: ILogger;

    constructor(logger: ILogger) {
        this.logger = logger;
    }

    /**
     * Maps raw OpenWeather API data to the `WeatherServiceData` model.
     * @param data - The raw data from the OpenWeather API.
     * @returns A `WeatherServiceData` object containing the mapped weather data.
     */
    mapToWeatherServiceData(data: any): WeatherServiceData {
        const weatherServiceData: WeatherServiceData = {
            current_condition: this.mapCurrentCondition(data),
            temperature_description: this.mapTempDescription(data),
            active_alerts: this.mapAlerts(data)
        };

        return weatherServiceData;
    }

    /**
     * Maps the current weather condition based on OpenWeather API condition codes.
     * The condition codes and human-readable descriptions are based on the OpenWeather API documentation.
     * @see https://openweathermap.org/weather-conditions/#Weather-Condition-Codes-2
     * @param data - The raw data from the OpenWeather API.
     * @returns A string describing the current weather condition.
     */
    private mapCurrentCondition(data: any): string {
        const weatherData = data.current.weather[0];
        const conditionCode = parseInt(weatherData.id, 10);

        if (isNaN(conditionCode)) {
            return OpenWeatherMapper.UNKNOWN_VALUE;
        }

        const conditionMap: { [key: number]: string } = {
            200: 'Thunderstorm with Light Rain',
            201: 'Thunderstorm with Rain',
            202: 'Thunderstorm with Heavy Rain',
            210: 'Light Thunderstorm',
            211: 'Thunderstorm',
            212: 'Heavy Thunderstorm',
            221: 'Ragged Thunderstorm',
            230: 'Thunderstorm with Light Drizzle',
            231: 'Thunderstorm with Drizzle',
            232: 'Thunderstorm with Heavy Drizzle',
            300: 'Light Intensity Drizzle',
            301: 'Drizzle',
            302: 'Heavy Intensity Drizzle',
            310: 'Light Intensity Drizzle Rain',
            311: 'Drizzle Rain',
            312: 'Heavy Intensity Drizzle Rain',
            313: 'Shower Rain and Drizzle',
            314: 'Heavy Shower Rain and Drizzle',
            321: 'Shower Drizzle',
            500: 'Light Rain',
            501: 'Moderate Rain',
            502: 'Heavy Intensity Rain',
            503: 'Very Heavy Rain',
            504: 'Extreme Rain',
            511: 'Freezing Rain',
            520: 'Light Intensity Shower Rain',
            521: 'Shower Rain',
            522: 'Heavy Intensity Shower Rain',
            531: 'Ragged Shower Rain',
            600: 'Light Snow',
            601: 'Snow',
            602: 'Heavy Snow',
            611: 'Sleet',
            612: 'Light Shower Sleet',
            613: 'Shower Sleet',
            615: 'Light Rain and Snow',
            616: 'Rain and Snow',
            620: 'Light Shower Snow',
            621: 'Shower Snow',
            622: 'Heavy Shower Snow',
            701: 'Mist',
            711: 'Smoke',
            721: 'Haze',
            731: 'Sand, Dust Whirls',
            741: 'Fog',
            751: 'Sand',
            761: 'Dust',
            762: 'Volcanic Ash',
            771: 'Squalls',
            781: 'Tornado',
            800: 'Clear Sky',
            801: 'Few Clouds',
            802: 'Scattered Clouds',
            803: 'Broken Clouds',
            804: 'Overcast Clouds'
        };

        // Return the mapped condition or a default value if not found
        return conditionMap[conditionCode] || OpenWeatherMapper.UNKNOWN_VALUE;
    }

    /**
     * Maps temperature range into a descriptive string.
     * The temperature ranges are in Imperal units (Fahrenheit).
     * @param data - The raw data from the OpenWeather API.
     * @returns A string describing the temperature (e.g., "Cold", "Warm").
     */
    private mapTempDescription(data: any): string {
        const temp = parseFloat(data.current.feels_like);
        if (isNaN(temp)) {
            return OpenWeatherMapper.UNKNOWN_VALUE;
        }

        if (temp <= OpenWeatherMapper.TEMP_EXTREMELY_COLD_UPPER) {
            return 'Extremely Cold';
        } else if (temp <= OpenWeatherMapper.TEMP_VERY_COLD_UPPER) {
            return 'Very Cold';
        } else if (temp <= OpenWeatherMapper.TEMP_COLD_UPPER) {
            return 'Cold';
        } else if (temp <= OpenWeatherMapper.TEMP_CHILLY_UPPER) {
            return 'Chilly';
        } else if (temp <= OpenWeatherMapper.TEMP_COOL_UPPER) {
            return 'Cool';
        } else if (temp <= OpenWeatherMapper.TEMP_MILD_UPPER) {
            return 'Mild';
        } else if (temp <= OpenWeatherMapper.TEMP_WARM_UPPER) {
            return 'Warm';
        } else if (temp <= OpenWeatherMapper.TEMP_HOT_UPPER) {
            return 'Hot';
        } else if (temp <= OpenWeatherMapper.TEMP_VERY_HOT_UPPER) {
            return 'Very Hot';
        } else if (temp > OpenWeatherMapper.TEMP_VERY_HOT_UPPER) {
            return 'Extremely Hot';
        } else {
            return OpenWeatherMapper.UNKNOWN_VALUE;
        }
    }

    /**
     * Maps weather alerts from the OpenWeather API to a structured format.
     * @param data - The raw data from the OpenWeather API.
     * @returns An array of alert objects containing the event name.
     */
    private mapAlerts(data: any): {event: string}[] {
        const alerts = data.alerts;
        
        if (alerts && alerts.length > 0) {
            return alerts.map((alert: any) => {
                return {
                    event: alert.event
                };
            });
        } else {
            return [];
        }
    }
}