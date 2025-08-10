import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterSortSidebar from "../FilterSortSidebar";

const mockSetFilters = jest.fn();
const mockClearFilters = jest.fn();

const defaultProps = {
  filters: { make: [], color: [] },
  setFilters: mockSetFilters,
  availableMakes: ["Toyota", "Honda", "BMW", "Ford"],
  availableColors: ["Red", "Blue", "Black", "White", "Silver"],
  clearFilters: mockClearFilters,
};

describe("FilterSortSidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders filter sidebar with title and available options", () => {
      render(<FilterSortSidebar {...defaultProps} />);

      expect(screen.getByText("Filters (0)")).toBeInTheDocument();
      expect(screen.getByText("Make")).toBeInTheDocument();
      expect(screen.getByText("Color")).toBeInTheDocument();

      // Check available makes
      expect(
        screen.getByRole("checkbox", { name: "Toyota" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: "Honda" })
      ).toBeInTheDocument();
      expect(screen.getByRole("checkbox", { name: "BMW" })).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: "Ford" })
      ).toBeInTheDocument();

      // Check available colors
      expect(screen.getByRole("checkbox", { name: "Red" })).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: "Blue" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: "Black" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: "White" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: "Silver" })
      ).toBeInTheDocument();
    });

    it("shows correct filter count when filters are active", () => {
      render(
        <FilterSortSidebar
          {...defaultProps}
          filters={{ make: ["Toyota", "Honda"], color: ["Red"] }}
        />
      );

      expect(screen.getByText("Filters (3)")).toBeInTheDocument();
      expect(screen.getByText("Active filters")).toBeInTheDocument();
      expect(screen.getByText("Clear all")).toBeInTheDocument();
    });
  });

  describe("Filter Selection", () => {
    it("calls setFilters when make checkbox is clicked", async () => {
      const user = userEvent.setup();
      render(<FilterSortSidebar {...defaultProps} />);

      const toyotaCheckbox = screen.getByRole("checkbox", { name: "Toyota" });
      await user.click(toyotaCheckbox);

      expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));

      // Test the function passed to setFilters
      const setFiltersCall = mockSetFilters.mock.calls[0][0];
      const previousState = { make: [], color: [] };
      const newState = setFiltersCall(previousState);

      expect(newState).toEqual({
        make: ["Toyota"],
        color: [],
      });
    });

    it("calls setFilters when color checkbox is clicked", async () => {
      const user = userEvent.setup();
      render(<FilterSortSidebar {...defaultProps} />);

      const redCheckbox = screen.getByRole("checkbox", { name: "Red" });
      await user.click(redCheckbox);

      expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));

      // Test the function passed to setFilters
      const setFiltersCall = mockSetFilters.mock.calls[0][0];
      const previousState = { make: [], color: [] };
      const newState = setFiltersCall(previousState);

      expect(newState).toEqual({
        make: [],
        color: ["Red"],
      });
    });

    it("removes filter when already selected checkbox is clicked", async () => {
      const user = userEvent.setup();
      render(
        <FilterSortSidebar
          {...defaultProps}
          filters={{ make: ["Toyota", "Honda"], color: [] }}
        />
      );

      const toyotaCheckbox = screen.getByRole("checkbox", { name: "Toyota" });
      expect(toyotaCheckbox).toBeChecked();

      await user.click(toyotaCheckbox);

      expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));

      // Test the function passed to setFilters
      const setFiltersCall = mockSetFilters.mock.calls[0][0];
      const previousState = { make: ["Toyota", "Honda"], color: [] };
      const newState = setFiltersCall(previousState);

      expect(newState).toEqual({
        make: ["Honda"],
        color: [],
      });
    });

    it("shows correct checked state for selected filters", () => {
      render(
        <FilterSortSidebar
          {...defaultProps}
          filters={{ make: ["Toyota", "BMW"], color: ["Red", "Blue"] }}
        />
      );

      // Check selected makes
      expect(screen.getByRole("checkbox", { name: "Toyota" })).toBeChecked();
      expect(screen.getByRole("checkbox", { name: "BMW" })).toBeChecked();
      expect(screen.getByRole("checkbox", { name: "Honda" })).not.toBeChecked();
      expect(screen.getByRole("checkbox", { name: "Ford" })).not.toBeChecked();

      // Check selected colors
      expect(screen.getByRole("checkbox", { name: "Red" })).toBeChecked();
      expect(screen.getByRole("checkbox", { name: "Blue" })).toBeChecked();
      expect(screen.getByRole("checkbox", { name: "Black" })).not.toBeChecked();
      expect(screen.getByRole("checkbox", { name: "White" })).not.toBeChecked();
      expect(
        screen.getByRole("checkbox", { name: "Silver" })
      ).not.toBeChecked();
    });
  });

  describe("Active Filter Chips", () => {
    it("displays filter chips when filters are active", () => {
      render(
        <FilterSortSidebar
          {...defaultProps}
          filters={{ make: ["Toyota", "Honda"], color: ["Red"] }}
        />
      );

      expect(screen.getByText("Active filters")).toBeInTheDocument();

      // Check chips are displayed
      const toyotaChip = screen.getAllByText("Toyota")[0]; // One in checkbox, one in chip
      const hondaChip = screen.getAllByText("Honda")[0];
      const redChip = screen.getAllByText("Red")[0];

      expect(toyotaChip).toBeInTheDocument();
      expect(hondaChip).toBeInTheDocument();
      expect(redChip).toBeInTheDocument();
    });

    it("shows 'Show more' button when more than 3 filters", () => {
      render(
        <FilterSortSidebar
          {...defaultProps}
          filters={{ make: ["Toyota", "Honda", "BMW"], color: ["Red", "Blue"] }}
        />
      );

      expect(screen.getByText("Show 2 more")).toBeInTheDocument();
    });

    it("expands to show all chips when 'Show more' is clicked", async () => {
      const user = userEvent.setup();
      render(
        <FilterSortSidebar
          {...defaultProps}
          filters={{ make: ["Toyota", "Honda", "BMW", "Ford"], color: ["Red"] }}
        />
      );

      const showMoreButton = screen.getByText("Show 2 more");
      await user.click(showMoreButton);

      expect(screen.getByText("Show less")).toBeInTheDocument();
    });

    it("deletes chip when delete button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <FilterSortSidebar
          {...defaultProps}
          filters={{ make: ["Toyota"], color: ["Red"] }}
        />
      );

      // Find all delete buttons (CancelIcon)
      const deleteIcons = screen.getAllByTestId("CancelIcon");
      expect(deleteIcons.length).toBeGreaterThan(0);

      // Click the first delete button
      await user.click(deleteIcons[0]);

      expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("Clear Filters", () => {
    it("calls clearFilters when clear all button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <FilterSortSidebar
          {...defaultProps}
          filters={{ make: ["Toyota"], color: ["Red"] }}
        />
      );

      const clearButton = screen.getByText("Clear all");
      await user.click(clearButton);

      expect(mockClearFilters).toHaveBeenCalledTimes(1);
    });

    it("does not show clear button when no filters are active", () => {
      render(<FilterSortSidebar {...defaultProps} />);

      expect(screen.queryByText("Clear all")).not.toBeInTheDocument();
      expect(screen.queryByText("Active filters")).not.toBeInTheDocument();
    });
  });

  describe("Accordion Behavior", () => {
    it("renders expandable sections for Make and Color", () => {
      render(<FilterSortSidebar {...defaultProps} />);

      // Check for expand icons
      const expandIcons = screen.getAllByTestId("ExpandMoreIcon");
      expect(expandIcons.length).toBeGreaterThanOrEqual(2); // At least Make and Color sections
    });
  });
});
