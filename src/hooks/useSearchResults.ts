import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { VEHICLES, SORT_OPTIONS } from "../constants";
import { Filters, SortOptionValue } from "../types";

const INITIAL_FILTERS: Filters = { make: [], color: [] };

export const useSearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [sortOption, setSortOption] = useState<SortOptionValue>(
    SORT_OPTIONS[0].value
  );
  const [resultsError, setResultsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Get zipcode from URL params
  const zipCode = searchParams.get("zipcode") || "";

  // Get vehicles for current ZIP code (before other filters)
  const zipCodeVehicles = useMemo(() => {
    if (!zipCode) return VEHICLES;
    return VEHICLES.filter((v) => v.zipCode === zipCode);
  }, [zipCode]);

  // Available options for filters with counts
  const availableMakes = useMemo(() => {
    const makes = new Set(zipCodeVehicles.map((v) => v.make));

    return Array.from(makes)
      .map((make) => {
        // Apply color filters to get accurate count for this make
        let vehiclesForCount = [...zipCodeVehicles];
        if (filters.color.length > 0) {
          vehiclesForCount = vehiclesForCount.filter((v) =>
            filters.color.includes(v.color)
          );
        }

        const count = vehiclesForCount.filter((v) => v.make === make).length;
        return { name: make, count };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [zipCodeVehicles, filters.color]);

  const availableColors = useMemo(() => {
    const colors = new Set(zipCodeVehicles.map((v) => v.color));

    return Array.from(colors)
      .map((color) => {
        // Apply make filters to get accurate count for this color
        let vehiclesForCount = [...zipCodeVehicles];
        if (filters.make.length > 0) {
          vehiclesForCount = vehiclesForCount.filter((v) =>
            filters.make.includes(v.make)
          );
        }

        const count = vehiclesForCount.filter((v) => v.color === color).length;
        return { name: color, count };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [zipCodeVehicles, filters.make]);

  // Process and filter vehicles
  const processedVehicles = useMemo(() => {
    let filtered = [...VEHICLES];

    // Filter by zipcode from URL first
    if (zipCode) {
      filtered = filtered.filter((v) => v.zipCode === zipCode);
    }

    // Apply filters
    if (filters.make.length > 0) {
      filtered = filtered.filter((v) => filters.make.includes(v.make));
    }
    if (filters.color.length > 0) {
      filtered = filtered.filter((v) => filters.color.includes(v.color));
    }

    // Set error if no results after filtering
    if (filtered.length === 0) {
      setResultsError(
        "No vehicles found in this area. Try a different ZIP code or adjust your filters."
      );
    } else {
      setResultsError(null);
    }

    // Apply sorting
    switch (sortOption) {
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "make":
        filtered.sort((a, b) => a.make.localeCompare(b.make));
        break;
      default:
        break;
    }

    return filtered;
  }, [filters, sortOption, zipCode]);

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const goToNewSearch = useCallback(() => {
    navigate("/");
  }, [navigate]);

  // Redirect to home if no zipcode in URL
  useEffect(() => {
    if (!zipCode) {
      navigate("/");
    }
  }, [zipCode, navigate]);

  // When zipcode changes via URL, reset filters/sort and show a brief loader
  useEffect(() => {
    // Clear any user-selected filters/sort when the location (zipcode) changes
    setFilters(INITIAL_FILTERS);
    setSortOption(SORT_OPTIONS[0].value);

    // Fake loading state for nicer UX when ZIP changes
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [zipCode]);

  return {
    zipCode,
    processedVehicles,
    resultsError,
    isLoading,
    filters,
    setFilters,
    sortOption,
    setSortOption,
    availableMakes,
    availableColors,
    clearFilters,
    goToNewSearch,
  };
};
