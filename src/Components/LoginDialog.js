import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonIcon from '@mui/icons-material/Person';
import Chip from '@mui/material/Chip';
import '../App.css';
import md5 from 'md5';

function SimpleDialog(props) {
  const { onClose, selectedValue, open, isLogin, onClickSignUp, setOpen, setSelectedValue, notifyOk, notifyError} = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    fetch(
      "https://www.forexsignals10pips.com/stockscreener/apilogin.php", {
        method: "POST",
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
        body: "action="+(isLogin?"login":"register")+"&user=" + data.get('email') +"&pswd="+md5(data.get('password'))
      })
              .then((res) => res.json())
              .then((json) => {
                  if (!isLogin && json.response === '200') {
                    notifyOk();
                    onClickSignUp();
                    setOpen(false);
                  } else if (!isLogin && json.response === '300') {
                    notifyError();
                  } else if (isLogin && json.key !== '') {
                    console.log("login");
                    setSelectedValue(json.key);
                  } 
              })
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Box
          sx={{
            marginTop: 8,
            marginLeft:10,
            marginRight: 10,
            marginBottom: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {isLogin? "Sign In": "Sign Up"}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick={onClickSignUp} >
                  {isLogin?"Don't have an account? Sign Up":"Alredy have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function LoginDialog(props) {
  const onCloseForm = props.onClose;
  const notifyOk = props.notifyOk;
  const notifyError = props.notifyError;
  const myKey = props.myKey;
  const handleDisconnect = props.handleDisconnect;
  
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("1");
  const [isLogin, setLogin] = React.useState("1");

  const handleClickOpen = () => {
    if (myKey) {
      handleDisconnect();
    }else{
      setOpen(true);
    }

  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
    onCloseForm(value);
  };

  const handleClickSignUp = () => {
    setLogin(!isLogin);
  }

  return (
    <div>
      {/*}
      <Typography variant="subtitle1" component="div">
        Selected: {selectedValue}
      </Typography>
      <br />
      <Button variant="outlined" onClick={handleClickOpen}>
        Open simple dialog
      </Button>
  
      <svg onClick={handleClickOpen} xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-person-circle userLogin" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
      </svg>*/}
      <Chip icon={<PersonIcon style={{ fontSize: 32 }} onClick={handleClickOpen}  className="userLogin" />} label={myKey}  className="userLogin" />
      
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        onClickSignUp={handleClickSignUp}
        isLogin={isLogin}
        setOpen = {setOpen}
        setSelectedValue = {handleClose}
        notifyOk = {notifyOk}
        notifyError = {notifyError}
      />
    </div>
  );
}
