import React from "react";
import { Vehicle } from "@/types";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Stack,
  Divider,
} from "@mui/material";

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatMileage = (miles: number) => {
    return `${miles.toLocaleString("en-US")} mi`;
  };

  return (
    <Card
      data-testid="vehicle-card"
      elevation={3}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.25s ease",
        cursor: "pointer",
        overflow: "hidden",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "rgba(0,0,0,0.06)",
        boxShadow: 1,
        "&:hover": {
          transform: "translateY(-2px) scale(1.02)",
          boxShadow: 6,
          "& .vehicle-image": {
            transform: "scale(1.1)",
          },
        },
      }}
    >
      <CardMedia
        component="img"
        height={192}
        image={vehicle.imageUrl}
        alt={`${vehicle.make} ${vehicle.model}`}
        className="vehicle-image"
        sx={{ transition: "transform 0.25s ease" }}
      />
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Box flexGrow={1}>
          <Typography variant="body2" color="text.secondary">
            {vehicle.year} • {vehicle.color}
          </Typography>
          <Typography variant="h6" fontWeight={700} mt={0.5}>
            {vehicle.make} {vehicle.model}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {vehicle.trim}
          </Typography>
        </Box>
        <Divider sx={{ my: 1.5 }} />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" color="primary" fontWeight={800}>
            {formatCurrency(vehicle.price)}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            {formatMileage(vehicle.mileage)}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
