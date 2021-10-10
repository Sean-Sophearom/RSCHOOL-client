import { Button, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { userContext } from "../../userContext";
import { chaptersContext } from "../../ChaptersContext";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

//modal
import DeleteModal from "./Modals/DeleteModal";
import AddNewExerciseModal from "./Modals/AddNewExerciseModal";

const useStyle = makeStyles((theme) => ({
  root: {
    maxWidth: theme.maxWidth,
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
    margin: "0 auto",
    marginBottom: theme.spacing(1.5),
  },
  gridContainer: { maxWidth: theme.maxWidth, marginInline: "auto" },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    margin: `${theme.spacing(2)} auto 0`,
    paddingBottom: theme.spacing(4),
  },
}));

const EditChapter = () => {
  const [user] = useContext(userContext);
  const [chapters] = useContext(chaptersContext);
  const [currentChapter, setCurrentChapter] = useState(undefined);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [ExerciseModal, setExerciseModal] = useState(false);
  const { id } = useParams();
  const history = useHistory();

  //assign currentChapter based on id so I can use it throughout the page
  useEffect(() => {
    const thisChapter = chapters.find((item) => item._id === id);
    if (!thisChapter) history.push("/chapters");
    setCurrentChapter(thisChapter);
  }, [chapters, id, history]);

  const deleteChapter = () => {
    axios({
      method: "delete",
      url: `https://rschool-online.herokuapp.com/api/chapters/${id}`,
      headers: { "auth-token": user.token },
    })
      .then(history.push("/chapters"))
      .catch((err) => console.log(err));
  };

  const classes = useStyle();
  return (
    <>
      <Paper className={classes.root}>
        <Box sx={{ display: "flex" }}>
          <Link to="/chapters">
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
          </Link>

          <Typography sx={{ flex: 1 }} />

          <IconButton onClick={() => setOpenDeleteModal(true)}>
            <DeleteForeverIcon color="secondary" />
          </IconButton>
        </Box>

        <Typography variant="h4" align="center" gutterBottom>
          {currentChapter?.title}
        </Typography>

        <List>
          {currentChapter?.description.map((item, index) => (
            <ListItem key={index} sx={{ py: 0 }}>
              <ListItemIcon sx={{ color: "black", transform: "scale(0.5)", minWidth: 30 }}>
                <FiberManualRecordIcon fontSize="small" color="black" />
              </ListItemIcon>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box className={classes.gridContainer}>
        <Grid container spacing={1.5}>
          {currentChapter?.exercises?.map((item, index) => (
            <Grid key={item._id} item xs={12} md={6}>
              <Paper sx={{ p: { xs: 1, sm: 2 }, height: "100%" }}>
                <Box sx={{ display: "flex" }}>
                  <Typography variant="h6" gutterBottom sx={{ flex: 1, display: "inline" }}>
                    {index + 1}. {item.title}
                  </Typography>

                  <Link to={`/chapters/${id}/${item._id}`}>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </Link>
                </Box>

                <Typography>{item.instruction || "No instructions."}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box className={classes.buttonContainer}>
        <Button
          variant="contained"
          endIcon={<AddCircleOutlineIcon />}
          onClick={() => setExerciseModal(true)}
          color="info"
        >
          Add new Exercise
        </Button>
      </Box>

      {/* modal for adding new Exercise */}
      <AddNewExerciseModal
        open={ExerciseModal}
        handleClose={() => setExerciseModal(false)}
        currentChapter={currentChapter}
        setCurrentChapter={setCurrentChapter}
        id={id}
        user={user}
      />

      {/* modal for deleting chapter */}
      <DeleteModal
        type="chapter"
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleDelete={deleteChapter}
      />
    </>
  );
};

export default EditChapter;
