# WeatherService

## Project Overview
WeatherService is a backend application designed to provide weather data to clients. It integrates with external weather APIs, processes the data, and serves it through well-defined endpoints. The project is built using Node.js and TypeScript, ensuring type safety and modern JavaScript features.

## Features
- Fetch current weather data for a given location.
- Support for multiple weather data providers.
- Centralized logging using Winston.
- Comprehensive test coverage with Jest.

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- OpenWeather API Subscription and API Key (You'll need a subscription to the One Call API 3.0)

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
   API_KEY=your_openweather_api_key
   PORT=3000
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

## Contribution Guidelines
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear messages.
4. Submit a pull request with a detailed description of your changes.

## Contact Information
For questions or support, please contact:
- **Name:** Kevin Cox
- **GitHub:** [PointOfNullReturn](https://github.com/PointOfNullReturn/)
