import { renderHook, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useSearchResults } from "../useSearchResults";

// Mock react-router-dom
const mockNavigate = jest.fn();
const mockSearchParams = {
  get: jest.fn(() => ""),
};

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams],
}));

// Wrapper component for hook testing
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("useSearchResults", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams.get.mockReturnValue("");
  });

  describe("Core Functionality", () => {
    it("returns initial values correctly", () => {
      const { result } = renderHook(() => useSearchResults(), { wrapper });

      expect(result.current.zipCode).toBe("");
      expect(result.current.filters).toEqual({ make: [], color: [] });
      expect(result.current.sortOption).toBe("price-low");
      expect(result.current.isLoading).toBe(true); // Initially loading when zipcode is empty
      expect(result.current.availableMakes).toContain("Toyota");
      expect(result.current.availableColors).toContain("Red");
    });

    it("manages filters correctly", () => {
      const { result } = renderHook(() => useSearchResults(), { wrapper });

      act(() => {
        result.current.setFilters({ make: ["Toyota"], color: ["Red"] });
      });

      expect(result.current.filters).toEqual({
        make: ["Toyota"],
        color: ["Red"],
      });

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.filters).toEqual({ make: [], color: [] });
    });

    it("manages sort option correctly", () => {
      const { result } = renderHook(() => useSearchResults(), { wrapper });

      act(() => {
        result.current.setSortOption("price-high");
      });

      expect(result.current.sortOption).toBe("price-high");
    });
  });
});
