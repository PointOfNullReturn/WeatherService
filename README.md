# WeatherService

## Project Description
WeatherService is a robust and scalable backend service designed to provide weather data to clients. It integrates with external weather APIs, processes the data, and serves it through well-defined endpoints. The project is built with Node.js and TypeScript, ensuring type safety and modern JavaScript features.

## Features
- Fetch current weather data for a given location.
- Support for multiple weather data providers.
- Centralized logging using Winston.
- Comprehensive test coverage with Jest.

## Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/WeatherService.git
   ```
2. Navigate to the project directory:
   ```bash
   cd WeatherService/server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and configure the required environment variables:
   ```env
   API_KEY=your_openweather_api_key
   PORT=3000
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints
### 1. Get Current Weather
- **Endpoint:** `/api/weather`
- **Method:** `GET`
- **Query Parameters:**
  - `lat` (required): Latitude of the location.
  - `lon` (required): Longitude of the location.
- **Example Request:**
  ```bash
  curl "http://localhost:3000/api/weather?lat=40.7128&lon=-74.0060"
  ```
- **Response:**
  ```json
  {
    "temperature": 22.5,
    "description": "clear sky",
    "humidity": 60
  }
  ```

## Testing Instructions
1. Run the test suite:
   ```bash
   npm test
   ```
2. View test coverage:
   ```bash
   npm run test:coverage
   ```

## Project Structure
```
server/
├── src/
│   ├── index.ts          # Entry point of the application
│   ├── mappers/          # Data mappers for external APIs
│   │   └── OpenWeatherMapper.ts
│   ├── utils/            # Utility functions and classes
│   │   ├── WinstonLogger.ts
│   │   └── Logger.interface.ts
│   └── types/            # Type definitions
│       └── CoordinatesQuery.ts
├── tests/                # Test cases
├── package.json          # Project metadata and dependencies
└── README.md             # Project documentation
```

## Logging Details
This project uses Winston for logging. Logs are categorized into different levels (info, error, debug) and can be configured in `WinstonLogger.ts`.

## Contribution Guidelines
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear messages.
4. Submit a pull request with a detailed description of your changes.

## Contact Information
For questions or support, please contact:
- **Name:** Kevin Cox
- **GitHub:** [PointOfNullReturn](https://github.com/PointOfNullReturn/)
