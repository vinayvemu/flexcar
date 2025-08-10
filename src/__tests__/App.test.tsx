import React from "react";
import { render } from "@testing-library/react";
import App from "../App";
import AppLayout from "../components/AppLayout";

// Mock all external dependencies
jest.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="router">{children}</div>
  ),
  Routes: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="routes">{children}</div>
  ),
  Route: () => <div data-testid="route">Route</div>,
  Outlet: () => <div data-testid="outlet">Page Content</div>,
}));

// Mock components
// Don't mock AppLayout so we can test it directly

jest.mock("../components/Header", () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock("../pages/HomePage", () => {
  return function MockHomePage() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

jest.mock("../pages/SearchResultsPage", () => {
  return function MockSearchResultsPage() {
    return <div data-testid="search-results-page">Search Results Page</div>;
  };
});

describe("App", () => {
  it("renders without crashing", () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders basic app structure", () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId("router")).toBeInTheDocument();
  });
});

describe("AppLayout", () => {
  it("renders layout structure with Header and Outlet", () => {
    const { container } = render(<AppLayout />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders Header component", () => {
    const { getByTestId } = render(<AppLayout />);

    // Header should be rendered (mocked as MockHeader)
    expect(getByTestId("header")).toBeInTheDocument();
  });

  it("renders Outlet for page content", () => {
    const { getByTestId } = render(<AppLayout />);

    // Outlet should be rendered (mocked to show "Page Content")
    expect(getByTestId("outlet")).toBeInTheDocument();
  });

  it("has proper container structure", () => {
    const { container } = render(<AppLayout />);

    // Check that it renders without errors
    expect(container.firstChild).toBeInTheDocument();

    // Check for styled Box structure (AppContainer is styled from MUI Box)
    const boxElement = container.querySelector(".MuiBox-root");
    expect(boxElement).toBeInTheDocument();
  });
});
