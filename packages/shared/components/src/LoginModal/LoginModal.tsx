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
import { Auth } from 'aws-amplify';
import setupAmplify from "../SetupAmplify";


interface LoginModalProps {
  open: boolean;
}

interface LoginDetails {
  username: string;
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
    marginBottom: theme.spacing(2)
  },
  modal: {
    outline: "none",
    "&:focus": {
      outline: "none"
    }
  },
  button: {}
}));

const LoginModal: React.FC<LoginModalProps> = (props) => {
  const classes = useStyles();
  const {dispatch, state} = React.useContext(UserStore);
  const stableDispatch = useCallback(dispatch, [])
  const [federateLogin, setFederateLogin] = React.useState<boolean>(false);
  const [loginDetails, setLoginDetails] = React.useState<LoginDetails>({
    username: '',
    'spring-security-redirect': '/login/hook'
  });

  const handleClick = () => stableDispatch(UserActions.loginAttempt())
  const handleStepOne = () => {
    console.log(loginDetails.username.indexOf('@'), loginDetails);
    if (loginDetails.username && loginDetails.username.indexOf('@') > -1) {
      dispatch(UserActions.setLoginType('saml'))
      setFederateLogin(true);
    } else {
      dispatch(UserActions.setLoginType('oauth'))
    }
  }

  React.useEffect(setupAmplify, [])

  React.useEffect(() => {
    if (federateLogin) {
      (async () => {
        await Auth.federatedSignIn({customProvider: 'vhh'});
      })()
    }
  }, [federateLogin])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setLoginDetails({
      ...loginDetails,
      [event.target.name]: event.target.value
    });

  React.useEffect(() => {
    if (state.attemptLogin && loginDetails.password && loginDetails.username) {
      (async () => {
        await Auth.signIn(loginDetails.username, loginDetails.password).catch(err => {
          stableDispatch(UserActions.loginFailed())
        })
      })();
    }
  }, [state.attemptLogin, stableDispatch, loginDetails.password, loginDetails.username])

  return (
    <Modal open={props.open} className={classes.modal}>
      <Card elevation={10} className={classes.paper}>
        <CardContent>
          <TextField name="username" className={classes.inputs} label="email" onChange={handleInputChange} variant="outlined"></TextField>
          {
            state?.loginType === 'oauth' &&
            <React.Fragment>
              <TextField type="password" name="password" className={classes.inputs} label="password" onChange={handleInputChange} variant="outlined"></TextField>
              <Button variant="contained" onClick={handleClick} className={classes.button}>login</Button>
            </React.Fragment>
          }
          { !state?.loginType &&
            <Button variant="contained" onClick={handleStepOne} className={classes.button}>next</Button>
          }
        </CardContent>
      </Card>
    </Modal>
  );
};

export default LoginModal;
