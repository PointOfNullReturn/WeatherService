import { AxiosInstance } from 'axios';
import { WeatherMapper } from '../mappers/WeatherMapper.interface';
import ILogger from '../utils/Logger.interface';
import IWeatherService from './WeatherService.interface';

/**
 * OpenWeatherService is a class that implements the IWeatherService interface.
 * 
 * This service is responsible for fetching weather data from the OpenWeatherMap API.
 * It uses the OneCall 3.0 API to retrieve weather data based on geographic coordinates
 * and maps the API response to a standardized format using a `WeatherMapper`.
 * 
 * @see https://openweathermap.org/api/one-call-3
 */
export default class OpenWeatherService implements IWeatherService {

    /**
     * Logger instance for logging information and errors.
     */
    private logger: ILogger;

    /**
     * API key for authenticating requests to the OpenWeatherMap API.
     */
    private apiKey: string;

    /**
     * Base URL for the OpenWeatherMap API.
     */
    private baseUrl: string;

    /**
     * Axios HTTP client for making API requests.
     */
    private httpClient: AxiosInstance;

    /**
     * Mapper for transforming API responses into a standardized format.
     */
    private mapper: WeatherMapper;

    /**
     * Constructs a new instance of OpenWeatherService.
     * 
     * @param logger - An instance of a logger for logging information and errors.
     * @param apiKey - The API key for authenticating requests to the OpenWeatherMap API.
     * @param baseUrl - The base URL for the OpenWeatherMap API.
     * @param httpClient - An Axios HTTP client for making API requests.
     * @param mapper - A mapper for transforming API responses into a standardized format.
     */
    constructor(logger: ILogger, apiKey: string, baseUrl: string, httpClient: AxiosInstance, mapper: WeatherMapper) {
        this.logger = logger;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.httpClient = httpClient;
        this.mapper = mapper;

        this.logger.info('OpenWeatherService initialized with API key and base URL');
    }

    /**
     * Fetches weather data from the OpenWeatherMap API based on geographic coordinates.
     * 
     * This method sends a GET request to the OpenWeatherMap API using the provided latitude
     * and longitude. The API response is then mapped to a standardized format using the
     * `WeatherMapper`.
     * 
     * @param lat - The latitude of the location for which to fetch weather data.
     * @param lon - The longitude of the location for which to fetch weather data.
     * @returns A promise that resolves to the mapped weather data.
     * 
     * @throws Will throw an error if the API request fails or if the response cannot be mapped.
     */
    async getWeatherByCoordinates(lat: number, lon: number): Promise<any> {
        try {
            const apiResponse = await this.httpClient.get(`${this.baseUrl}?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&units=imperial&appid=${this.apiKey}`);
            const weatherServiceResponse = this.mapper.mapToWeatherServiceData(apiResponse.data);
            return weatherServiceResponse;
        } catch (error) {
            this.logger.error('Error fetching weather data from OpenWeather API', { error, lat, lon });
            throw error
        }
    }
}