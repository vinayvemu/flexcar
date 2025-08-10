import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SortDropdown from "../SortDropdown";
import { SortOptionValue } from "@/types";

const mockSetSortOption = jest.fn();

const defaultProps = {
  sortOption: "price-low" as SortOptionValue,
  setSortOption: mockSetSortOption,
};

describe("SortDropdown", () => {
  beforeEach(() => {
    mockSetSortOption.mockClear();
  });

  describe("Core Functionality", () => {
    it("renders with correct initial value and label", () => {
      render(<SortDropdown {...defaultProps} />);

      expect(screen.getByRole("combobox")).toHaveTextContent(
        "Price: Low to High"
      );
      expect(screen.getByLabelText("Sort by")).toBeInTheDocument();
    });

    it("displays all sort options when opened", async () => {
      const user = userEvent.setup();
      render(<SortDropdown {...defaultProps} />);

      await user.click(screen.getByRole("combobox"));

      expect(screen.getByRole("listbox")).toBeInTheDocument();
      expect(screen.getByText("Price: High to Low")).toBeInTheDocument();
      expect(screen.getByText("Make (A-Z)")).toBeInTheDocument();
    });

    it("calls setSortOption when option is selected", async () => {
      const user = userEvent.setup();
      render(<SortDropdown {...defaultProps} />);

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByText("Price: High to Low"));

      expect(mockSetSortOption).toHaveBeenCalledWith("price-high");
    });

    it("updates display when sort option prop changes", () => {
      const { rerender } = render(<SortDropdown {...defaultProps} />);
      expect(screen.getByRole("combobox")).toHaveTextContent(
        "Price: Low to High"
      );

      rerender(
        <SortDropdown sortOption="make" setSortOption={mockSetSortOption} />
      );
      expect(screen.getByRole("combobox")).toHaveTextContent("Make (A-Z)");
    });
  });

  describe("Accessibility", () => {
    it("supports keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<SortDropdown {...defaultProps} />);

      const select = screen.getByRole("combobox");
      select.focus();

      await user.keyboard("{Enter}");
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(mockSetSortOption).toHaveBeenCalled();
    });

    it("has proper ARIA attributes", () => {
      render(<SortDropdown {...defaultProps} />);

      const select = screen.getByRole("combobox");
      expect(select).toHaveAttribute("aria-expanded", "false");
      expect(screen.getByLabelText("Sort by")).toBeInTheDocument();
    });
  });
});
