import React from "react";
import { render, screen } from "@testing-library/react";
import VehicleList from "../VehicleList";
import { Vehicle } from "@/types";

const mockVehicles: Vehicle[] = [
  {
    id: 1,
    make: "Toyota",
    model: "Camry",
    trim: "LE",
    year: 2021,
    color: "Silver",
    mileage: 25000,
    price: 24000,
    imageUrl: "https://example.com/camry.jpg",
    zipCode: "10001",
  },
  {
    id: 2,
    make: "Honda",
    model: "Accord",
    trim: "Sport",
    year: 2022,
    color: "Black",
    mileage: 15000,
    price: 28000,
    imageUrl: "https://example.com/accord.jpg",
    zipCode: "10001",
  },
];

describe("VehicleList", () => {
  describe("Vehicle Display", () => {
    it("renders list of vehicles correctly", () => {
      render(<VehicleList vehicles={mockVehicles} error={null} />);

      // Check that both vehicles are rendered
      expect(screen.getByText("Toyota Camry")).toBeInTheDocument();
      expect(screen.getByText("Honda Accord")).toBeInTheDocument();
      expect(screen.getByText("$24,000")).toBeInTheDocument();
      expect(screen.getByText("$28,000")).toBeInTheDocument();
    });

    it("renders empty list without errors", () => {
      render(<VehicleList vehicles={[]} error={null} />);

      // Should render empty grid without crashing
      expect(screen.queryByText("No Results Found")).not.toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("displays error message when error is provided", () => {
      const errorMessage = "No vehicles found in this area";
      render(<VehicleList vehicles={[]} error={errorMessage} />);

      expect(screen.getByText("No Results Found")).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByTestId("ErrorOutlineIcon")).toBeInTheDocument();
    });

    it("prioritizes error display over vehicle list", () => {
      const errorMessage = "Something went wrong";
      render(<VehicleList vehicles={mockVehicles} error={errorMessage} />);

      // Should show error, not vehicles
      expect(screen.getByText("No Results Found")).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.queryByText("Toyota Camry")).not.toBeInTheDocument();
    });
  });
});
