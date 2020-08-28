import React, { useReducer } from "react";
import EmailContext from "./emailContext";
import EmailReducer from "./emailReducer";
import {
  SET_MESSAGE,
  GET_MESSAGE,
  SET_MESSAGES,
  GET_MESSAGES,
  SET_LOADING,
  SET_IS_AUTHORIZE,
  SET_CURRENT_LABEL,
  GET_CURRENT_LABEL,
} from "../types";

const EmailStat = (props) => {
  const initialState = {
    messages: [],
    message: {},
    hasMoreMessages: true,
    isAuthorize: false,
    loading: false,
  };

  const [state, dispatch] = useReducer(EmailReducer, initialState);

  // Get Authorisation

  // Get Messages

  // Get Message

  // Clear Messages

  // Set Loading

  return (
    <EmailContext.Provider
      value={{
        messages: state.messages,
        message: state.message,
        loading: state.loading,
      }}
    >
      {props.children}
    </EmailContext.Provider>
  );
};

export default EmailStat;

{
  /* <EmailContext.Provider
      value={{
        messages: state.messages,
        message: state.message,
        loading: state.loading,
        getMessages,
        getOneMessage,
        setCurrentLabel,
        hasMoreMessages,
        loadMoreMessages,
      }}
    ></EmailContext.Provider> */
}
