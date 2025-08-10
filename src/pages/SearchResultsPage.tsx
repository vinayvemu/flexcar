import React, { useState } from "react";
import {
  useTheme,
  useMediaQuery,
  Typography,
  IconButton,
  Drawer,
  CircularProgress,
  Box,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

import VehicleList from "@/components/VehicleList";
import VehicleCardSkeleton from "@/components/VehicleCardSkeleton";
import FilterSidebar from "@/components/FilterSidebar";
import SortDropdown from "@/components/SortDropdown";
import { useSearchResults } from "@/hooks/useSearchResults";
import {
  MainContainer,
  ResultsGrid,
  DesktopFiltersContainer,
  MobileDrawerContent,
  ResultsHeaderContainer,
  ResultsCountAndSort,
  FlexRow,
  ResultsScrollArea,
} from "@/styles/StyledComponents";

const SearchResultsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
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
  } = useSearchResults();

  return (
    <MainContainer>
      {isMobile && (
        <FlexRow
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 5,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(6px)",
            py: 1,
            mb: 1,
            justifyContent: "space-between",
          }}
        >
          <IconButton
            color="primary"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open filters"
            size="small"
          >
            <FilterListIcon />
          </IconButton>
          <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
        </FlexRow>
      )}

      {!isMobile && (
        <ResultsHeaderContainer>
          <ResultsCountAndSort>
            <Typography variant="h6" fontWeight={600}>
              {processedVehicles.length} results
            </Typography>
            <SortDropdown
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
          </ResultsCountAndSort>
        </ResultsHeaderContainer>
      )}

      <ResultsGrid>
        <DesktopFiltersContainer>
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            availableMakes={availableMakes}
            availableColors={availableColors}
            clearFilters={clearFilters}
          />
        </DesktopFiltersContainer>

        <ResultsScrollArea>
          {isLoading ? (
            <Box sx={{ px: 0.5 }}>
              <Box
                display="grid"
                gridTemplateColumns={{
                  xs: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }}
                gap={3}
              >
                {Array.from({ length: 6 }).map((_, idx) => (
                  <Box key={idx}>
                    <VehicleCardSkeleton />
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <VehicleList vehicles={processedVehicles} error={resultsError} />
          )}
        </ResultsScrollArea>
      </ResultsGrid>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { md: "none" } }}
      >
        <MobileDrawerContent role="presentation">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            availableMakes={availableMakes}
            availableColors={availableColors}
            clearFilters={clearFilters}
            onClose={() => setDrawerOpen(false)}
          />
        </MobileDrawerContent>
      </Drawer>
    </MainContainer>
  );
};

export default SearchResultsPage;
