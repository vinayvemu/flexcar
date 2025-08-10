import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ZipCodeSearch from "../ZipCodeSearch";

const defaultProps = {
  zipCode: "",
  setZipCode: jest.fn(),
  handleSearch: jest.fn(),
  error: null,
};

describe("ZipCodeSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Core Functionality", () => {
    it("renders search form with correct elements", () => {
      render(<ZipCodeSearch {...defaultProps} />);

      expect(screen.getByText("Find Your Next Car")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Enter your ZIP code to see available vehicles near you."
        )
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter ZIP code")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /search vehicles/i })
      ).toBeInTheDocument();
    });

    it("displays current ZIP code value", () => {
      render(<ZipCodeSearch {...defaultProps} zipCode="10001" />);

      const input = screen.getByPlaceholderText("Enter ZIP code");
      expect(input).toHaveValue("10001");
    });

    it("calls setZipCode when input changes", async () => {
      const user = userEvent.setup();
      render(<ZipCodeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText("Enter ZIP code");
      await user.type(input, "12345");

      expect(defaultProps.setZipCode).toHaveBeenCalledWith("1");
      expect(defaultProps.setZipCode).toHaveBeenCalledWith("12");
      // Called for each character typed
    });

    it("calls handleSearch when form is submitted", async () => {
      const user = userEvent.setup();
      render(<ZipCodeSearch {...defaultProps} zipCode="10001" />);

      const form = screen
        .getByRole("button", { name: /search vehicles/i })
        .closest("form");
      if (form) {
        // Simulate form submission via fireEvent since user-event form submission has JSDOM issues
        fireEvent.submit(form);
      }

      expect(defaultProps.handleSearch).toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("displays error message when provided", () => {
      const errorMessage = "Invalid ZIP code";
      render(<ZipCodeSearch {...defaultProps} error={errorMessage} />);

      // Use getAllByText since error appears in multiple places
      const errorElements = screen.getAllByText(errorMessage);
      expect(errorElements.length).toBeGreaterThan(0);
    });

    it("shows validation hint for invalid ZIP", async () => {
      const user = userEvent.setup();
      render(<ZipCodeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText("Enter ZIP code");
      await user.type(input, "99999");

      expect(screen.getByText("No vehicles in that area")).toBeInTheDocument();
    });
  });

  describe("Autocomplete Functionality", () => {
    it("shows autocomplete options when clicked", async () => {
      const user = userEvent.setup();
      render(<ZipCodeSearch {...defaultProps} />);

      const input = screen.getByPlaceholderText("Enter ZIP code");
      await user.click(input);

      // Should show some ZIP code options from the constants
      expect(screen.getByText("10001")).toBeInTheDocument();
    });
  });
});
