import React, {useEffect, useState} from "react";
import {Button, makeStyles, TextField} from "@material-ui/core";
import setupAmplify from "@stanson/components/src/SetupAmplify";
import {Auth} from "aws-amplify";
import {AuthMessages, LoginTypes, StorageKeys} from "@stanson/constants";

interface LoginDetails {
  username: string;
  password?: string;
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
  loginContainer: {
    margin: theme.spacing(2),
    maxWidth: 500
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

const Authenticator: React.FC = () => {
  const classes = useStyles();
  const [loginType, setLoginType] = useState<LoginTypes>();
  const [parentUrl, setParentUrl] = useState<string>();
  const [customProvider, setCustomProvider] = useState<string>();
  const [testUser, setTestUser] = useState<boolean>();
  const [redirectUrl, setRedirectUrl] = useState<string>();
  const [attemptLogin, setAttemptLogin] = useState<boolean>(false);
  const [loginRequired, setLoginRequired] = useState<boolean>(false);
  const [loginDetails, setLoginDetails] = React.useState<LoginDetails>({
    username: '',
  });

  useEffect(setupAmplify, [])

  useEffect(() => {
    window.addEventListener("message", (message) => {
      console.log("message received on auth", message.data);
      if (message.data?.action === AuthMessages.SET_REDIRECT) {
        setParentUrl(message.data.url);
      }
    }, false);

    const provider = localStorage.getItem(StorageKeys.STANSON_FEDERATED_PROVIDER)
    const redirect = localStorage.getItem(StorageKeys.STANSON_APP_REDIRECT)
    if (provider) {
      localStorage.removeItem(StorageKeys.STANSON_FEDERATED_PROVIDER)
      setCustomProvider(provider);
      return;
    } else if (redirect) {
      localStorage.removeItem(StorageKeys.STANSON_APP_REDIRECT)
      setRedirectUrl(redirect);
    }

    setTestUser(true);
  }, [])

  useEffect(() => {
    if (testUser) {
      (async () => {
        const user = await Auth.currentUserPoolUser().catch((err) => {
          setLoginRequired(true)
        });
        const token = user?.getSignInUserSession()?.getIdToken()?.getJwtToken();
        console.log(user);
        if (!token) {
          setLoginRequired(true)
          return;
        }

        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          window.parent.postMessage({action: AuthMessages.SET_TOKEN, token}, '*');
        }
      })()
    }
  }, [testUser])

  useEffect(() => {
    if (loginRequired) {
      window.parent.postMessage({action: AuthMessages.REQUEST_REDIRECT}, '*');
      window.parent.postMessage({action: AuthMessages.LOGIN_REQUIRED}, '*');
    }
  }, [loginRequired])

  useEffect(() => {
    if (customProvider) {
      (async () => {
        await Auth.federatedSignIn({customProvider: customProvider});
      })()
    }
  }, [customProvider])

  useEffect(() => {
    if (attemptLogin && loginDetails.password && loginDetails.username) {
      (async () => {
        const user = await Auth.signIn(loginDetails.username, loginDetails.password).catch(err => {
          console.log('failed');
        })
        const token = user?.getSignInUserSession()?.getIdToken()?.getJwtToken();
        window.parent.postMessage({action: AuthMessages.SET_TOKEN, token}, '*');
        })();
    }
  }, [attemptLogin, loginDetails.password, loginDetails.username])

  const handleClick = () => {
    setAttemptLogin(true);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setLoginDetails({
    ...loginDetails,
    [event.target.name]: event.target.value
  });

  const handleStepOne = () => {
    if (loginDetails.username && loginDetails.username.indexOf('@') > -1) {
      localStorage.setItem(StorageKeys.STANSON_FEDERATED_PROVIDER, "vhh");
      if (parentUrl) {
        localStorage.setItem(StorageKeys.STANSON_APP_REDIRECT, parentUrl);
      }
      window.parent.postMessage({action: AuthMessages.FEDERATE_LOGIN}, '*');
    } else {
      setLoginType("oauth");
    }
  }

  return (
    <React.Fragment>
      {
        loginRequired &&
        <div className={classes.loginContainer}>
            <TextField name="username" className={classes.inputs} label="email" onChange={handleInputChange} variant="outlined"></TextField>
            {
              loginType === 'oauth' &&
              <React.Fragment>
                <TextField type="password" name="password" className={classes.inputs} label="password" onChange={handleInputChange} variant="outlined"></TextField>
                <Button variant="contained" onClick={handleClick} className={classes.button}>login</Button>
              </React.Fragment>
            }
            { !loginType &&
            <Button variant="contained" onClick={handleStepOne} className={classes.button}>next</Button>
            }
        </div>
      }
    </React.Fragment>
  );
};

export default Authenticator;
