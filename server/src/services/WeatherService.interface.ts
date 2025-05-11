/**
 * IWeatherService defines the contract for weather service implementations.
 * 
 * This interface provides methods for fetching weather data based on specific criteria,
 * such as geographic coordinates. Implementations of this interface are responsible
 * for interacting with weather APIs and returning the data in a standardized format.
 */
export default interface IWeatherService{
    
    /**
     * Fetches weather data for a specific location based on latitude and longitude.
     * 
     * @param lat - The latitude of the location.
     * @param lon - The longitude of the location.
     * @returns A Promise that resolves to the weather data for the specified location.
     * The structure of the returned data depends on the implementation.
     */
    getWeatherByCoordinates(lat: number, lon: number): Promise<any>;
    
}