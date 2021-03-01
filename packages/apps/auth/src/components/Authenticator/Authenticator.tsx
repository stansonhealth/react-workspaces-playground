import React, {useEffect, useState} from "react";
import {Button, makeStyles, TextField} from "@material-ui/core";
import setupAmplify from "@stanson/components/src/SetupAmplify";
import {Auth} from "aws-amplify";
import {AuthMessages, LoginTypes, StorageKeys} from "@stanson/constants";
import {tokenIsExpired, tokenNeedsRefresh} from "@stanson/services";

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
    maxWidth: 500,
    textAlign: "center"
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
  logo: {
    width: 150,
    margin: theme.spacing(4)
  },
  button: {}
}));

const origins = [
  "http://localhost:3001",
  "http://localhost:3000",
  "http://localhost:8080"
]

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
    const provider = localStorage.getItem(StorageKeys.STANSON_FEDERATED_PROVIDER)
    const redirect = localStorage.getItem(StorageKeys.STANSON_APP_REDIRECT)

    window.parent.postMessage({action: AuthMessages.HANDSHAKE}, '*');

    window.addEventListener("message", (message) => {
      console.log("AUTH APP MESSAGE --- ", message.data.action, message.origin)
      if (message.data?.action === AuthMessages.SET_REDIRECT) {
        setParentUrl(message.data.url);
      }

      if (message.data?.action === AuthMessages.HANDSHAKE) {
        if (origins.indexOf(message.origin) > -1) {
          if (!provider) {
            setTestUser(true);
          }
        }
      }
    }, false);

    if (provider) {
      localStorage.removeItem(StorageKeys.STANSON_FEDERATED_PROVIDER)
      setCustomProvider(provider);
      return;
    } else if (redirect) {
      localStorage.removeItem(StorageKeys.STANSON_APP_REDIRECT)
      setRedirectUrl(redirect);
    }
  }, [])

  const requestNewToken = () => {
    return new Promise(async (resolve, reject) => {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const currentSession = await Auth.currentSession();
      cognitoUser.refreshSession(currentSession.getRefreshToken(), (err: any, result: any) => {
        resolve(result);
      });
    })
  }

  useEffect(() => {
    if (testUser) {
      (async () => {
        let user = await Auth.currentUserPoolUser().catch((err) => {
          setLoginRequired(true)
        });

        let expiration = user?.getSignInUserSession()?.getIdToken()?.getExpiration();
        if (user && expiration && tokenIsExpired(expiration)) {
          console.log("LOGGING YOU OUT!");
          await Auth.signOut();
          setLoginRequired(true);
          return;
        } else if (user && expiration && tokenNeedsRefresh(expiration)) {
          await requestNewToken();
          user = await Auth.currentUserPoolUser().catch((err) => {
            setLoginRequired(true)
          });
          console.log('REFRESHED');
        }

        let token = user?.getSignInUserSession()?.getIdToken()?.getJwtToken();
        expiration = user?.getSignInUserSession()?.getIdToken()?.getExpiration();

        if (!token) {
          setLoginRequired(true)
          return;
        }

        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          window.parent.postMessage({action: AuthMessages.SET_TOKEN, token, expiration}, '*');
        }
      })()
    }
  }, [testUser, redirectUrl])

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
        const expiration = user?.getSignInUserSession()?.getIdToken()?.getExpiration();
        window.parent.postMessage({action: AuthMessages.SET_TOKEN, token, expiration}, '*');

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
