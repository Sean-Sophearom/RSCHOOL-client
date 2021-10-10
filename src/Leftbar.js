import { Button, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

//list items
import teacherListItems from "./components/leftbarListItem";
import studentListItems from "./studentPage/leftbarListItem";

//user context to render left bar accordingly
import { userContext } from "./userContext";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    transform: (props) => (props.openLeftbar ? "translateX(0)" : "translateX(-225px)"),
    top: 0,
    background: theme.palette.bg.light,
    transition: "all .35s ease",
    width: 225,
    minHeight: "100vh",
  },
}));

const Leftbar = (props) => {
  const classes = useStyles(props);
  const [items, setItems] = useState([]);
  const [user] = useContext(userContext);

  useEffect(() => (user?.accType === "teacher" ? setItems(teacherListItems) : setItems(studentListItems)), [user]);

  const handleClick = () => props.setOpenLeftbar(false);
  return (
    <Box className={classes.root}>
      <Toolbar />
      <List sx={{ p: 0 }}>
        {items.map((item, index) => (
          <Box key={index}>
            <Typography
              variant="subtitle2"
              sx={{ textTransform: "uppercase", px: 2, pt: 3, pb: 0.5, display: "block" }}
            >
              {item.title}
            </Typography>
            <List sx={{ p: 0 }}>
              {item.content.map((i, index) => (
                <Link to={i.link} key={index}>
                  <Button
                    onClick={handleClick}
                    fullWidth
                    key={i.name}
                    sx={{
                      py: 0.5,
                      px: 0,
                      textTransform: "capitalize",
                      color: "black",
                      ":hover": {
                        background: (theme) => theme.palette.bg.dark,
                      },
                    }}
                  >
                    <ListItem sx={{ py: 0 }}>
                      <ListItemIcon sx={{ color: "black" }}>{i.icon}</ListItemIcon>
                      <ListItemText primary={i.name} />
                    </ListItem>
                  </Button>
                </Link>
              ))}
            </List>
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default Leftbar;
