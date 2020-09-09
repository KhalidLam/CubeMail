import React, { useEffect, useState, useContext } from "react";

import EmailState from "./context/email/EmailState";
import EmailContext from "./context/email/emailContext";

import MailboxList from "./Components/MailboxList/MailboxList";
import EmailList from "./Components/EmailList/EmailList";
import Email from "./Components/Email/Email";

import { ThemeProvider, CSSReset, Button, Flex } from "@chakra-ui/core";
import { FcGoogle } from "react-icons/fc";

const SignIn = ({ handleAuthClick, loading }) => (
  <Flex h='100vh' justify='center' alignItems='center' bg='#e5f4f1'>
    <Button
      isLoading={loading}
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

const Main = () => {
  const { getMessages } = useContext(EmailContext);

  useEffect(() => {
    getMessages();
    // eslint-disable-next-line
  }, []);

  return (
    <Flex
      h='100vh'
      minH='600px'
      justify='space-arround'
      wrap='no-wrap'
      p='1em'
      bg='#e5f4f1'
      color='white'
    >
      <MailboxList />
      <EmailList />
      <Email />
    </Flex>
  );
};

const App = () => {
  const [isAuthorize, setIsAuthorize] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await window.gapi.load("client:auth2", {
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
    })();

    // eslint-disable-next-line
  }, []);

  const handleAuthResult = (authResult) => {
    if (authResult && !authResult.error) {
      console.log("Sign-in successful");
      // setIsAuthorize(true);
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
        setIsAuthorize(true);
        // getMessages();
      },
      (err) => {
        console.error("Error loading window.gapi client for API", err);
      }
    );
  };

  return (
    <EmailState>
      <ThemeProvider>
        <CSSReset />
        {isAuthorize ? (
          <Main />
        ) : (
          <SignIn loading={loading} handleAuthClick={handleAuthClick} />
        )}
      </ThemeProvider>
    </EmailState>
  );
};

export default App;
