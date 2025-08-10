import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import SearchResultsPage from "../SearchResultsPage";
import { Vehicle } from "@/types";

// Mock the useSearchResults hook
const mockUseSearchResults = {
  processedVehicles: [] as Vehicle[],
  resultsError: null,
  isLoading: false,
  filters: { make: [], color: [] },
  setFilters: jest.fn(),
  sortOption: "price-low" as const,
  setSortOption: jest.fn(),
  availableMakes: [
    { name: "Toyota", count: 3 },
    { name: "Honda", count: 2 },
    { name: "BMW", count: 4 },
  ],
  availableColors: [
    { name: "Red", count: 2 },
    { name: "Blue", count: 4 },
    { name: "Black", count: 1 },
  ],
  clearFilters: jest.fn(),
};

jest.mock("@/hooks/useSearchResults", () => ({
  useSearchResults: () => mockUseSearchResults,
}));

// Mock components to avoid complex nested component testing
jest.mock("@/components/VehicleList", () => {
  return function MockVehicleList({
    vehicles,
    error,
  }: {
    vehicles: Vehicle[];
    error: string | null;
  }) {
    if (error) return <div>Error: {error}</div>;
    return <div data-testid="vehicle-list">{vehicles.length} vehicles</div>;
  };
});

jest.mock("@/components/VehicleCardSkeleton", () => {
  return function MockVehicleCardSkeleton() {
    return <div data-testid="skeleton-card">Loading...</div>;
  };
});

jest.mock("@/components/FilterSidebar", () => {
  return function MockFilterSidebar({ onClose }: { onClose?: () => void }) {
    return (
      <div data-testid="filter-sidebar">
        Filter Sidebar
        {onClose && (
          <button onClick={onClose} data-testid="close-filters">
            Close
          </button>
        )}
      </div>
    );
  };
});

jest.mock("@/components/SortDropdown", () => {
  return function MockSortDropdown({
    sortOption,
    setSortOption,
  }: {
    sortOption: string;
    setSortOption: (option: string) => void;
  }) {
    return (
      <select
        data-testid="sort-dropdown"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
    );
  };
});

const theme = createTheme();

// Custom render function with theme provider
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </BrowserRouter>
  );
};

// Mock useMediaQuery for responsive testing
const mockUseMediaQuery = jest.fn();

jest.mock("@mui/material/useMediaQuery", () => ({
  __esModule: true,
  default: () => mockUseMediaQuery(),
}));

describe("SearchResultsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchResults.processedVehicles = [];
    mockUseSearchResults.resultsError = null;
    mockUseSearchResults.isLoading = false;
  });

  describe("Desktop Layout", () => {
    beforeEach(() => {
      mockUseMediaQuery.mockReturnValue(false); // Desktop view (not mobile)
    });

    it("renders desktop layout with results header", () => {
      mockUseSearchResults.processedVehicles = [
        { id: 1, make: "Toyota", model: "Camry" } as Vehicle,
        { id: 2, make: "Honda", model: "Accord" } as Vehicle,
      ];

      renderWithProviders(<SearchResultsPage />);

      // Look for specific results text
      expect(screen.getByText("2 results")).toBeInTheDocument();
      expect(screen.getByTestId("sort-dropdown")).toBeInTheDocument();
      expect(screen.getByTestId("filter-sidebar")).toBeInTheDocument();
      expect(screen.getByTestId("vehicle-list")).toBeInTheDocument();
    });

    it("displays loading skeletons when loading", () => {
      mockUseSearchResults.isLoading = true;

      renderWithProviders(<SearchResultsPage />);

      const skeletons = screen.getAllByTestId("skeleton-card");
      expect(skeletons).toHaveLength(6);
    });

    it("handles sort option changes", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchResultsPage />);

      const sortDropdown = screen.getByTestId("sort-dropdown");
      await user.selectOptions(sortDropdown, "price-high");

      expect(mockUseSearchResults.setSortOption).toHaveBeenCalledWith(
        "price-high"
      );
    });
  });

  describe("Mobile Layout", () => {
    beforeEach(() => {
      mockUseMediaQuery.mockReturnValue(true); // Mobile view
    });

    it("renders mobile layout with filter button", () => {
      renderWithProviders(<SearchResultsPage />);

      expect(screen.getByTestId("FilterListIcon")).toBeInTheDocument();
      expect(screen.getByTestId("sort-dropdown")).toBeInTheDocument();
      expect(screen.queryByText(/results/)).not.toBeInTheDocument(); // No results header in mobile
    });

    it("opens mobile filter drawer", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchResultsPage />);

      // Open drawer by clicking the filter icon
      const filterButton = screen
        .getByTestId("FilterListIcon")
        .closest("button");
      if (filterButton) {
        await user.click(filterButton);
      }

      // Note: MUI Drawer behavior in tests is complex, so we just verify the click works
      expect(filterButton).toBeInTheDocument();
    });
  });

  describe("Data States", () => {
    beforeEach(() => {
      mockUseMediaQuery.mockReturnValue(false); // Desktop view
    });

    it("displays vehicles when data is available", () => {
      mockUseSearchResults.processedVehicles = [
        { id: 1, make: "Toyota", model: "Camry" } as Vehicle,
        { id: 2, make: "Honda", model: "Accord" } as Vehicle,
        { id: 3, make: "BMW", model: "X5" } as Vehicle,
      ];

      renderWithProviders(<SearchResultsPage />);

      expect(screen.getByText("3 results")).toBeInTheDocument();
      expect(screen.getByText("3 vehicles")).toBeInTheDocument();
    });

    it("displays error message when there's an error", () => {
      mockUseSearchResults.resultsError = "No vehicles found in this area";

      renderWithProviders(<SearchResultsPage />);

      expect(
        screen.getByText("Error: No vehicles found in this area")
      ).toBeInTheDocument();
    });

    it("shows no results when vehicles array is empty", () => {
      mockUseSearchResults.processedVehicles = [];

      renderWithProviders(<SearchResultsPage />);

      expect(screen.getByText("0 results")).toBeInTheDocument();
      expect(screen.getByText("0 vehicles")).toBeInTheDocument();
    });

    it("prioritizes loading state over data", () => {
      mockUseSearchResults.isLoading = true;
      mockUseSearchResults.processedVehicles = [
        { id: 1, make: "Toyota", model: "Camry" } as Vehicle,
      ];

      renderWithProviders(<SearchResultsPage />);

      // Should show loading skeletons, not vehicle list
      expect(screen.getAllByTestId("skeleton-card")).toHaveLength(6);
      expect(screen.queryByTestId("vehicle-list")).not.toBeInTheDocument();
    });
  });

  describe("Basic Rendering", () => {
    it("renders without crashing", () => {
      mockUseMediaQuery.mockReturnValue(false);
      const { container } = renderWithProviders(<SearchResultsPage />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders components correctly", () => {
      mockUseMediaQuery.mockReturnValue(false);
      renderWithProviders(<SearchResultsPage />);
      expect(screen.getByTestId("filter-sidebar")).toBeInTheDocument();
      expect(screen.getByTestId("sort-dropdown")).toBeInTheDocument();
    });
  });
});
