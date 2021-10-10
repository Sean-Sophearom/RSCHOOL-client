import React from "react";
import { Paper, Typography } from "@mui/material";

const UnderConstruction = () => {
  return (
    <Paper sx={{ px: 4, py: 12 }}>
      <Typography variant="h2" align="center" sx={{ fontWeight: "bold" }}>
        This page is under construction. Please switch to another page. Thank you.
      </Typography>
    </Paper>
  );
};

export default UnderConstruction;
