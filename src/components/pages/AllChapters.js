import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { userContext } from "../../userContext";

//mui
import {
  Button,
  Grid,
  Paper,
  Typography,
  IconButton,
  Modal,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Snackbar,
  Alert,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { chaptersContext } from "../../ChaptersContext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SaveIcon from "@mui/icons-material/Save";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const useStyle = makeStyles((theme) => ({
  paper: {
    height: "100%",
    padding: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1.5),
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    margin: `${theme.spacing(2)} auto 0`,
    paddingBottom: theme.spacing(4),
  },
  modalContainer: {
    background: theme.palette.white,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90vw",
    maxWidth: 500,
    border: "1px solid black",
    borderRadius: 8,
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(4),
    },
    margin: "0 4px",
  },
  closeIcon: { position: "relative", left: 8, bottom: 8, [theme.breakpoints.down("sm")]: { bottom: 20 } },
  inputContainer: { paddingTop: theme.spacing(4) },
  gray: { color: theme.palette.text.gray },
}));

const AllChapters = () => {
  const [chapters, setChapters] = useContext(chaptersContext);
  const [user] = useContext(userContext);
  const [openModal, setOpenModal] = useState(false);
  const [inputTitle, setInputTitle] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [descriptionList, setDescriptionList] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const classes = useStyle();

  useEffect(() => {
    const { token } = user;
    if (token && user.accType === "teacher") {
      axios({
        method: "get",
        url: "https://rschool-online.herokuapp.com/api/chapters",
        headers: { "auth-token": token },
      })
        .then((res) => setChapters(res.data))
        .catch((err) => console.log(err));
    }
  }, [user, setChapters]);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    resetInput();
    setOpenModal(false);
  };

  const resetInput = () => {
    setInputDescription("");
    setInputTitle("");
    setDescriptionList([]);
  };

  const addDescription = () => {
    if (!inputDescription) return;
    if (descriptionList.length > 3) return;
    setDescriptionList([...descriptionList, inputDescription]);
    setInputDescription("");
  };

  const saveNewChapter = () => {
    if (!inputTitle) {
      setSnackbarMsg("Please set chapter name.");
      return setOpenSnackbar(true);
    }
    if (descriptionList.length < 2) {
      setSnackbarMsg("Please set at least two descriptions.");
      return setOpenSnackbar(true);
    }
    axios({
      method: "post",
      url: "https://rschool-online.herokuapp.com/api/chapters",
      headers: { "auth-token": user.token },
      data: { title: inputTitle, description: descriptionList },
    })
      .then((res) => {
        setChapters([...chapters, res.data]);
        handleClose();
      })
      .catch((err) => console.log(err.response));
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addDescription();
  };

  return (
    <>
      <Grid container spacing={2}>
        {/* If user has not added any chapters yet display a message instead of mapping over it */}
        {chapters?.length === 0 && (
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h6" component="p">
                You have not added any chapters yet.
              </Typography>
            </Paper>
          </Grid>
        )}

        {chapters &&
          chapters?.map((item) => (
            <Grid item key={item._id} xs={12} md={6}>
              <Paper className={classes.paper}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="h4" sx={{ fontSize: 28, flex: 1, display: "inline" }}>
                    {item.title}
                  </Typography>

                  <Link to={`/chapters/${item._id}`}>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </Link>
                </Box>
                <List>
                  {item.description.map((i, index) => (
                    <ListItem key={index} sx={{ py: 0 }}>
                      <ListItemIcon sx={{ color: "black", transform: "scale(0.5)", minWidth: 30 }}>
                        <FiberManualRecordIcon fontSize="small" color="black" />
                      </ListItemIcon>
                      <ListItemText primary={i} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          ))}
      </Grid>

      <Box className={classes.buttonContainer}>
        <Button variant="contained" color="info" endIcon={<AddCircleOutlineIcon />} onClick={handleOpen}>
          Add new Chapter
        </Button>
      </Box>

      {/* Modal for creating new Chapters */}
      <Modal open={openModal} onClose={handleClose}>
        <Box className={classes.modalContainer}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton className={classes.closeIcon} onClick={handleClose}>
              <HighlightOffIcon color="inherit" />
            </IconButton>
          </Box>

          <Typography variant="h5" align="center" gutterBottom>
            Add a New Chapter
          </Typography>
          <Typography variant="body1" className={classes.gray} align="center">
            You can add the exercises later.
          </Typography>

          <Box className={classes.inputContainer}>
            <Box sx={{ display: "flex" }}>
              <Typography variant="h6" gutterBottom sx={{ flex: 1 }}>
                Chapter Title
              </Typography>
              <Button onClick={resetInput}>Reset</Button>
            </Box>

            <TextField
              sx={{ mt: 1 }}
              size="small"
              required
              label="title"
              fullWidth
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
            />
          </Box>

          <Box className={classes.inputContainer}>
            <Typography variant="h6" gutterBottom>
              Descriptions
            </Typography>

            <List>
              {descriptionList.map((description, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemIcon sx={{ color: "black", transform: "scale(0.5)", minWidth: 30 }}>
                    <FiberManualRecordIcon fontSize="small" color="black" />
                  </ListItemIcon>
                  <ListItemText primary={description} />
                </ListItem>
              ))}
            </List>

            <Box sx={{ display: "flex" }}>
              <IconButton onClick={addDescription}>
                <AddCircleOutlineIcon />
              </IconButton>
              <TextField
                size="small"
                required
                label="add description"
                fullWidth
                value={inputDescription}
                onChange={(e) => {
                  if (e.nativeEvent.inputType !== "insertLineBreak") setInputDescription(e.target.value);
                }}
                onKeyDown={handleKeyDown}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button variant="contained" color="info" endIcon={<SaveIcon />} onClick={saveNewChapter}>
                Save
              </Button>
            </Box>
          </Box>

          {/* Snackbar for when user hasn't given enough input */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
              {snackbarMsg}
            </Alert>
          </Snackbar>
        </Box>
      </Modal>
    </>
  );
};

export default AllChapters;
