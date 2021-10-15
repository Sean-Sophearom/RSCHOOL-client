import {
  Alert,
  Button,
  IconButton,
  Modal,
  Snackbar,
  TextField,
  Typography,
  Radio,
} from "@mui/material";
import { Box } from "@mui/system";
import { makeStyles } from "@mui/styles";
import React, { useContext, useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SaveIcon from "@mui/icons-material/Save";
import axios from "../../../customAxios";

//uuid
import { v4 } from "uuid";
import { chaptersContext } from "../../../ChaptersContext";

const useStyle = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: 300,
    maxWidth: 500,
    width: "90vw",
    background: theme.palette.white,
    border: "1px solid #000",
    borderRadius: 8,
    padding: theme.spacing(4),
  },
  titleContainer: {
    marginBottom: theme.spacing(5),
  },
  inputContainer: { margin: "16px 0" },
  radioContainer: { display: "flex", alignItems: "center" },
  gray: { color: theme.palette.text.gray },
}));

const AddNewExerciseModal = ({
  open,
  handleClose,
  currentChapter,
  id,
  user,
}) => {
  const classes = useStyle();
  const [chapters, setChapters] = useContext(chaptersContext);
  const [title, setTitle] = useState("");
  const [instruction, setInstruction] = useState("");
  const [type, setType] = useState("two choices");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleReset = () => {
    setInstruction("");
    setTitle("");
  };

  const handleSave = () => {
    if (!title) {
      setSnackbarMsg("Please set the title.");
      setOpenSnackbar(true);
      return;
    }
    //create a new exercise
    const newExercise = {
      title,
      instruction,
      type,
      questions: [],
      _id: v4(),
    };
    //append the exercise to the currentChapter.exercises
    const allExercises = [...currentChapter.exercises, newExercise];
    //update it in the db
    axios({
      method: "put",
      url: `/api/chapters/${id}`,
      headers: { "auth-token": user.token },
      data: { exercises: allExercises },
    }).then((res) => {
      const updatedChapters = chapters.map((chapter) =>
        chapter._id !== id ? chapter : res.data
      );
      setChapters(updatedChapters);
      handleReset();
      handleClose();
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={classes.root}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton className={classes.closeIcon} onClick={handleClose}>
            <HighlightOffIcon color="inherit" />
          </IconButton>
        </Box>
        <Box className={classes.titleContainer}>
          <Typography variant="h5" gutterBottom align="center">
            Add a New Exercise
          </Typography>
          <Typography variant="body1" className={classes.gray} align="center">
            You can add the questions later.
          </Typography>
        </Box>
        <Box className={classes.inputContainer}>
          <Box sx={{ display: "flex" }}>
            <Typography variant="h6" gutterBottom sx={{ flex: 1 }}>
              Exercise Title
            </Typography>
            <Button sx={{ mb: "7px" }} onClick={handleReset}>
              Reset
            </Button>
          </Box>

          <TextField
            size="small"
            required
            label="title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>
        <Box className={classes.inputContainer}>
          <Typography display="inline-block" variant="h6" gutterBottom>
            Instruction
          </Typography>
          <Typography
            variant="body2"
            display="inline"
            sx={{ color: "gray", ml: 1 }}
          >
            (Optional)
          </Typography>
          <TextField
            size="small"
            label="instruction"
            fullWidth
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
          />
        </Box>

        <Typography display="inline-block" variant="h6">
          Exercise type
        </Typography>
        <Box className={classes.radioContainer}>
          <Radio
            size="small"
            checked={type === "two choices"}
            value={"two choices"}
            onChange={() => setType("two choices")}
          />
          <Typography>Two choices</Typography>
        </Box>

        <Box className={classes.radioContainer}>
          <Radio
            size="small"
            checked={type === "multiple choices"}
            value={"multiple choices"}
            onChange={() => setType("multiple choices")}
          />
          <Typography>Multiple Choices</Typography>
        </Box>

        <Box className={classes.radioContainer}>
          <Radio
            size="small"
            checked={type === "correct or incorrect"}
            value={"correct or incorrect"}
            onChange={() => setType("correct or incorrect")}
          />
          <Typography>Correct or incorrect</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            color="info"
            endIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
        {/* Snackbar for when user hasn't given enough input */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%" }}
          >
            {snackbarMsg}
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default AddNewExerciseModal;
