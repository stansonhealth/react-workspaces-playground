import React, {createContext, useCallback, useEffect, useState} from 'react';
import {UserDetailsModel} from "./interfaces";
import axios, {AxiosInstance} from "axios";
import {tokenNeedsRefresh, useCognitoApi} from "@stanson/services";
import {Card, CardContent, makeStyles, Modal} from "@material-ui/core";
import {AuthMessages, StorageKeys, UserSession} from "@stanson/constants";

const ApiStore = createContext<{
  api: AxiosInstance
}>({api: axios.create()});

const { Provider } = ApiStore;

type LoginTypes = 'saml' | 'oauth';

interface UserModel {
  userDetails?: UserDetailsModel;
  loginType?: LoginTypes;
  requireLogin: boolean;
  attemptLogin: boolean;
  cognitoToken?: string;
  sessionDetails?: UserSession;
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
  iframe: {
    border: 0,
    width: '100%',
    height: 300
  },
  modal: {
    outline: "none",
    "&:focus": {
      outline: "none"
    }
  }
}));

const LoggedInUser: React.FC = (props) => {
  const classes = useStyles();

  const [displayLogin, setDisplayLogin] = useState();
  const [requireAuthPage, setRequireAuthPage] = useState<boolean>(false);
  const [userSession, setUserSession] = useState<UserSession>();
  const [loginRequired, setLoginRequired] = useState<boolean>(false);


  useEffect(() => {
    const token = localStorage.getItem(StorageKeys.STANSON_TOKEN)
    const expiration = localStorage.getItem(StorageKeys.STANSON_TOKEN_EXPIRATION)
    if (token && expiration && !tokenNeedsRefresh(parseInt(expiration))) {
      setUserSession({token, expiration: parseInt(expiration)});
      setLoginRequired(false);
      setRequireAuthPage(false);
    } else {
      setLoginRequired(true);
    }

    window.addEventListener("message", (e) => {
      const data = e.data;
      const type = data?.action;
      console.log("LOGGED IN USER ----- ", e.data.action);
      switch(type) {
        case AuthMessages.SET_TOKEN:
          setUserSession({token: data.token, expiration: data.expiration});
          setLoginRequired(false);
          setRequireAuthPage(false);
          localStorage.setItem(StorageKeys.STANSON_TOKEN, data.token);
          localStorage.setItem(StorageKeys.STANSON_TOKEN_EXPIRATION, data.expiration);
          break;
        case AuthMessages.LOGIN_REQUIRED:
          setDisplayLogin(true);
          break;
        case AuthMessages.HANDSHAKE:
          if (e.source && !(e.source instanceof MessagePort) && !(e.source instanceof ServiceWorker)) {
            e.source.postMessage({action: AuthMessages.HANDSHAKE}, '*')
          }
          break;
        case AuthMessages.FEDERATE_LOGIN:
          window.location.href = process.env.REACT_APP_AUTH_URL || e.origin
          break;
        case AuthMessages.REQUEST_REDIRECT:
          if (e.source && !(e.source instanceof MessagePort) && !(e.source instanceof ServiceWorker)) {
            e.source.postMessage({action: AuthMessages.SET_REDIRECT, url: window.location.href}, '*')
          }
          break;
        default:
          console.log('unknown message', e);
          break;
      }
    }, false);

  }, [])

  const api = useCallback(useCognitoApi(userSession, () => {
    if (userSession?.expiration && tokenNeedsRefresh(userSession.expiration)) {
      setRequireAuthPage(true);
    }
  }), [userSession?.expiration, userSession?.token]);

  useEffect(() => {
    if (loginRequired) {
      setRequireAuthPage(true);
    }
  }, [loginRequired])

  const displayIframe = {
    display: (displayLogin) ? "block" : "none"
  }

  const setupComplete = userSession?.expiration && userSession?.token;

  // console.log('render', setupComplete);

  return (
    <React.Fragment>
      {
        setupComplete &&
        <Provider value={{ api }}>
          {!loginRequired && props.children}
        </Provider>
      }
      <Modal style={displayIframe} open={requireAuthPage} className={classes.modal}>
        <Card elevation={10} className={classes.paper}>
          <CardContent>
            <iframe title="stanson-auth-app" className={classes.iframe} src={process.env.REACT_APP_AUTH_URL}></iframe>
          </CardContent>
        </Card>
      </Modal>
    </React.Fragment>

  )
}

export { ApiStore, LoggedInUser }
