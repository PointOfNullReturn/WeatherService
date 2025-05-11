import { WeatherServiceData } from "../models/WeatherServiceData";

/**
 * WeatherMapper is an interface that defines the contract for mapping raw weather API data
 * into the application's internal `WeatherServiceData` format.
 * 
 * Implementations of this interface are responsible for transforming data from specific
 * weather APIs into a standardized format used by the application.
 */
export interface WeatherMapper {

    /**
     * Maps raw weather API data to the `WeatherServiceData` model.
     * 
     * @param data - The raw data from a weather API.
     * @returns A `WeatherServiceData` object containing the mapped weather data.
     */
    mapToWeatherServiceData(data: any): WeatherServiceData;
}