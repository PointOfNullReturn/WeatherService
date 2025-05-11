import { createLogger, format, transports } from 'winston';
import ILogger from './Logger.interface';

/**
 * WinstonLogger is a logging utility that implements the ILogger interface.
 * 
 * This class uses the Winston library to log messages at various levels (`info`, `http`, `warn`, `error`).
 * Logs are written to two separate files:
 * - `application.log`: Logs all levels except `http`.
 * - `http.log`: Logs only `http` level logs.
 * 
 * Additionally, logs are output to the console for development purposes.
 */
export class WinstonLogger implements ILogger {

    private logger = createLogger({
        level: 'info',
        format: format.combine(
            format.timestamp(),
            format.printf(({ timestamp, level, message }) => {
                return `${timestamp} [${level.toUpperCase()}]: ${message}`;
            })
        ),
        transports: [
            // Transport for general application logs (everything except for HTTP-specific logs)
            new transports.File({
                filename: 'application.log',
                level: 'info',
                format: format.combine(
                    format.timestamp(),
                    format.printf(({ timestamp, level, message }) => {
                        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
                    })
                )
            }),
            // Transport for HTTP-specific logs
            new transports.File({
                filename: 'http.log',
                level: 'http',
                format: format.combine(
                    format.timestamp(),
                    format.printf(({ timestamp, level, message }) => {
                        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
                    })
                )
            }),
            // Console transport for development
            new transports.Console({
                level: 'info',
            })
        ],
    });

    /**
     * Logs an informational message.
     * 
     * @param message - The message to log.
     * @param meta - Additional metadata to include in the log.
     */
    info(message: string, ...meta: any[]): void {
        this.logger.info(message, ...meta);
    }

    /**
     * Logs an HTTP request.
     * 
     * @param ip - The IP address of the client making the request.
     * @param method - The HTTP method (e.g., GET, POST).
     * @param url - The URL of the request.
     * @param query - The query parameters of the request.
     */
    http(ip: string | undefined, method: string, url: string, query: any): void {
        this.logger.http(`IP: ${ip} ${method} ${url} ${JSON.stringify(query)}`);
    }

    /**
     * Logs a warning message.
     * 
     * @param message - The warning message to log.
     * @param meta - Additional metadata to include in the log.
     */
    warn(message: string, ...meta: any[]): void {
        this.logger.warn(message, ...meta);
    }

    /**
     * Logs an error message.
     * 
     * @param message - The error message to log.
     * @param meta - Additional metadata to include in the log.
     */
    error(message: string, ...meta: any[]): void {
        this.logger.error(message, ...meta);
    }
}