import React from "react";
import { Box, Container, Typography } from "@mui/material";

export function OtherNavbar(): React.JSX.Element {
  return (
    <Box component="nav" className="other-navbar">
      <Container>
        <Typography variant="h6">Other Navbar</Typography>
      </Container>
    </Box>
  );
}
