# WeatherService

## Project Overview
WeatherService is a backend application designed to provide weather data to clients. It integrates with external weather APIs, processes the data, and serves it through well-defined endpoints. The project is built using Node.js, TypeScript, and Express ensuring type safety and modern JavaScript features.

## Features
- Fetch current weather data for a given location.
- Support for multiple weather data providers.
- Centralized logging using Winston.
- Comprehensive test coverage with Jest.

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- OpenWeather API Subscription and OpenWeather API Key (You'll need a subscription to the One Call API 3.0)
- An API key created for this project.

### Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/PointOfNullReturn/WeatherService.git
   ```
2. Navigate to the project directory:
   ```bash
   cd WeatherService/server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory by by copying the EXAMPLE.env file and configure the required environment variables:
   ```env
   # Node Environment
   NODE_ENV=development
   #Application Port
   PORT=3000
   # API Key for this API
   WEATHER_SERVICE_API_KEY='your_api_key_here'
   # Open Weather API Key
   OPENWEATHER_API_KEY='your_openweather_api_key'
   # Open Weather Base URL
   OPENWEATHER_BASE_URL='https://api.openweathermap.org/data/3.0/onecall'
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Running the Project
To start the application in development mode, use the following command:
```bash
npm run dev
```
The server will start on the port specified in the `.env` file (default: 3000).

## Unit Testing
This project uses Jest for unit testing. To run the tests, use the following command:
```bash
npm test
```
To view test coverage, run:
```bash
npm run test:coverage
```

## API Key Usage
To access the WeatherService API, you must include a valid API key with each request. The API key can be provided in one of the following ways:

1. ***Request Header***: Include the API key in the `x-api-key` header.
2. ***Query Parameter***: Include the API key as a query parameter named `apikey`.

Example Requests
Using the x-api-key Header: curl -H "x-api-key: your_api_key" http://localhost:3000/api/v1/weather/coordinates?lat=40.7128&lon=-74.0060

Using the apikey Query Parameter: curl http://localhost:3000/api/v1/weather/coordinates?lat=40.7128&lon=-74.0060&apikey=your_api_key

Development Mode
When the application is running in development mode (NODE_ENV=development), API key validation is bypassed, and requests are allowed without an API key.
In production mode (NODE_ENV=production), a valid API key is required.
Environment Variable
The API key is configured using the WEATHER_SERVICE_API_KEY environment variable. Add the following to your .env file: 
WEATHER_SERVICE_API_KEY=your_secure_api_key NODE_ENV=production

Replace your_secure_api_key with your actual API key.

Error Responses
If the API key is missing or invalid, the server will respond with the following status codes:

401 Unauthorized: If the API key is missing.
403 Forbidden: If the API key is invalid.

## Project Structure
```
server/
├── src/
│   ├── index.ts          # Entry point of the application
│   ├── mappers/          # Data mappers for external APIs
│   │   └── OpenWeatherMapper.ts
│   ├── models/           # Models
│   │   └── WeatherServiceData.ts
│   ├── middleware/       # Middleware
│   │   └── apiKeyValidator.ts
│   ├── utils/            # Utility functions and classes
│   │   ├── WinstonLogger.ts
│   │   └── Logger.interface.ts
│   ├── routes/           # API route handlers
│   │   ├── InfoRoute.ts
│   │   └── WeatherRoute.ts
│   ├── services/         # Service layer for business logic
│   │   ├── OpenWeatherService.ts
│   │   └── WeatherService.interface.ts
│   └── types/            # Type definitions
│       └── CoordinatesQuery.ts
├── tests/                # Test cases
├── package.json          # Project metadata and dependencies
└── README.md             # Project documentation
```

## Logging
This project uses Winston for logging. Logs are categorized into different levels (info, error, debug) and can be configured in `WinstonLogger.ts`.

## Contact Information
For questions or support, please contact:
- **Name:** Kevin Cox
- **GitHub:** [PointOfNullReturn](https://github.com/PointOfNullReturn/)
