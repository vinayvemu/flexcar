import React, { useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Autocomplete,
} from "@mui/material";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { VEHICLES } from "@/constants";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const currentZip = searchParams.get("zipcode") || "";
  const isHome = location.pathname === "/";

  const [dialogOpen, setDialogOpen] = useState(false);
  const [zipValue, setZipValue] = useState<string>(currentZip);

  const { zipOptions, zipSet, zipToCount } = useMemo(() => {
    const counts = VEHICLES.reduce((acc, v) => {
      acc[v.zipCode] = (acc[v.zipCode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const zips = Object.keys(counts).sort();
    return { zipOptions: zips, zipSet: new Set(zips), zipToCount: counts };
  }, []);

  const onSubmitNewZip = () => {
    if (!/^\d{5}$/.test(zipValue) || !zipSet.has(zipValue)) {
      return;
    }
    setDialogOpen(false);
    navigate(`/search-results?zipcode=${zipValue}`);
  };

  return (
    <AppBar position="sticky" color="primary" elevation={2}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <DirectionsCarFilledIcon fontSize="large" />
          <Typography variant="h6" component="div" fontWeight={700}>
            Vehicle Finder
          </Typography>
        </Stack>

        {!(isHome && !currentZip) && (
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            onClick={() => {
              setZipValue(currentZip);
              setDialogOpen(true);
            }}
            startIcon={<PlaceOutlinedIcon />}
            sx={{ textTransform: "none", bgcolor: "rgba(255,255,255,0.08)" }}
          >
            {currentZip ? currentZip : "Set ZIP"}
          </Button>
        )}
      </Toolbar>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Select ZIP code</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <Autocomplete
              options={zipOptions}
              value={zipValue}
              onChange={(_, value) => setZipValue(value ?? "")}
              inputValue={zipValue}
              onInputChange={(_, value) => setZipValue(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Enter ZIP code"
                  inputProps={{ ...params.inputProps, maxLength: 5 }}
                  helperText={
                    zipValue && !zipSet.has(zipValue)
                      ? "No vehicles in that area"
                      : ""
                  }
                  error={Boolean(zipValue && !zipSet.has(zipValue))}
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
              variant="contained"
              onClick={onSubmitNewZip}
              disabled={!zipSet.has(zipValue)}
            >
              Show results
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </AppBar>
  );
};

export default Header;
