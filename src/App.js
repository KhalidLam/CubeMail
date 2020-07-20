import React, { useEffect, useState } from "react";

import MailboxList from "./Components/MailboxList/MailboxList";
import EmailList from "./Components/EmailList/EmailList";
import Email from "./Components/Email/Email";

import { ThemeProvider, CSSReset, Button, Flex } from "@chakra-ui/core";
import { FcGoogle } from "react-icons/fc";

export const EmailContext = React.createContext();

const App = () => {
  // const [labels, setlabels] = useState([]); // Todo - sort labels dynamically
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState({});
  const [nextPageToken, setNextPageToken] = useState("");
  const [isAuthorize, setIsAuthorize] = useState(false);
  const [loading, setLoading] = useState(true);

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
      setIsAuthorize(true);
      loadClient();
    } else {
      console.error("handleAuthResult...");
      console.error(authResult);
      setLoading(false);
    }
  };

  const handleAuthClick = () => {
    setLoading(true);
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

  // ----------- Functions to Get Data from Gmail Api ------------
  const getMessages = (labelIds = "INBOX") => {
    // Get List of 20 message's Id
    window.gapi.client.gmail.users.messages
      .list({
        userId: "me",
        labelIds: labelIds,
        maxResults: 20,
      })
      .then((resp) => {
        // Empty previous messages
        setMessages([]);
        console.log(resp.result);

        // Set NextPageToken
        setNextPageToken(resp.nextPageToken);

        // Get Next Pages Messages Id
        getNextPageMessages();

        // Send Id list to getMessagesData to get Message Data foreach Id
        getMessagesData(resp);
      })
      .catch((error) => {
        console.log(error);
      });

    // request.execute(getMessagesData);
  };

  const getNextPageMessages = () => {
    // nextPageToken =
    return window.gapi.client.gmail.users.messages
      .list({
        userId: "eclipsegk10@gmail.com",
        maxResults: 20,
        pageToken: nextPageToken,
      })
      .then((response) => {
        console.log("Next Page Emails :", response.result);
        // Send Request for each message Id
        response.result.messages.forEach((message) => {
          window.gapi.client.gmail.users.messages
            .get({
              userId: "me",
              id: message.id,
            })
            .then(
              (response) => {
                // setMessages((messages) => [...messages, response.result]);
                console.log(response.result);
              },
              (err) => {
                console.error("getMessagesData error", err);
              }
            );
        });
      })
      .catch((err) => {
        console.error("Execute error", err);
      });
  };

  const getMessagesData = (response) => {
    const messages = response.result.messages ? response.result.messages : [];

    messages.forEach((message) => {
      window.gapi.client.gmail.users.messages
        .get({
          userId: "me",
          id: message.id,
        })
        .then(
          (response) => {
            setMessages((messages) => [...messages, response.result]);
          },
          (err) => {
            console.error("getMessagesData error", err);
          }
        );
    });
  };

  const getOneMessage = (messageId) => {
    window.gapi.client.gmail.users.messages
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
    <EmailContext.Provider
      value={{
        messages,
        message,
        getMessages,
        getOneMessage,
      }}
    >
      <ThemeProvider>
        <CSSReset />
        {isAuthorize ? (
          <Main
            getMessages={getMessages}
            getOneMessage={getOneMessage}
            messages={messages}
            message={message}
          />
        ) : (
          <SignIn loading={loading} handleAuthClick={handleAuthClick} />
        )}
      </ThemeProvider>
    </EmailContext.Provider>
  );
};

export default App;

const SignIn = ({ handleAuthClick, loading }) => (
  <Flex h='100vh' justify='center' alignItems='center' bg='#e5f4f1'>
    <Button
      isLoading={loading}
      // loadingText='Loading...'
      leftIcon={FcGoogle}
      height='50px'
      variantColor='blue'
      variant='outline'
      backgroundColor='white'
      onClick={handleAuthClick}
    >
      Sign in with Google
    </Button>
  </Flex>
);

const Main = ({ getMessages, getOneMessage, messages, message }) => (
  <Flex
    h='100vh'
    minH='600px'
    justify='space-arround'
    wrap='no-wrap'
    p='1em'
    bg='#e5f4f1'
    color='white'
  >
    <MailboxList getMessages={getMessages} />
    <EmailList getOneMessage={getOneMessage} messages={messages} />
    <Email message={message} />
  </Flex>
);
