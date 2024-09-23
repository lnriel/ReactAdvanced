import React from "react";
import { Link } from "react-router-dom";
import { Button, Box } from "@chakra-ui/react";

export const Navigation = () => {
  return (
    <Box display="flex" justifyContent="center" bg="#b7a4c4">
      <Button
        colorScheme="pink"
        variant="solid"
        as={Link}
        to="/"
        mt={10}
        mb={10}
      >
        All Events
      </Button>
    </Box>
  );
};
