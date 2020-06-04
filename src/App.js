import React, { Component } from "react";
import { Api } from "./Components/Api";
import Header from "./Components/Header";
import Main from "./Components/Main";
import BasicUsage from "./Components/SendModel";
import { ThemeProvider, CSSReset, Button } from "@chakra-ui/core";

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      message: {},
      labels: [],
    };
  }

  componentDidMount() {
    window.gapi.load("client:auth2", {
      callback: () => {
        // Handle gapi.client initialization.
        window.gapi.client.setApiKey(Api.apiKey);
        window.gapi.auth.authorize(
          {
            client_id: Api.clientId,
            scope: Api.scopes,
            immediate: true,
          },
          this.handleAuthResult
        );
      },
      onerror: function () {
        // Handle loading error.
        alert("gapi.client failed to load!");
      },
      timeout: 5000, // 5 seconds.
      ontimeout: function () {
        // Handle timeout.
        alert("gapi.client could not load in a timely manner!");
      },
    });
  }

  handleAuthResult = (authResult) => {
    if (authResult && !authResult.error) {
      console.log("Sign-in successful");
      console.log(authResult);
      this.hideAuthBtn();
      this.loadClient();
    } else {
      console.error("handleAuthResult...");
      console.error(authResult);
      this.displayAuthBtn();
    }
  };

  hideAuthBtn = () => {
    document.getElementById("authBtn").style.display = "none";
  };

  displayAuthBtn = () => {
    document.getElementById("authBtn").style.display = "block";
  };

  handleAuthClick = () => {
    return window.gapi.auth.authorize(
      {
        client_id: Api.clientId,
        scope: Api.scopes,
        immediate: false,
      },
      this.handleAuthResult
    );
  };

  loadClient = () => {
    return window.gapi.client.load("gmail", "v1").then(
      (res) => {
        console.log("window.gapi client loaded for API");
        this.getLabels();
      },
      (err) => {
        console.error("Error loading window.gapi client for API", err);
      }
    );
  };

  getLabels = () => {
    return window.gapi.client.gmail.users.labels
      .list({
        userId: "me",
      })
      .then(
        (response) => {
          // Handle the results here (response.result has the parsed body).
          console.log("getLabels...");
          var labels = response.result.labels;
          console.log(labels);
          this.setState({
            labels: response.result.labels,
          });
        },
        (err) => {
          console.error("getLabels error", err);
        }
      );
  };

  render() {
    console.log(this.state);

    return (
      <React.Fragment>
        <ThemeProvider>
          <CSSReset />
          {/* <Header /> */}
          {/* <BasicUsage /> */}

          <Button
            id='authBtn'
            display='none'
            variantColor='teal'
            variant='outline'
            onClick={this.handleAuthClick}
          >
            Authorize
          </Button>

          <Main />
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default App;
