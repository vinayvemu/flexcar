import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import { AppContainer } from "@/styles/StyledComponents";

const AppLayout: React.FC = () => {
  return (
    <AppContainer>
      <Header />
      <Outlet />
    </AppContainer>
  );
};

export default AppLayout;
