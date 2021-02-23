import React, {createContext, useEffect, useReducer} from 'react';
import {LoginModal} from "../index";
import {UserDetailsModel} from "./interfaces";
import {CognitoUser} from "amazon-cognito-identity-js";
import {AxiosInstance} from "axios";
import {useCognitoApi} from "@stanson/services";
import {Auth} from "aws-amplify";

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
  data?: CognitoUser | LoginTypes | UserDetailsModel | any;
}

type LoginTypes = 'saml' | 'oauth';

interface UserModel {
  userDetails?: UserDetailsModel;
  loginType?: LoginTypes;
  requireLogin: boolean;
  attemptLogin: boolean;
  cognitoUser?: CognitoUser;
}

const UserActions = {
  loginAttempt: () => ({type: ActionType.ATTEMPT_LOGIN}),
  setLoginType: (data: LoginTypes) => ({type: ActionType.SET_LOGIN_TYPE, data}),
  setUserSession: (data: CognitoUser) => ({type: ActionType.SET_USER_SESSION, data}),
  loginRequired: () => ({type: ActionType.TOGGLE_REQUIRE_LOGIN}),
  LoginSuccess: () => ({type: ActionType.LOGIN_SUCCESS}),
  loginFailed: () => ({type: ActionType.LOGIN_FAILED}),
  logout: () => ({type: ActionType.LOGOUT}),
  setUserData: (data: UserDetailsModel) => ({type: ActionType.SET_USER_DETAILS, data}),
}

const LoggedInUser: React.FC = (props) => {
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
          cognitoUser: action.data
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

  // 1. grab token from local storage
  useEffect(() => {
    (async () => {
      const user = await Auth.currentUserPoolUser().catch((err) => {
        //2. no token available so lets login
        dispatch(UserActions.loginRequired());
      });
      dispatch(UserActions.setUserSession(user));
    })()
  }, [])

  const api = useCognitoApi(state.cognitoUser);


  // 2. if no token we need to fetch from localStorage

  // 3. if localStorage has nothing we need to check with shared domain

  // 4. if shared domain comes back with nothing, we require login

  console.log('rendering', state);

  return (
    <React.Fragment>
    {
      api &&
      <Provider value={{ state, dispatch, api }}>
        {!state.requireLogin && props.children}
      </Provider>
    }
      <LoginModal open={state.requireLogin}></LoginModal>
    </React.Fragment>

  )
}

export { UserStore, LoggedInUser, UserActions }
