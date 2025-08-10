import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterSidebar from "../FilterSidebar";
import { Filters } from "@/types";

// Mock data
const mockFilters: Filters = {
  make: ["Toyota", "Honda"],
  color: ["Red", "Blue"],
};

const mockAvailableMakes = [
  { name: "Toyota", count: 3 },
  { name: "Honda", count: 2 },
  { name: "BMW", count: 4 },
  { name: "Ford", count: 1 },
  { name: "Tesla", count: 5 },
];

const mockAvailableColors = [
  { name: "Red", count: 2 },
  { name: "Blue", count: 4 },
  { name: "Green", count: 3 },
  { name: "White", count: 6 },
  { name: "Black", count: 1 },
];

const defaultProps = {
  filters: mockFilters,
  setFilters: jest.fn(),
  availableMakes: mockAvailableMakes,
  availableColors: mockAvailableColors,
  clearFilters: jest.fn(),
};

describe("FilterSidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Core Functionality", () => {
    it("renders filter sections with correct count", () => {
      render(<FilterSidebar {...defaultProps} />);

      expect(screen.getByText("Filters (4)")).toBeInTheDocument();
      expect(screen.getByText("Make")).toBeInTheDocument();
      expect(screen.getByText("Color")).toBeInTheDocument();
      expect(screen.getByTestId("FilterListIcon")).toBeInTheDocument();
    });

    it("renders all available makes and colors as checkboxes", () => {
      render(<FilterSidebar {...defaultProps} />);

      mockAvailableMakes.forEach((makeOption) => {
        expect(
          screen.getByRole("checkbox", {
            name: `${makeOption.name} ${makeOption.count}`,
          })
        ).toBeInTheDocument();
      });

      mockAvailableColors.forEach((colorOption) => {
        expect(
          screen.getByRole("checkbox", {
            name: `${colorOption.name} ${colorOption.count}`,
          })
        ).toBeInTheDocument();
      });
    });

    it("shows selected filters as checked", () => {
      render(<FilterSidebar {...defaultProps} />);

      expect(screen.getByRole("checkbox", { name: "Toyota 3" })).toBeChecked();
      expect(screen.getByRole("checkbox", { name: "Honda 2" })).toBeChecked();
      expect(screen.getByRole("checkbox", { name: "Red 2" })).toBeChecked();
      expect(screen.getByRole("checkbox", { name: "Blue 4" })).toBeChecked();
      expect(screen.getByRole("checkbox", { name: "BMW 4" })).not.toBeChecked();
    });
  });

  describe("Filter Interactions", () => {
    it("adds filter when unchecked option is selected", async () => {
      const user = userEvent.setup();
      render(<FilterSidebar {...defaultProps} />);

      await user.click(screen.getByRole("checkbox", { name: "BMW 4" }));

      expect(defaultProps.setFilters).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it("removes filter when checked option is deselected", async () => {
      const user = userEvent.setup();
      render(<FilterSidebar {...defaultProps} />);

      await user.click(screen.getByRole("checkbox", { name: "Toyota 3" }));

      expect(defaultProps.setFilters).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it("clears all filters when clear button is clicked", async () => {
      const user = userEvent.setup();
      render(<FilterSidebar {...defaultProps} />);

      await user.click(screen.getByText("Clear all"));

      expect(defaultProps.clearFilters).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty filters gracefully", () => {
      const emptyProps = {
        ...defaultProps,
        filters: { make: [], color: [] },
      };
      render(<FilterSidebar {...emptyProps} />);

      expect(screen.getByText("Filters (0)")).toBeInTheDocument();
      mockAvailableMakes.forEach((makeOption) => {
        expect(
          screen.getByRole("checkbox", {
            name: `${makeOption.name} ${makeOption.count}`,
          })
        ).not.toBeChecked();
      });
    });

    it("handles empty available options", () => {
      const emptyOptionsProps = {
        ...defaultProps,
        availableMakes: [],
        availableColors: [],
      };
      render(<FilterSidebar {...emptyOptionsProps} />);

      expect(screen.getByText("Make")).toBeInTheDocument();
      expect(screen.getByText("Color")).toBeInTheDocument();
      // Should not crash even with empty arrays
    });
  });
});
