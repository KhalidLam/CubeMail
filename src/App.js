import React, { Fragment, useEffect, useState } from "react";

import Aside from "./Components/Aside/Aside";
import MessageList from "./Components/MessageList/MessageList";
import Message from "./Components/Message/Message";

import { ThemeProvider, CSSReset, Button, Flex } from "@chakra-ui/core";

import "./App.css";

const App = () => {
  // const [labels, setlabels] = useState([]); // Todo - sort labels dynamically
  const [messagesRow, setMessagesRow] = useState([]);
  const [message, setMessage] = useState({});

  useEffect(() => {
    window.gapi.load("client:auth2", {
      callback: () => {
        // Handle gapi.client initialization.
        window.gapi.client.setApiKey(process.env.REACT_APP_API_KEY);
        window.gapi.auth.authorize(
          {
            client_id: process.env.REACT_APP_CLIENT_ID,
            scope: process.env.REACT_APP_SCOPES,
            immediate: true,
          },
          handleAuthResult
        );
      },
      onerror: function () {
        // Handle loading error.
        console.log("gapi.client failed to load!");
      },
      timeout: 5000, // 5 seconds.
      ontimeout: function () {
        // Handle timeout.
        console.log("gapi.client could not load in a timely manner!");
      },
    });
    // eslint-disable-next-line
  }, []);

  const handleAuthResult = (authResult) => {
    if (authResult && !authResult.error) {
      console.log("Sign-in successful");
      hideAuthBtn();
      loadClient();
    } else {
      console.error("handleAuthResult...");
      console.error(authResult);
      displayAuthBtn();
    }
  };

  const hideAuthBtn = () => {
    document.getElementById("authBtn").style.display = "none";
  };

  const displayAuthBtn = () => {
    document.getElementById("authBtn").style.display = "block";
  };

  const handleAuthClick = () => {
    return window.gapi.auth.authorize(
      {
        client_id: process.env.REACT_APP_CLIENT_ID,
        scope: process.env.REACT_APP_SCOPES,
        immediate: false,
      },
      handleAuthResult
    );
  };

  const loadClient = () => {
    return window.gapi.client.load("gmail", "v1").then(
      (res) => {
        console.log("gapi client loaded for API");
        getMessages();
      },
      (err) => {
        console.error("Error loading window.gapi client for API", err);
      }
    );
  };

  // ----------- REQUEST ------------
  const getMessages = (labelIds = "INBOX") => {
    return window.gapi.client.gmail.users.messages
      .list({
        userId: "me",
        labelIds: labelIds,
        maxResults: 20,
      })
      .then(
        (response) => {
          // Handle the results here (response.result has the parsed body).
          const messages = response.result.messages
            ? response.result.messages
            : [];

          setMessagesRow([]);

          // Create & send request for each message id from messages List
          getMessagesRow(messages);
        },
        (err) => {
          console.error("getMessages error", err);
        }
      );
  };

  const getMessagesRow = (messages) => {
    messages.map((message) => {
      return window.gapi.client.gmail.users.messages
        .get({
          userId: "me",
          id: message.id,
        })
        .then(
          (response) => {
            setMessagesRow((messagesRow) => [...messagesRow, response.result]);
          },
          (err) => {
            console.error("getMessagesRow error", err);
          }
        );
    });
  };

  const getOneMessage = (messageId) => {
    return window.gapi.client.gmail.users.messages
      .get({
        userId: "me",
        id: messageId,
      })
      .then(
        (response) => {
          setMessage(response.result);
        },
        (err) => {
          console.error("getMessage error", err);
        }
      );
  };

  return (
    <Fragment>
      <ThemeProvider>
        <CSSReset />
        <Button
          id='authBtn'
          display='none'
          variantColor='teal'
          variant='outline'
          onClick={handleAuthClick}
        >
          Authorize
        </Button>

        <Flex
          h='100vh'
          minH='600px'
          justify='space-arround'
          wrap='no-wrap'
          p='1em'
          bg='#e5f4f1'
          color='white'
        >
          <Aside getMessages={getMessages} />
          <MessageList
            getOneMessage={getOneMessage}
            messagesRow={messagesRow}
          />
          <Message message={message} />
        </Flex>
      </ThemeProvider>
    </Fragment>
  );
};

export default App;
