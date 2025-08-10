import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Header from "../Header";

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
const mockSearchParams = {
  get: jest.fn(),
  clear: jest.fn(),
};
const mockLocation = { pathname: "/" };

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams],
  useLocation: () => mockLocation,
}));

// Helper function to render Header with router context
const renderHeader = (zipcode = "", pathname = "/") => {
  mockSearchParams.get.mockReturnValue(zipcode);
  mockLocation.pathname = pathname;

  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams.clear();
  });

  describe("Core Functionality", () => {
    it("renders logo and title", () => {
      renderHeader();

      expect(screen.getByText("Vehicle Finder")).toBeInTheDocument();
      expect(screen.getByTestId("DirectionsCarFilledIcon")).toBeInTheDocument();
    });

    it("navigates to home when logo is clicked", async () => {
      const user = userEvent.setup();
      renderHeader();

      const logo = screen.getByText("Vehicle Finder").closest("div");
      await user.click(logo!);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  describe("ZIP Code Button Visibility", () => {
    it("shows current ZIP code when set", () => {
      renderHeader("10001");
      expect(screen.getByText("10001")).toBeInTheDocument();
    });

    it("hides ZIP button on home page when no ZIP is set", () => {
      renderHeader("", "/");
      expect(screen.queryByText("Set ZIP")).not.toBeInTheDocument();
    });

    it("shows ZIP button on search results page", () => {
      renderHeader("", "/search-results");
      expect(screen.getByText("Set ZIP")).toBeInTheDocument();
    });
  });

  describe("ZIP Code Dialog", () => {
    it("opens and populates dialog with current ZIP code", async () => {
      const user = userEvent.setup();
      renderHeader("10001");

      const zipButton = screen.getByText("10001");
      await user.click(zipButton);

      expect(screen.getByText("Select ZIP code")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter ZIP code")).toHaveValue(
        "10001"
      );
    });

    it("closes dialog when pressing escape", async () => {
      const user = userEvent.setup();
      renderHeader("10001");

      const zipButton = screen.getByText("10001");
      await user.click(zipButton);

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByText("Select ZIP code")).not.toBeInTheDocument();
      });
    });

    it("validates ZIP code and disables submit for invalid codes", async () => {
      const user = userEvent.setup();
      renderHeader("10001");

      const zipButton = screen.getByText("10001");
      await user.click(zipButton);

      const input = screen.getByPlaceholderText("Enter ZIP code");
      const submitButton = screen.getByText("Show results");

      // Valid ZIP should enable submit
      expect(submitButton).not.toBeDisabled();

      // Invalid ZIP should disable submit and show error
      await user.clear(input);
      await user.type(input, "123");

      expect(screen.getByText("No vehicles in that area")).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it("navigates to search results with new ZIP code", async () => {
      const user = userEvent.setup();
      renderHeader("10001");

      const zipButton = screen.getByText("10001");
      await user.click(zipButton);

      const input = screen.getByPlaceholderText("Enter ZIP code");
      await user.clear(input);
      await user.type(input, "30301");

      const submitButton = screen.getByText("Show results");
      await user.click(submitButton);

      expect(mockNavigate).toHaveBeenCalledWith(
        "/search-results?zipcode=30301"
      );

      await waitFor(() => {
        expect(screen.queryByText("Select ZIP code")).not.toBeInTheDocument();
      });
    });
  });
});
