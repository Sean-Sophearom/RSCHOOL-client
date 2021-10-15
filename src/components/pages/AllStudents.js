import {
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../userContext";
import { Link } from "react-router-dom";
import axios from "../../customAxios";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/system";

const useStyle = makeStyles((theme) => ({
  searchContainer: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },
  modal: {
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
}));

const AllStudents = () => {
  const [user] = useContext(userContext);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  //const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const classes = useStyle();

  useEffect(() => {
    const { token } = user;
    if (token && user.accType === "teacher") {
      axios({
        method: "get",
        url: "/api/student",
        headers: { "auth-token": token },
      })
        .then((res) => {
          const rows = res.data.map((student) => createRow(student));
          setStudents(rows);
          setSearchResults(rows);
        })
        .catch((err) => console.log(err.response));
    }
  }, [user]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const searchResult = students.filter((student) =>
      student.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSearchResults(searchResult);
  };

  const createRow = (obj) => {
    //destructing everything cause i need to modify some stuffs first
    const { username: name, gender, phone, _id } = obj;
    const { numOfDone, numOfCorrectlyDone, numOfQuestions } = obj;
    let { start, end } = obj;
    //convert date to a readable format
    start = new Date(start);
    start = start.toDateString().slice(4);
    end = new Date(end);
    end = end.toDateString().slice(4);
    //calculate the percentage of done
    const done = Math.floor((numOfDone / numOfQuestions) * 100);
    const correct = Math.floor((numOfCorrectlyDone / numOfQuestions) * 100);
    //cause email is optional some accounts may not have it
    const email = obj.email || "no emails";
    return { name, gender, email, phone, start, end, done, correct, _id };
  };

  return (
    <>
      <Paper className={classes.searchContainer}>
        <TextField
          size="small"
          label="search students"
          sx={{ minWidth: "40%" }}
          value={search}
          onChange={handleSearch}
        />
      </Paper>

      <TableContainer className={classes.table} component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Gender</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Phone</TableCell>
              <TableCell align="center">Start&nbsp;At</TableCell>
              <TableCell align="center">End&nbsp;At</TableCell>
              <TableCell align="center">Done</TableCell>
              <TableCell align="center">Correctly</TableCell>
              <TableCell align="center">Password</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResults.map((row) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  sx={{ textDecoration: "underline" }}
                >
                  <Link to={`/students/${row._id}`}>{row.name}</Link>
                </TableCell>
                <TableCell align="center">{row.gender}</TableCell>
                <TableCell align="center">{row.email}</TableCell>
                <TableCell align="center">{row.phone}</TableCell>
                <TableCell align="center">{row.start}</TableCell>
                <TableCell align="center">{row.end}</TableCell>
                <TableCell align="center">{row.done}%</TableCell>
                <TableCell align="center">{row.correct}%</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => setOpen(true)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className={classes.modal}></Box>
      </Modal>
    </>
  );
};

export default AllStudents;
