import React from "react";
import { render, screen } from "@testing-library/react";
import VehicleCard from "../VehicleCard";
import { Vehicle } from "@/types";

// Mock data
const mockVehicle: Vehicle = {
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
};

const mockExpensiveVehicle: Vehicle = {
  ...mockVehicle,
  id: 2,
  make: "BMW",
  model: "X5",
  price: 75000,
  mileage: 15000,
};

const mockHighMileageVehicle: Vehicle = {
  ...mockVehicle,
  id: 3,
  make: "Honda",
  model: "Civic",
  mileage: 150000,
  price: 12000,
};

describe("VehicleCard", () => {
  describe("Core Information Display", () => {
    it("renders vehicle information correctly", () => {
      render(<VehicleCard vehicle={mockVehicle} />);

      expect(screen.getByText("2021 • Silver")).toBeInTheDocument();
      expect(screen.getByText("Toyota Camry")).toBeInTheDocument();
      expect(screen.getByText("LE")).toBeInTheDocument();
      expect(screen.getByText("$24,000")).toBeInTheDocument();
      expect(screen.getByText("25,000 mi")).toBeInTheDocument();
    });

    it("displays vehicle image with correct alt text", () => {
      render(<VehicleCard vehicle={mockVehicle} />);

      const image = screen.getByAltText("Toyota Camry");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "https://example.com/camry.jpg");
    });
  });

  describe("Data Formatting", () => {
    it("formats currency correctly for different price ranges", () => {
      const { rerender } = render(<VehicleCard vehicle={mockVehicle} />);
      expect(screen.getByText("$24,000")).toBeInTheDocument();

      rerender(<VehicleCard vehicle={mockExpensiveVehicle} />);
      expect(screen.getByText("$75,000")).toBeInTheDocument();

      rerender(<VehicleCard vehicle={mockHighMileageVehicle} />);
      expect(screen.getByText("$12,000")).toBeInTheDocument();
    });

    it("formats mileage correctly", () => {
      const { rerender } = render(<VehicleCard vehicle={mockVehicle} />);
      expect(screen.getByText("25,000 mi")).toBeInTheDocument();

      rerender(<VehicleCard vehicle={mockHighMileageVehicle} />);
      expect(screen.getByText("150,000 mi")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles zero values correctly", () => {
      const zeroValuesVehicle = { ...mockVehicle, mileage: 0, price: 0 };
      render(<VehicleCard vehicle={zeroValuesVehicle} />);

      expect(screen.getByText("0 mi")).toBeInTheDocument();
      expect(screen.getByText("$0")).toBeInTheDocument();
    });

    it("handles missing image URL gracefully", () => {
      const vehicleWithoutImage = { ...mockVehicle, imageUrl: "" };
      render(<VehicleCard vehicle={vehicleWithoutImage} />);

      const image = screen.getByAltText("Toyota Camry");
      expect(image.getAttribute("src")).toBeFalsy();
    });
  });
});
