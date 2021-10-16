import { Paper, Typography } from "@mui/material";
import React from "react";

const Notifications = () => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h4">You have no new notifications.</Typography>
    </Paper>
  );
};

export default Notifications;
