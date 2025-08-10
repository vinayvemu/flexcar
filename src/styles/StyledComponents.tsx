import styled from "styled-components";
import { Box, Paper, Container } from "@mui/material";

export const AppContainer = styled(Box)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const MainContainer = styled(Container)`
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px 0;
  @media (min-width: 768px) {
    padding: 24px 0;
  }
`;

export const SearchHeader = styled(Paper)`
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 12px;
    margin-bottom: 16px;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;

    & > * {
      justify-content: flex-start;
    }

    & > *:last-child {
      justify-content: flex-end;
    }
  }
`;

export const ResultsGrid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  align-items: start;
  flex: 1 1 auto;
  min-height: 0;

  @media (min-width: 1024px) {
    grid-template-columns: 286px 1fr;
    gap: 40px;
  }
`;

export const DesktopFiltersContainer = styled(Box)`
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    width: 286px;
    flex-shrink: 0;
    position: sticky;
    top: 32px;
    height: fit-content;
    max-height: calc(100vh - 64px);
    overflow: visible;
  }
`;

export const ResultsScrollArea = styled(Box)`
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  padding: 8px;
`;

export const MobileDrawerContent = styled(Box)`
  width: 100%;
  max-width: 320px;
  padding: 16px;

  @media (max-width: 480px) {
    width: calc(100vw - 32px);
    max-width: none;
  }
`;

export const ResultsHeaderContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    gap: 12px;
    margin-bottom: 16px;
  }
`;

export const ResultsCountAndSort = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const FilterChipsContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

export const FlexRow = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

export const FlexBetween = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 12px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
`;
