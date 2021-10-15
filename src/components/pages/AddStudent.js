import {
  RadioGroup,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  TextField,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  OutlinedInput,
  Modal,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import React, { useContext, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { userContext } from "../../userContext";
import axios from "../../customAxios";

const useStyle = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
    maxWidth: theme.maxWidth,
    marginInline: "auto",
  },
  mainContainer: {
    maxWidth: `calc(${theme.maxWidth} / 2)`,
    marginInline: "auto",
  },
  inputContainer: { marginBlock: theme.spacing(3) },
  error: {
    color: "red",
    "&::before": {
      content: '"*"',
      color: "red",
    },
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: theme.palette.white,
    borderRadius: 8,
    padding: theme.spacing(4),
    textAlign: "center",
  },
}));

const AddStudent = () => {
  const classes = useStyle();
  const [user] = useContext(userContext);
  const [gender, setGender] = useState("female");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const handleRegister = () => {
    if (!username) return setErr({ ...err, username: "Username field cannot be empty" });
    if (!password) return setErr({ ...err, password: "Password field cannot be empty" });
    if (!phone) return setErr({ ...err, phone: "Phone Number field cannot be empty" });
    if (email) {
      const splitEmail = email.split("@");
      if (!email.includes("@") || !email.includes(".") || !splitEmail[0] || !splitEmail[1])
        return setErr({ ...err, email: "Invalid Email address." });
    }
    axios({
      method: "post",
      url: "/api/student",
      headers: { "auth-token": user.token },
      data: { username, password, gender, phone, email },
    })
      .then((res) => setOpenModal(true))
      .catch((err) => {
        const errorMessage = err.response.data.message;
        if (errorMessage.includes("email")) return setErr({ ...err, email: errorMessage });
        console.log(errorMessage);
        return setErr({ ...err, phone: errorMessage });
      });
  };
  return (
    <>
      <Paper className={classes.root}>
        <Box className={classes.mainContainer}>
          <Typography variant="h4" align="center">
            Register a New Student
          </Typography>

          <Box className={classes.inputContainer}>
            <Typography variant="h6" gutterBottom>
              Student's Name
            </Typography>
            <TextField
              size="small"
              placeholder="name"
              fullWidth
              value={username}
              onChange={(e) => {
                setErr({ ...err, username: "" });
                setUsername(e.target.value);
              }}
            />
            {err.username && (
              <Typography variant="caption" className={classes.error}>
                {err.username}
              </Typography>
            )}
          </Box>

          <Box className={classes.inputContainer}>
            <Typography variant="h6" gutterBottom display="inline">
              Student's Email
            </Typography>
            <Typography variant="body2" sx={{ color: "gray", ml: 1 }} display="inline">
              (Optional)
            </Typography>
            <TextField
              type="email"
              size="small"
              placeholder="email"
              fullWidth
              value={email}
              onChange={(e) => {
                setErr({ ...err, email: "" });
                setEmail(e.target.value);
              }}
            />
            {err.email && (
              <Typography variant="caption" className={classes.error}>
                {err.email}
              </Typography>
            )}
          </Box>

          <Box className={classes.inputContainer}>
            <Typography variant="h6" gutterBottom>
              Student's Phone Number
            </Typography>
            <TextField
              type="number"
              size="small"
              placeholder="phone number"
              fullWidth
              value={phone}
              onChange={(e) => {
                setErr({ ...err, phone: "" });
                setPhone(e.target.value);
              }}
            />
            {err.phone && (
              <Typography variant="caption" className={classes.error}>
                {err.phone}
              </Typography>
            )}
          </Box>

          <Box className={classes.inputContainer}>
            <Typography variant="h6" gutterBottom>
              Student's Password
            </Typography>
            <OutlinedInput
              size="small"
              required
              placeholder="password"
              fullWidth
              value={password}
              onChange={(e) => {
                setErr({ ...err, password: "" });
                setPassword(e.target.value);
              }}
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {err.password && (
              <Typography variant="caption" className={classes.error}>
                {err.password}
              </Typography>
            )}
          </Box>

          <Box className={classes.inputContainer}>
            <Typography variant="h6" gutterBottom>
              Gender
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup defaultValue="female" value={gender} onChange={(e) => setGender(e.target.value)}>
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
              </RadioGroup>
            </FormControl>
          </Box>

          {/*This is a placeholder for when I want to expand the project 
          <Box className={classes.inputContainer}>
            <Typography variant="h6" display="inline">
              Class
            </Typography>
            <Typography variant="body2" display="inline" sx={{ color: "gray", fontSize: 13, ml: 1 }}>
              (This is a placeholder for when I want to expand the project)
            </Typography>
            <FormControl fullWidth disabled>
              <Select size="small" labelId="demo-simple-select-label" label="Age">
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Box> */}

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="info" onClick={handleRegister}>
              Register
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* modal for when the creation is succeeded */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box className={classes.modal}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Account successfully created.
          </Typography>

          <Button variant="contained" color="info" onClick={() => setOpenModal(false)}>
            close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default AddStudent;
