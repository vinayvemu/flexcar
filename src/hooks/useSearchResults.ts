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

  // Available options for filters
  const availableMakes = useMemo(() => {
    const makes = new Set(VEHICLES.map((v) => v.make));
    return Array.from(makes).sort();
  }, []);

  const availableColors = useMemo(() => {
    const colors = new Set(VEHICLES.map((v) => v.color));
    return Array.from(colors).sort();
  }, []);

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
