import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import HomePage from "../HomePage";

// Mock react-router-dom
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
};

describe("HomePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Core Functionality", () => {
    it("renders the search form", () => {
      renderHomePage();

      expect(screen.getByText("Find Your Next Car")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter ZIP code")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /search vehicles/i })
      ).toBeInTheDocument();
    });

    it("navigates to search results with valid ZIP code", async () => {
      const user = userEvent.setup();
      renderHomePage();

      const input = screen.getByPlaceholderText("Enter ZIP code");
      const form = screen
        .getByRole("button", { name: /search vehicles/i })
        .closest("form");

      await user.type(input, "10001");
      if (form) {
        fireEvent.submit(form);
      }

      expect(mockNavigate).toHaveBeenCalledWith(
        "/search-results?zipcode=10001"
      );
    });
  });

  describe("Validation", () => {
    it("shows error for empty ZIP code", async () => {
      renderHomePage();

      const form = screen
        .getByRole("button", { name: /search vehicles/i })
        .closest("form");
      if (form) {
        fireEvent.submit(form);
      }

      // Use getAllByText since error appears in multiple places
      const errorElements = screen.getAllByText("Please enter a ZIP code.");
      expect(errorElements.length).toBeGreaterThan(0);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("shows error for invalid ZIP code format", async () => {
      const user = userEvent.setup();
      renderHomePage();

      const input = screen.getByPlaceholderText("Enter ZIP code");
      const form = screen
        .getByRole("button", { name: /search vehicles/i })
        .closest("form");

      await user.type(input, "123");
      if (form) {
        fireEvent.submit(form);
      }

      // Use getAllByText since error appears in multiple places
      const errorElements = screen.getAllByText(
        "Please enter a valid 5-digit ZIP code."
      );
      expect(errorElements.length).toBeGreaterThan(0);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("shows error for ZIP code with no vehicles", async () => {
      const user = userEvent.setup();
      renderHomePage();

      const input = screen.getByPlaceholderText("Enter ZIP code");
      const form = screen
        .getByRole("button", { name: /search vehicles/i })
        .closest("form");

      await user.type(input, "99999");
      if (form) {
        fireEvent.submit(form);
      }

      // Use getAllByText since error appears in multiple places
      const errorElements = screen.getAllByText(
        "No vehicles in that area. Try another ZIP code."
      );
      expect(errorElements.length).toBeGreaterThan(0);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
