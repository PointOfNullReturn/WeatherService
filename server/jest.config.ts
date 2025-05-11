import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/__tests__/**/*.spec.ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest', // Use ts-jest for .ts files
    },
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
}

export default config;