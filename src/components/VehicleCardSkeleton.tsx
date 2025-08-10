import React from "react";
import {
  Card,
  CardContent,
  Skeleton,
  Box,
  Stack,
  Divider,
} from "@mui/material";

const VehicleCardSkeleton: React.FC = () => {
  return (
    <Card
      elevation={3}
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Skeleton variant="rectangular" height={192} animation="wave" />
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Box flexGrow={1}>
          <Skeleton variant="text" width={120} height={18} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="80%" height={24} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width={160} height={18} />
        </Box>
        <Divider sx={{ my: 1.5 }} />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Skeleton variant="text" width={90} height={28} />
          <Skeleton variant="text" width={70} height={18} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default VehicleCardSkeleton;
