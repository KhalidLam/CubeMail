import React, { useEffect, useState } from "react";

// Import Context
import EmailState from "./context/email/EmailState";

// Import Pages
import Main from "./pages/Main";
import SignIn from "./pages/SignIn";
import ErrorBoundary from "./Components/ErrorBoundary";

import { ChakraProvider, theme } from "@chakra-ui/react";

// Use default theme from Chakra UI v1

const App = () => {
  const [isAuthorize, setIsAuthorize] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    setLoading(true);

    const initializeGapi = async () => {
      try {
        await new Promise((resolve, reject) => {
          window.gapi.load("client", {
            callback: resolve,
            onerror: reject,
            timeout: 5000,
            ontimeout: reject,
          });
        });

        await window.gapi.client.init({
          apiKey: process.env.REACT_APP_API_KEY,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
        });

        // Initialize Google Identity Services (for OAuth token flow)
        setLoading(false);
        console.log("Google APIs initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Google APIs:", error);
        setLoading(false);
      }
    };

    initializeGapi();
  }, []);

  const handleTokenResponse = (tokenResponse) => {
    console.log("Token Response:", tokenResponse);
    
    if (tokenResponse.error) {
      console.error("Authentication failed:", tokenResponse.error);
      setAuthError(`Authentication failed: ${tokenResponse.error_description || tokenResponse.error}`);
      setLoading(false);
      return;
    }
    
    if (tokenResponse.access_token) {
      // Clear any previous errors
      setAuthError(null);
      
      // Set the access token for GAPI
      window.gapi.client.setToken({
        access_token: tokenResponse.access_token,
      });
      
      setIsAuthorize(true);
      console.log("Gmail API access granted successfully");
    } else {
      console.error("No access token received");
      setAuthError("Failed to receive access token from Google");
    }
    
    setLoading(false);
  };

  const handleAuthClick = () => {
    console.log("Starting authentication...");
    setLoading(true);
    setAuthError(null); // Clear previous errors
    
    if (!window.google || !window.google.accounts) {
      const errorMsg = "Google Identity Services not loaded";
      console.error(errorMsg);
      setAuthError(errorMsg);
      setLoading(false);
      return;
    }

    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.REACT_APP_CLIENT_ID,
        scope: process.env.REACT_APP_SCOPES,
        callback: handleTokenResponse,
        error_callback: (error) => {
          console.error("OAuth error:", error);
          setAuthError(`OAuth error: ${error.message || error}`);
          setLoading(false);
        },
      });
      
      // Request access token with explicit consent
      tokenClient.requestAccessToken({ 
        prompt: 'consent',
        hint: 'Select or enter the email account you want to use'
      });
    } catch (error) {
      console.error("Failed to initialize token client:", error);
      setAuthError(`Failed to initialize authentication: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <EmailState>
        <ChakraProvider theme={theme}>
          {isAuthorize ? (
            <Main />
          ) : (
            <SignIn 
              loading={loading} 
              handleAuthClick={handleAuthClick}
              error={authError}
            />
          )}
        </ChakraProvider>
      </EmailState>
    </ErrorBoundary>
  );
};

export default App;
