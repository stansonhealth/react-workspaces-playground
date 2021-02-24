import React, {createContext, useCallback, useEffect, useReducer, useState} from 'react';
import {UserDetailsModel} from "./interfaces";
import axios, {AxiosInstance} from "axios";
import {tokenNeedsRefresh, useCognitoApi} from "@stanson/services";
import {Card, CardContent, makeStyles, Modal} from "@material-ui/core";
import {AuthMessages, StorageKeys, UserSession} from "@stanson/constants";

const initialState = {
  attemptLogin: false,
  requireLogin: false,
};

const UserStore = createContext<{
  state: UserModel;
  dispatch: React.Dispatch<any>;
  api: AxiosInstance
}>({state: initialState, dispatch: () => null, api: axios.create()});

const { Provider } = UserStore;

enum ActionType {
  LOGOUT = "LOGOUT",
  TOGGLE_REQUIRE_LOGIN = "REQUIRE_LOGIN",
  SET_USER_SESSION="SET_USER_SESSION"
}

interface ReducerModel {
  type: ActionType;
  data?: UserSession | string | LoginTypes | UserDetailsModel | any;
}

type LoginTypes = 'saml' | 'oauth';

interface UserModel {
  userDetails?: UserDetailsModel;
  loginType?: LoginTypes;
  requireLogin: boolean;
  attemptLogin: boolean;
  cognitoToken?: string;
  sessionDetails?: UserSession;
}

const UserActions = {
  setUserSession: (data: UserSession) => ({type: ActionType.SET_USER_SESSION, data}),
  loginRequired: () => ({type: ActionType.TOGGLE_REQUIRE_LOGIN}),
  logout: () => ({type: ActionType.LOGOUT}),
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

  const [state, dispatch] = useReducer<React.Reducer<UserModel, ReducerModel>>((state, action) => {
    switch(action.type) {
      case ActionType.LOGOUT:
        return {
          attemptLogin: false,
          requireLogin: true
        }
      case ActionType.TOGGLE_REQUIRE_LOGIN:
        return {
          ...state,
          requireLogin: true
        }
      case ActionType.SET_USER_SESSION:
        return {
          ...state,
          sessionDetails: {
            ...state.sessionDetails,
            token: action.data.token,
            expiration: action.data.expiration
          },
          requireLogin: false
        }
      default:
        throw new Error();
    }
  }, initialState);

  useEffect(() => {
    const token = localStorage.getItem(StorageKeys.STANSON_TOKEN)
    const expiration = localStorage.getItem(StorageKeys.STANSON_TOKEN_EXPIRATION)
    if (token && expiration && !tokenNeedsRefresh(parseInt(expiration))) {
      dispatch(UserActions.setUserSession({token, expiration: parseInt(expiration)}));
    } else {
      dispatch(UserActions.loginRequired());
    }

    window.addEventListener("message", (e) => {
      const data = e.data;
      const type = data?.action;
      switch(type) {
        case AuthMessages.SET_TOKEN:
          dispatch(UserActions.setUserSession({token: data.token, expiration: data.expiration}))
          localStorage.setItem(StorageKeys.STANSON_TOKEN, data.token);
          localStorage.setItem(StorageKeys.STANSON_TOKEN_EXPIRATION, data.expiration);
          break;
        case AuthMessages.LOGIN_REQUIRED:
          setDisplayLogin(true);
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

  const api = useCallback(useCognitoApi(state.sessionDetails, () => {
    if (state?.sessionDetails?.expiration && tokenNeedsRefresh(state.sessionDetails.expiration)) {
      setRequireAuthPage(true);
    }
  }), [state?.sessionDetails?.expiration, state?.sessionDetails?.token]);

  useEffect(() => {
    if (state.requireLogin) {
      setRequireAuthPage(true);
    }
  }, [state.requireLogin])

  const displayIframe = {
    display: (displayLogin) ? "block" : "none"
  }

  const setupComplete = state?.sessionDetails?.expiration && state?.sessionDetails?.token;

  return (
    <React.Fragment>
    {
      setupComplete &&
      <Provider value={{ state, dispatch, api }}>
        {!state.requireLogin && props.children}
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

export { UserStore, LoggedInUser, UserActions }
