import React, { useEffect, useState } from "react";

// Import Context
import EmailState from "./context/email/EmailState";

// Import Pages
import Main from "./pages/Main";
import SignIn from "./pages/SignIn";

import { ThemeProvider, CSSReset } from "@chakra-ui/core";

const App = () => {
  const [isAuthorize, setIsAuthorize] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const initialGoogleConnection = async () => {
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
    };

    try {
      initialGoogleConnection();
    } catch (error) {
      console.log("error: ", error);
    }

    setLoading(false);
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
    }
    setLoading(false);
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
