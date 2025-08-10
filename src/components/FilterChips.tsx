import React from "react";
import { Chip, Typography } from "@mui/material";
import { Filters } from "../types";
import { FilterChipsContainer } from "../styles/StyledComponents";

interface FilterChipsProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const FilterChips: React.FC<FilterChipsProps> = ({ filters, setFilters }) => {
  const handleDeleteFilter = (category: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item !== value),
    }));
  };

  const hasActiveFilters = filters.make.length > 0 || filters.color.length > 0;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <FilterChipsContainer>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontWeight: 500 }}
      >
        Filters ({filters.make.length + filters.color.length}):
      </Typography>

      {filters.make.map((make) => (
        <Chip
          key={`make-${make}`}
          label={make}
          onDelete={() => handleDeleteFilter("make", make)}
          size="small"
          variant="outlined"
          color="primary"
        />
      ))}

      {filters.color.map((color) => (
        <Chip
          key={`color-${color}`}
          label={color}
          onDelete={() => handleDeleteFilter("color", color)}
          size="small"
          variant="outlined"
          color="primary"
        />
      ))}
    </FilterChipsContainer>
  );
};

export default FilterChips;
