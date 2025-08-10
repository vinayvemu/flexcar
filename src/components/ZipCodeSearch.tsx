import React, { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  TextField,
  Typography,
  Button,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { VEHICLES } from "@/constants";

interface ZipCodeSearchProps {
  zipCode: string;
  setZipCode: (zip: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  error: string | null;
}

const ZipCodeSearch: React.FC<ZipCodeSearchProps> = ({
  zipCode,
  setZipCode,
  handleSearch,
  error,
}) => {
  const [inputValue, setInputValue] = useState(zipCode);

  const { zipOptions, zipSet, zipToCount } = useMemo(() => {
    const counts = VEHICLES.reduce((acc, v) => {
      acc[v.zipCode] = (acc[v.zipCode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const zips = Object.keys(counts).sort();
    return {
      zipOptions: zips,
      zipSet: new Set(zips),
      zipToCount: counts,
    };
  }, []);

  const noVehiclesHint =
    inputValue.length == 5 && !zipSet.has(inputValue)
      ? "No vehicles in that area"
      : undefined;

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
    >
      <Paper
        sx={{ p: 4, width: "100%", maxWidth: 560, textAlign: "center" }}
        elevation={3}
      >
        <Typography variant="h4" fontWeight={800} mb={1}>
          Find Your Next Car
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Enter your ZIP code to see available vehicles near you.
        </Typography>
        <form onSubmit={handleSearch}>
          <Stack spacing={2}>
            <Autocomplete
              freeSolo
              options={zipOptions}
              value={zipCode}
              onChange={(_, value) => {
                const next = value ?? "";
                setZipCode(next);
                setInputValue(next);
              }}
              inputValue={inputValue}
              onInputChange={(_, value) => {
                setInputValue(value);
                setZipCode(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Enter ZIP code"
                  inputProps={{
                    ...params.inputProps,
                    maxLength: 5,
                    "aria-label": "ZIP Code",
                  }}
                  helperText={error || noVehiclesHint}
                  error={Boolean(error) || Boolean(noVehiclesHint)}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <span>{option}</span>
                    <Typography variant="caption" color="text.secondary">
                      {zipToCount[option]} vehicles
                    </Typography>
                  </Box>
                </li>
              )}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
            >
              Search Vehicles
            </Button>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default ZipCodeSearch;
