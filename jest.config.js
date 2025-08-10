export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  setupFiles: ["<rootDir>/src/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{ts,tsx}",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.tsx",
    "!src/vite-env.d.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 50,
      lines: 60,
      statements: 60,
    },
  },
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
};
