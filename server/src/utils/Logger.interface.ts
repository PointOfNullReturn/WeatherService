/**
 * ILogger defines the contract for a logging utility.
 * 
 * This interface specifies methods for logging messages at various levels:
 * - `info`: Logs general informational messages.
 * - `http`: Logs HTTP-specific messages, such as requests and responses.
 * - `warn`: Logs warning messages that indicate potential issues.
 * - `error`: Logs error messages for critical issues or exceptions.
 */
export default interface ILogger {

    /**
     * Logs an informational message.
     * 
     * @param message - The message to log.
     * @param meta - Additional metadata to include in the log.
     */
    info(message: string, ...meta: any[]): void;

    /**
     * Logs an HTTP request.
     * 
     * @param ip - The IP address of the client making the request.
     * @param method - The HTTP method (e.g., GET, POST).
     * @param url - The URL of the request.
     * @param query - The query parameters of the request.
     */
    http(ip: string | undefined, method: string, url: string, query: any): void;

    /**
     * Logs a warning message.
     * 
     * @param message - The warning message to log.
     * @param meta - Additional metadata to include in the log.
     */
    warn(message: string, ...meta: any[]): void;

    /**
     * Logs an error message.
     * 
     * @param message - The error message to log.
     * @param meta - Additional metadata to include in the log.
     */
    error(message: string, ...meta: any[]): void;
}