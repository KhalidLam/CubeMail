import React, { useReducer } from "react";
import EmailContext from "./emailContext";
import EmailReducer from "./emailReducer";
import {
  SET_MESSAGE,
  SET_MESSAGES,
  CLEAR_MESSAGES,
  SET_LOADING,
  SET_CURRENT_LABEL,
  SET_NEXT_PAGE_TOKEN,
  SET_HAS_MORE_MESSAGES,
} from "../types";

const EmailState = (props) => {
  const initialState = {
    messages: [],
    message: null,
    currentLabel: "INBOX",
    nextPageToken: "",
    hasMoreMessages: true,
    isAuthorize: false,
    loading: false,
  };

  const [state, dispatch] = useReducer(EmailReducer, initialState);

  // Send reques to get IDs of 20 Messages and call getMessagesData(Ids)
  const getMessages = (labelIds = state.currentLabel) => {
    // Set Loading to true
    setLoading();

    // Empty previous messages
    clearMessages();

    const request = window.gapi.client.gmail.users.messages.list({
      userId: "me",
      labelIds: labelIds,
      maxResults: 20,
    });

    request.execute((resp) => {
      // Set NextPageToken
      if (resp.result.nextPageToken) {
        setNextPageToken(resp.result.nextPageToken);
        setHasMoreMessages(true);
      } else {
        setNextPageToken("");
        setHasMoreMessages(false);
      }

      // Send Id list to getMessagesData to get Message Data foreach Id
      getMessagesData(resp);
    });
  };

  const getMessagesQuery = (query) => {
    // Set Loading to true
    setLoading();

    // Empty previous messages
    clearMessages();

    // Get List of 20 message's Id
    const request = window.gapi.client.gmail.users.messages.list({
      userId: "me",
      q: query,
    });

    // Send Id list to getMessagesData to get Message Data foreach Id
    request.execute(getMessagesData);
  };

  // Send Request to get data of each message
  const getMessagesData = (resp) => {
    const messages = resp.result.messages ? resp.result.messages : [];

    // Get Data for each message
    messages.forEach((message) => {
      const request = window.gapi.client.gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });

      request.execute((resp) => {
        dispatch({
          type: SET_MESSAGES,
          payload: resp.result,
        });
      });
    });
  };

  // Get Message
  const getOneMessage = (messageId) => {
    const request = window.gapi.client.gmail.users.messages.get({
      userId: "me",
      id: messageId,
    });

    request.execute((resp) => {
      console.log(resp);
      dispatch({
        type: SET_MESSAGE,
        payload: resp.result,
      });
    });
  };

  // Load More Messages
  const loadMoreMessages = (labelIds = state.currentLabel) => {
    const request = window.gapi.client.gmail.users.messages.list({
      userId: "me",
      labelIds: labelIds,
      maxResults: 20,
      pageToken: state.nextPageToken,
    });

    request.execute((resp) => {
      if (resp.result.nextPageToken) {
        setNextPageToken(resp.result.nextPageToken);
        setHasMoreMessages(true);
      } else {
        setNextPageToken("");
        setHasMoreMessages(false);
      }

      getMessagesData(resp);
    });
  };

  // Set Next Page Token
  const setNextPageToken = (token) =>
    dispatch({ type: SET_NEXT_PAGE_TOKEN, payload: token });

  // Set Has More Messages
  const setHasMoreMessages = (bool) =>
    dispatch({ type: SET_HAS_MORE_MESSAGES, payload: bool });

  // Set Current Label
  const setCurrentLabel = (labelId) =>
    dispatch({ type: SET_CURRENT_LABEL, payload: labelId });

  // Clear Messages
  const clearMessages = () => dispatch({ type: CLEAR_MESSAGES });

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <EmailContext.Provider
      value={{
        messages: state.messages,
        message: state.message,
        currentLabel: state.currentLabel,
        nextPageToken: state.nextPageToken,
        hasMoreMessages: state.hasMoreMessages,
        loading: state.loading,
        getMessages,
        getMessagesQuery,
        getOneMessage,
        setCurrentLabel,
        loadMoreMessages,
        setLoading,
      }}
    >
      {props.children}
    </EmailContext.Provider>
  );
};

export default EmailState;
