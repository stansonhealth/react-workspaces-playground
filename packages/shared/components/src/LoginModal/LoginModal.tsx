import React, {useCallback} from 'react';
import {
  Button,
  Card,
  CardContent,
  makeStyles,
  Modal,
  TextField
} from "@material-ui/core";
import {UserActions, UserStore} from "../LoggedInUser";
import {api} from "@stanson/services";

interface LoginModalProps {
  open: boolean;
}

interface LoginDetails {
  username?: string;
  password?: string;
  'spring-security-redirect': string;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    top: '50%',
    left: '50%',
    outline: "none",
    transform: `translate(-50%, -50%)`,
  },
  inputs: {
    width: '100%',
    marginTop: 5
  },
  modal: {
    outline: "none",
    "&:focus": {
      outline: "none"
    }
  },
  button: {
    marginTop: 20
  }
}));

const LoginModal: React.FC<LoginModalProps> = (props) => {
  const classes = useStyles();
  const {dispatch, state} = React.useContext(UserStore);
  const stableDispatch = useCallback(dispatch, [])
  const [loginDetails, setLoginDetails] = React.useState<LoginDetails>({
    'spring-security-redirect': '/login/hook'
  });

  const handleClick = () => stableDispatch(UserActions.loginAttempt())
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setLoginDetails({
      ...loginDetails,
      [event.target.name]: event.target.value
    });

  React.useEffect(() => {
    if (state.attemptLogin && loginDetails.password && loginDetails.username) {
      const loginFormData = new FormData()
      loginFormData.append('j_username', loginDetails.username)
      loginFormData.append('j_password', loginDetails.password)
      loginFormData.append('spring-security-redirect', '/login/hook')

      const data = `j_username=${encodeURIComponent(loginDetails.username)}&spring-security-redirect=/login/hook&j_password=${encodeURIComponent(loginDetails.password)}`;

      api({
        method: 'post',
        url: "j_spring_security_check",
        data: data,
        withCredentials: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded', 'accept': 'application/json'}
      }).then(() => {
        stableDispatch(UserActions.LoginSuccess())
      }).catch(err => {
        console.log(err);
      })
    }
  }, [state.attemptLogin, stableDispatch, loginDetails.password, loginDetails.username])

  return (
    <Modal open={props.open} className={classes.modal}>
      <Card elevation={10} className={classes.paper}>
        <CardContent>
          <TextField name="username" className={classes.inputs} label="email" onChange={handleInputChange} variant="outlined"></TextField>
          <TextField type="password" name="password" className={classes.inputs} label="password" onChange={handleInputChange} variant="outlined"></TextField>
          <Button variant="contained" onClick={handleClick} className={classes.button}>login</Button>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default LoginModal;
