/**
 * CoordinatesQuery represents the query parameters for geographic coordinates.
 * 
 * This interface is used to define the structure of query parameters
 * required for fetching weather data based on latitude and longitude.
 */
export interface CoordinatesQuery {
    /**
     * The latitude of the location.
     * 
     * This should be a string representation of a number between -90 and 90.
     */
    lat: string;

    /**
     * The longitude of the location.
     * 
     * This should be a string representation of a number between -180 and 180.
     */
    lon: string;
}