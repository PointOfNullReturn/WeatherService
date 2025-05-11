/**
 * WeatherServiceData represents the standardized format for weather data used by the application.
 * 
 * This interface defines the structure of the weather data after it has been mapped
 * from raw weather API responses into a format that the application can use.
 */
export interface WeatherServiceData {
    /**
     * A description of the current weather condition.
     * Examples: "Snow", "Rain", "Clear Sky".
     */
    current_condition: string;

    /**
     * A descriptive string representing the current temperature.
     * Examples: "Cold", "Warm", "Hot".
     */
    temperature_description: string;

    /**
     * An array of active weather alerts.
     * Each alert is represented as an object containing details about the alert.
     * The structure of each alert object depends on the specific weather API used.
     */
    active_alerts: {}[];
}