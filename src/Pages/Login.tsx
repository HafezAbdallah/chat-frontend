import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { login, register } from "apis/userManagementApis";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { useState } from "react";
import { setCookie, getCookie } from "utils/cookiesHelper";

const enum Mode {
  Login,
  Register
}

const Login = (props: { onLogin: () => void }) => {
  const [mode, setMode] = useState(Mode.Login);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userName = data.get("email") as string;
    const password = data.get("password") as string;

    if (mode == Mode.Login) {
      login(userName, password)
        .then((result) => {
          localStorage.setItem("Token", result.data);
          setCookie("userName", result.data, 7);
          props.onLogin();
        })
        .catch(() => {
          console.log("msh tmam");
        });
    } else {
      register(userName, password)
        .then(() => {
          setMode(Mode.Login);
        })
        .catch(() => {
          console.log("error");
        });
    }
  };
  const handleRegister = () => {
    setMode(Mode.Register);
  };

  React.useEffect(() => {
    if (getCookie("userName")) props.onLogin();
  }, []);
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {mode == Mode.Login ? "Log in" : "Register"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            {mode == Mode.Login ? "Log in" : "Register"}
          </Button>
          {mode == Mode.Login && (
            <Grid item>
              <Link onClick={handleRegister} variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
