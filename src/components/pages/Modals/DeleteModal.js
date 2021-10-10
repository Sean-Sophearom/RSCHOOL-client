import { Button, Modal, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import React from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const useStyle = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: 300,
    maxWidth: 400,
    width: "90vw",
    background: theme.palette.white,
    border: "1px solid #000",
    borderRadius: 8,
    padding: theme.spacing(4),
    textAlign: "center",
  },
  textContainer: {
    margin: "32px 0",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-evenly",
  },
  gray: {
    color: theme.palette.text.gray,
  },
  capitalize: {
    textTransform: "uppercase",
  },
}));

const DeleteModal = ({ open, handleClose, handleDelete, type }) => {
  const classes = useStyle();
  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={classes.root}>
        <Box className={classes.textContainer}>
          <Typography variant="h4" gutterBottom className={classes.capitalize}>
            delete {type}
          </Typography>
          <Typography variant="body1" className={classes.gray} sx={{ my: 4 }}>
            Are you sure you want to delete this {type}? This action cannot be undone.
          </Typography>
        </Box>

        <Box className={classes.buttonContainer}>
          <Button variant="contained" color="info" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="secondary" endIcon={<DeleteForeverIcon />} onClick={handleDelete}>
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
