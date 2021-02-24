import React, {createContext, useEffect, useReducer, useState} from 'react';
import {UserDetailsModel} from "./interfaces";
import {AxiosInstance} from "axios";
import {useCognitoApi} from "@stanson/services";
import {Card, CardContent, makeStyles, Modal} from "@material-ui/core";
import {AuthMessages, StorageKeys} from "@stanson/constants";

const initialState = {
  attemptLogin: false,
  requireLogin: false,
};

const UserStore = createContext<{
  state: UserModel;
  dispatch: React.Dispatch<any>;
  api?: AxiosInstance
}>({state: initialState, dispatch: () => null});

const { Provider } = UserStore;

enum ActionType {
  ATTEMPT_LOGIN = "ATTEMPT_LOGIN",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  SET_LOGIN_TYPE = "SET_LOGIN_TYPE",
  LOGOUT = "LOGOUT",
  TOGGLE_REQUIRE_LOGIN = "REQUIRE_LOGIN",
  SET_USER_DETAILS = "SET_USER_DETAILS",
  LOGIN_FAILED= "LOGIN_FAILED",
  SET_USER_SESSION="SET_USER_SESSION"
}

interface ReducerModel {
  type: ActionType;
  data?: string | LoginTypes | UserDetailsModel | any;
}

type LoginTypes = 'saml' | 'oauth';

interface UserModel {
  userDetails?: UserDetailsModel;
  loginType?: LoginTypes;
  requireLogin: boolean;
  attemptLogin: boolean;
  cognitoToken?: string;
}

const UserActions = {
  loginAttempt: () => ({type: ActionType.ATTEMPT_LOGIN}),
  setLoginType: (data: LoginTypes) => ({type: ActionType.SET_LOGIN_TYPE, data}),
  setUserSession: (data: string) => ({type: ActionType.SET_USER_SESSION, data}),
  loginRequired: () => ({type: ActionType.TOGGLE_REQUIRE_LOGIN}),
  LoginSuccess: () => ({type: ActionType.LOGIN_SUCCESS}),
  loginFailed: () => ({type: ActionType.LOGIN_FAILED}),
  logout: () => ({type: ActionType.LOGOUT}),
  setUserData: (data: UserDetailsModel) => ({type: ActionType.SET_USER_DETAILS, data}),
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

const LoggedInUser: React.FC = (props) => {
  const classes = useStyles();

  const [displayLogin, setDisplayLogin] = useState();

  const [state, dispatch] = useReducer<React.Reducer<UserModel, ReducerModel>>((state, action) => {
    switch(action.type) {
      case ActionType.LOGIN_SUCCESS:
        return {
          ...state,
          requireLogin: false
        }
      case ActionType.SET_USER_DETAILS:
        return {
          ...state,
          userDetails: {
            ...action.data
          }
        }
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
          cognitoToken: action.data,
          requireLogin: false
        }
      case ActionType.SET_LOGIN_TYPE:
        return {
          ...state,
          loginType: action.data
        }
      case ActionType.ATTEMPT_LOGIN:
        return {
          ...state,
          attemptLogin: true
        }
      case ActionType.LOGIN_FAILED:
        return {
          ...state,
          attemptLogin: false,
          requireLogin: true
        }
      default:
        throw new Error();
    }
  }, initialState);

  useEffect(() => {
    const token = localStorage.getItem(StorageKeys.STANSON_TOKEN)
    if (token) {
      dispatch(UserActions.setUserSession(token));
    } else {
      dispatch(UserActions.loginRequired());
    }
  }, [])

  useEffect(() => {
    window.addEventListener("message", (e) => {
      const data = e.data;
      const type = data?.action;

      console.log(type, data);

      switch(type) {
        case AuthMessages.SET_TOKEN:
          dispatch(UserActions.setUserSession(data.token))
          localStorage.setItem(StorageKeys.STANSON_TOKEN, data.token);
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
          if (e.source) {

          }
          break;
        default:
          console.log('unknown message', e);
          break;

      }

    }, false);
  }, [])

  const api = useCognitoApi(state.cognitoToken);

  const displayIframe = {
    display: (displayLogin) ? "block" : "none"
  }

  return (
    <React.Fragment>
    {
      api &&
      <Provider value={{ state, dispatch, api }}>
        {!state.requireLogin && props.children}
      </Provider>
    }
      <Modal style={displayIframe} open={true} className={classes.modal}>
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
