import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Box } from "@chakra-ui/react";

export const Root = () => {
  const location = useLocation();

  const showNavigation = location.pathname.includes("events");
  return (
    <Box>
      {showNavigation && <Navigation />}
      <Outlet />
    </Box>
  );
};
