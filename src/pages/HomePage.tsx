import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ZipCodeSearch from "../components/ZipCodeSearch";
import { MainContainer } from "../styles/StyledComponents";
import { VEHICLES } from "@/constants";

const HomePage: React.FC = () => {
  const [zipCode, setZipCode] = useState("");
  const [zipError, setZipError] = useState<string | null>(null);
  const navigate = useNavigate();

  const zipSet = useMemo(() => new Set(VEHICLES.map((v) => v.zipCode)), []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode.trim()) {
      setZipError("Please enter a ZIP code.");
      return;
    }
    if (!/^\d{5}$/.test(zipCode)) {
      setZipError("Please enter a valid 5-digit ZIP code.");
      return;
    }
    if (!zipSet.has(zipCode)) {
      setZipError("No vehicles in that area. Try another ZIP code.");
      return;
    }
    setZipError(null);
    // Navigating to search results with zipcode in query params
    navigate(`/search-results?zipcode=${zipCode}`);
  };

  return (
    <MainContainer>
      <ZipCodeSearch
        zipCode={zipCode}
        setZipCode={setZipCode}
        handleSearch={handleSearch}
        error={zipError}
      />
    </MainContainer>
  );
};

export default HomePage;
