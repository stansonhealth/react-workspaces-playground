import React, {useCallback, useEffect, useState} from "react";
import {Button, makeStyles, TextField} from "@material-ui/core";
import setupAmplify from "@stanson/components/src/SetupAmplify";
import {Auth} from "aws-amplify";
import {
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
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

interface PasswordRequiredModel {
  attemptChange: boolean;
  requiredAttributes?: {
    [key:string]: string;
  },
  user?: any,
  newPassword: string;
  required: boolean;
}

const Authenticator: React.FC = () => {
  const classes = useStyles();
  const [loginType, setLoginType] = useState<LoginTypes>();
  const [parentUrl, setParentUrl] = useState<string>();
  const [customProvider, setCustomProvider] = useState<string>();
  const [testUser, setTestUser] = useState<boolean>();
  const [redirectUrl, setRedirectUrl] = useState<string>();
  const [attemptLogin, setAttemptLogin] = useState<boolean>(false);
  const [loginRequired, setLoginRequired] = useState<boolean>(false);
  const [passwordResetRequired, setPasswordResetRequired] = useState<PasswordRequiredModel>({
    attemptChange: false,
    newPassword: "",
    required: false
  });
  const [loginDetails, setLoginDetails] = React.useState<LoginDetails>({
    username: "",
  });

  const getJWT = (user: any) => user?.getSignInUserSession()?.getIdToken()?.getJwtToken();

  const processAmplifyResponse = useCallback((user: any) => {
    const token = getJWT(user)
    const expiration = resetIdleTimer();
    window.parent.postMessage({action: AuthMessages.SET_TOKEN, token, expiration}, '*');
  }, [])

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

  useEffect(() => {
    if (testUser) {
      (async () => {
        const idleExpiration = localStorage.getItem(StorageKeys.STANSON_IDLE_EXPIRATION)

        if (!idleExpiration || tokenIsExpired(parseInt(idleExpiration))) {
          await Auth.signOut();
          setLoginRequired(true);
          return;
        }

        let user = await Auth.currentAuthenticatedUser().catch(() => {
          setLoginRequired(true)
        });

        const token = getJWT(user);

        if (!token) {
          setLoginRequired(true)
          return;
        }

        if (redirectUrl) {
          window.location.href = redirectUrl || "";
        } else {
          const expiration = resetIdleTimer();
          window.parent.postMessage({action: AuthMessages.SET_TOKEN, token, expiration}, '*');
        }
      })()
    }
  }, [testUser, redirectUrl])

  const resetIdleTimer = () => {
    const now = new Date().getTime().toString()
    localStorage.setItem(StorageKeys.STANSON_IDLE_EXPIRATION, now)
    return now;
  }

  useEffect(() => {
    if (loginRequired) {
      window.parent.postMessage({action: AuthMessages.REQUEST_REDIRECT}, '*');
      window.parent.postMessage({action: AuthMessages.LOGIN_REQUIRED}, '*');
    }
  }, [loginRequired])

  useEffect(() => {
    if (customProvider) {
      (async () => {
        resetIdleTimer();
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

        if (user) {
          resetIdleTimer();
        }

        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          const { requiredAttributes, userAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
          const attr: {
            [key:string]: string;
          } = {}
          requiredAttributes.forEach((item: string) => {
            // TODO: figure out if we want to pre fill this
            attr[item] = userAttributes[item];
          });
          setPasswordResetRequired({
            attemptChange: false,
            user: user,
            requiredAttributes: attr,
            newPassword: "",
            required: true
          })
          return;
        }

        processAmplifyResponse(user);
        })();
    }
  }, [attemptLogin, loginDetails.password, loginDetails.username, processAmplifyResponse])

  const attemptChange = passwordResetRequired?.attemptChange;
  useEffect(() => {
    if (attemptChange) {
      Auth.completeNewPassword(
        passwordResetRequired.user,
        passwordResetRequired.newPassword,
        passwordResetRequired.requiredAttributes
      ).then(user => {
        // at this time the user is logged in if no MFA required
        const token = getJWT(user)
        const expiration = resetIdleTimer();
        window.parent.postMessage({action: AuthMessages.SET_TOKEN, token, expiration}, '*');
      }).catch(e => {
        console.log(e);
      });
    }
  }, [attemptChange, passwordResetRequired])

  const handleClick = () => {
    setAttemptLogin(true);
  }

  const handleChangeClick = () => setPasswordResetRequired({
    ...passwordResetRequired,
    attemptChange: true
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setLoginDetails({
    ...loginDetails,
    [event.target.name]: event.target.value
  });

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setPasswordResetRequired({
    ...passwordResetRequired,
    newPassword: event.target.value || ""
  });

  const handleRequiredAttrChange = (event: React.ChangeEvent<HTMLInputElement>) => setPasswordResetRequired({
    ...passwordResetRequired,
    requiredAttributes: {
      ...passwordResetRequired.requiredAttributes,
      [event.target.name]: event.target.value || ""
    }
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
        loginRequired && !passwordResetRequired.required &&
        <div className={classes.loginContainer}>
            <TextField name="username" className={classes.inputs} label="username" onChange={handleInputChange} variant="outlined"></TextField>
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
      {
        passwordResetRequired.required &&
        <div className={classes.loginContainer}>
          <strong>please change your password</strong>
          {
            passwordResetRequired.requiredAttributes &&
            Object.keys(passwordResetRequired.requiredAttributes).map(key => (
              <TextField key={'changefield' + key} name={key} className={classes.inputs} label={key} onChange={handleRequiredAttrChange} variant="outlined"></TextField>
            ))
          }
          <TextField name="password" type="password" className={classes.inputs} label="new password" onChange={handlePasswordChange} variant="outlined"></TextField>
          <Button variant="contained" onClick={handleChangeClick} className={classes.button}>reset password</Button>
        </div>
      }
    </React.Fragment>
  );
};

export default Authenticator;
