import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterChips from "../FilterChips";

const mockSetFilters = jest.fn();

const defaultProps = {
  filters: { make: [], color: [] },
  setFilters: mockSetFilters,
};

describe("FilterChips", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders nothing when no filters are active", () => {
      const { container } = render(<FilterChips {...defaultProps} />);
      expect(container.firstChild).toBeNull();
    });

    it("displays make filter chips", () => {
      render(
        <FilterChips
          {...defaultProps}
          filters={{ make: ["Toyota", "Honda"], color: [] }}
        />
      );

      expect(screen.getByText("Filters (2):")).toBeInTheDocument();
      expect(screen.getByText("Toyota")).toBeInTheDocument();
      expect(screen.getByText("Honda")).toBeInTheDocument();
    });

    it("displays color filter chips", () => {
      render(
        <FilterChips
          {...defaultProps}
          filters={{ make: [], color: ["Red", "Blue"] }}
        />
      );

      expect(screen.getByText("Filters (2):")).toBeInTheDocument();
      expect(screen.getByText("Red")).toBeInTheDocument();
      expect(screen.getByText("Blue")).toBeInTheDocument();
    });

    it("displays mixed filter chips with correct count", () => {
      render(
        <FilterChips
          {...defaultProps}
          filters={{
            make: ["Toyota", "BMW"],
            color: ["Red", "Black", "White"],
          }}
        />
      );

      expect(screen.getByText("Filters (5):")).toBeInTheDocument();

      // Make chips
      expect(screen.getByText("Toyota")).toBeInTheDocument();
      expect(screen.getByText("BMW")).toBeInTheDocument();

      // Color chips
      expect(screen.getByText("Red")).toBeInTheDocument();
      expect(screen.getByText("Black")).toBeInTheDocument();
      expect(screen.getByText("White")).toBeInTheDocument();
    });
  });

  describe("Filter Removal", () => {
    it("calls setFilters when make chip is deleted", async () => {
      const user = userEvent.setup();
      render(
        <FilterChips
          {...defaultProps}
          filters={{ make: ["Toyota", "Honda"], color: ["Red"] }}
        />
      );

      // Find and click delete button for Toyota chip
      const toyotaChip = screen.getByText("Toyota").closest(".MuiChip-root");
      const deleteButton = toyotaChip?.querySelector(
        '[data-testid="CancelIcon"]'
      );

      if (deleteButton) {
        await user.click(deleteButton);
      }

      expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));

      // Test the function passed to setFilters
      const setFiltersCall = mockSetFilters.mock.calls[0][0];
      const previousState = { make: ["Toyota", "Honda"], color: ["Red"] };
      const newState = setFiltersCall(previousState);

      expect(newState).toEqual({
        make: ["Honda"],
        color: ["Red"],
      });
    });

    it("calls setFilters when color chip is deleted", async () => {
      const user = userEvent.setup();
      render(
        <FilterChips
          {...defaultProps}
          filters={{ make: ["Toyota"], color: ["Red", "Blue"] }}
        />
      );

      // Find and click delete button for Red chip
      const redChip = screen.getByText("Red").closest(".MuiChip-root");
      const deleteButton = redChip?.querySelector('[data-testid="CancelIcon"]');

      if (deleteButton) {
        await user.click(deleteButton);
      }

      expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));

      // Test the function passed to setFilters
      const setFiltersCall = mockSetFilters.mock.calls[0][0];
      const previousState = { make: ["Toyota"], color: ["Red", "Blue"] };
      const newState = setFiltersCall(previousState);

      expect(newState).toEqual({
        make: ["Toyota"],
        color: ["Blue"],
      });
    });

    it("removes only the specific filter when multiple exist", async () => {
      const user = userEvent.setup();
      render(
        <FilterChips
          {...defaultProps}
          filters={{ make: ["Toyota", "Honda", "BMW"], color: [] }}
        />
      );

      // Click delete on Honda chip (middle one)
      const hondaChip = screen.getByText("Honda").closest(".MuiChip-root");
      const deleteButton = hondaChip?.querySelector(
        '[data-testid="CancelIcon"]'
      );

      if (deleteButton) {
        await user.click(deleteButton);
      }

      expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));

      // Test the function passed to setFilters
      const setFiltersCall = mockSetFilters.mock.calls[0][0];
      const previousState = { make: ["Toyota", "Honda", "BMW"], color: [] };
      const newState = setFiltersCall(previousState);

      expect(newState).toEqual({
        make: ["Toyota", "BMW"],
        color: [],
      });
    });
  });

  describe("Component Structure", () => {
    it("has proper accessibility and structure", () => {
      render(
        <FilterChips
          {...defaultProps}
          filters={{ make: ["Toyota"], color: ["Red"] }}
        />
      );

      // Check chips have proper structure
      const chips = screen.getAllByRole("button");
      expect(chips.length).toBeGreaterThan(0);

      // Check for filter count display
      expect(screen.getByText("Filters (2):")).toBeInTheDocument();
    });
  });
});
