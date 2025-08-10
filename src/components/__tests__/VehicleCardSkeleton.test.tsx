import React from "react";
import { render } from "@testing-library/react";
import VehicleCardSkeleton from "../VehicleCardSkeleton";

describe("VehicleCardSkeleton", () => {
  it("renders skeleton loading state without errors", () => {
    const { container } = render(<VehicleCardSkeleton />);

    // Check that the component renders successfully
    expect(container.firstChild).toBeInTheDocument();

    // Check for MUI Card structure
    const card = container.querySelector(".MuiCard-root");
    expect(card).toBeInTheDocument();

    // Check for skeleton elements (MUI Skeleton components)
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("has correct card structure", () => {
    const { container } = render(<VehicleCardSkeleton />);

    // Verify card content structure
    const cardContent = container.querySelector(".MuiCardContent-root");
    expect(cardContent).toBeInTheDocument();

    // Check for divider
    const divider = container.querySelector(".MuiDivider-root");
    expect(divider).toBeInTheDocument();
  });
});
