import React, {createContext, useEffect, useReducer} from 'react';
import {LoginModal} from "../index";
import {UserDetailsModel} from "./interfaces";
import { api } from "@stanson/services";

const initialState = {
  attemptLogin: false,
  requireLogin: false,
};

const UserStore = createContext<{
  state: UserModel;
  dispatch: React.Dispatch<any>;
}>({state: initialState, dispatch: () => null});

const { Provider } = UserStore;

enum ActionType {
  ATTEMPT_LOGIN = "ATTEMPT_LOGIN",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGOUT = "LOGOUT",
  TOGGLE_REQUIRE_LOGIN = "REQUIRE_LOGIN",
  SET_USER_DETAILS = "SET_USER_DETAILS",
}

interface ReducerModel {
  type: ActionType;
  data?: UserDetailsModel | any;
}

interface UserModel {
  userDetails?: UserDetailsModel
  requireLogin: boolean;
  attemptLogin: boolean;
}

const UserActions = {
  loginAttempt: () => ({type: ActionType.ATTEMPT_LOGIN}),
  loginRequired: () => ({type: ActionType.TOGGLE_REQUIRE_LOGIN}),
  LoginSuccess: () => ({type: ActionType.LOGIN_SUCCESS}),
  logout: () => ({type: ActionType.LOGOUT}),
  setUserData: (data: UserDetailsModel) => ({type: ActionType.SET_USER_DETAILS, data: data}),
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
      case ActionType.ATTEMPT_LOGIN:
        return {
          ...state,
          attemptLogin: true
        }
      default:
        throw new Error();
    }
  }, initialState);

  useEffect(() => {
    if (!state.requireLogin) {
      api.get("userDetails", {withCredentials: true}).then((response) => {
        dispatch({type: ActionType.SET_USER_DETAILS, data: response.data})
      }).catch(err => {
        console.log('err', err?.response?.status);
        if (err.response?.status === 401) {
          dispatch(UserActions.loginRequired())
        }
      })
    }
  }, [state.requireLogin])

  return (
    <Provider value={{ state, dispatch }}>
      {!state.requireLogin && props.children}
      <LoginModal open={state.requireLogin}></LoginModal>
    </Provider>
  )
}

export { UserStore, LoggedInUser, UserActions }
