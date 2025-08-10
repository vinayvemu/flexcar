import React from "react";
import { FormControl, Select, MenuItem, InputLabel, Box } from "@mui/material";
import { SortOptionValue } from "../types";
import { SORT_OPTIONS } from "../constants";

interface SortDropdownProps {
  sortOption: SortOptionValue;
  setSortOption: React.Dispatch<React.SetStateAction<SortOptionValue>>;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  sortOption,
  setSortOption,
}) => {
  return (
    <Box sx={{ minWidth: 160 }}>
      <FormControl size="small" fullWidth>
        <InputLabel id="sort-label">Sort by</InputLabel>
        <Select
          labelId="sort-label"
          id="sort"
          label="Sort by"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOptionValue)}
        >
          {SORT_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SortDropdown;
