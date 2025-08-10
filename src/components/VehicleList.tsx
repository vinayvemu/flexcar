import React from "react";
import { Vehicle } from "@/types";
import VehicleCard from "@/components/VehicleCard";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Grid2, Paper, Typography } from "@mui/material";

interface VehicleListProps {
  vehicles: Vehicle[];
  error: string | null;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, error }) => {
  if (error) {
    return (
      <Paper sx={{ p: 5, textAlign: "center" }}>
        <ErrorOutlineIcon color="error" sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="h6" fontWeight={600}>
          No Results Found
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {error}
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid2 container spacing={3}>
      {vehicles.map((vehicle) => (
        <Grid2 key={vehicle.id} size={{ xs: 12, md: 6, lg: 4 }}>
          <VehicleCard vehicle={vehicle} />
        </Grid2>
      ))}
    </Grid2>
  );
};

export default VehicleList;
