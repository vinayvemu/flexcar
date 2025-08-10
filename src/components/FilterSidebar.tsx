import React, { useState, useMemo } from "react";
import { Filters } from "@/types";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Stack,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

interface FilterSidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  availableMakes: string[];
  availableColors: string[];
  clearFilters: () => void;
  onClose?: () => void;
}

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <Accordion defaultExpanded disableGutters>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography fontWeight={600}>{title}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Box display="flex" flexDirection="column" gap={1}>
        {children}
      </Box>
    </AccordionDetails>
  </Accordion>
);

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  availableMakes,
  availableColors,
  clearFilters,
  onClose,
}) => {
  const [showAllChips, setShowAllChips] = useState(false);

  const handleFilterChange = (category: keyof Filters, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[category];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];
      return { ...prev, [category]: newValues };
    });
  };

  const handleDeleteFilter = (category: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item !== value),
    }));
  };

  const hasActiveFilters = filters.make.length > 0 || filters.color.length > 0;

  const allFilterChips = useMemo(() => {
    const chips = [];
    filters.make.forEach((make) => {
      chips.push({
        category: "make" as keyof Filters,
        value: make,
        label: make,
      });
    });
    filters.color.forEach((color) => {
      chips.push({
        category: "color" as keyof Filters,
        value: color,
        label: color,
      });
    });
    return chips;
  }, [filters]);

  const visibleChips = showAllChips
    ? allFilterChips
    : allFilterChips.slice(0, 3);
  const remainingCount = allFilterChips.length - 3;

  return (
    <Paper
      sx={{
        borderRadius: 2,
        border: "1px solid rgba(0,0,0,0.08)",
        backgroundColor: "#fff",
        maxHeight: { lg: "83vh" },
        overflowY: { lg: "auto" },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        p={2}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <FilterListIcon color="action" fontSize="small" />
          <Typography variant="h6" fontWeight={700}>
            Filters ({allFilterChips.length})
          </Typography>
        </Stack>
        {onClose && (
          <IconButton aria-label="Close filters" size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </Stack>

      {hasActiveFilters && (
        <Box mb={2} p={2}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Active filters
            </Typography>
            <Button
              onClick={clearFilters}
              size="small"
              color="primary"
              sx={{ fontSize: "0.75rem", minWidth: "auto", px: 1 }}
            >
              Clear all
            </Button>
          </Stack>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mb: 1,
            }}
          >
            {visibleChips.map((chip, index) => (
              <Chip
                key={`${chip.category}-${chip.value}`}
                label={chip.label}
                onDelete={() => handleDeleteFilter(chip.category, chip.value)}
                size="small"
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>

          {allFilterChips.length > 3 && (
            <Button
              onClick={() => setShowAllChips(!showAllChips)}
              size="small"
              color="primary"
              sx={{ fontSize: "0.75rem", minWidth: "auto", px: 0 }}
            >
              {showAllChips ? "Show less" : `Show ${remainingCount} more`}
            </Button>
          )}
        </Box>
      )}

      <FilterSection title="Make">
        <FormGroup>
          {availableMakes.map((make) => (
            <FormControlLabel
              key={make}
              control={
                <Checkbox
                  checked={filters.make.includes(make)}
                  onChange={() => handleFilterChange("make", make)}
                />
              }
              label={make}
            />
          ))}
        </FormGroup>
      </FilterSection>

      <FilterSection title="Color">
        <FormGroup>
          {availableColors.map((color) => (
            <FormControlLabel
              key={color}
              control={
                <Checkbox
                  checked={filters.color.includes(color)}
                  onChange={() => handleFilterChange("color", color)}
                />
              }
              label={color}
            />
          ))}
        </FormGroup>
      </FilterSection>
    </Paper>
  );
};

export default FilterSidebar;
