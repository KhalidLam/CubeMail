import React, { Component } from "react";
import Aside from "./Components/Aside/Aside";
import MessageList from "./Components/MessageList/MessageList";
import Message from "./Components/Message/Message";
import { Api } from "./Components/Api";
import { ThemeProvider, CSSReset, Button, Flex } from "@chakra-ui/core";

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      messagesRow: [],
      message: {},
    };
  }

  componentDidMount() {
    window.gapi.load("client:auth2", {
      callback: () => {
        // Handle gapi.client initialization.
        window.gapi.client.setApiKey(Api.API_KEY);
        window.gapi.auth.authorize(
          {
            client_id: Api.CLIENT_ID,
            scope: Api.SCOPES,
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
        client_id: Api.CLIENT_ID,
        scope: Api.SCOPES,
        immediate: false,
      },
      this.handleAuthResult
    );
  };

  loadClient = () => {
    return window.gapi.client.load("gmail", "v1").then(
      (res) => {
        console.log("window.gapi client loaded for API");
        this.getMessages();
      },
      (err) => {
        console.error("Error loading window.gapi client for API", err);
      }
    );
  };
  // ----------- REQUEST ------------
  getMessages = (labelIds = "INBOX") => {
    return window.gapi.client.gmail.users.messages
      .list({
        userId: "me",
        labelIds: labelIds,
        maxResults: 20,
      })
      .then(
        (response) => {
          // Handle the results here (response.result has the parsed body).
          console.log("getMessages...");
          console.log(response.result);

          const messages = response.result.messages
            ? response.result.messages
            : [];
          this.setState({
            messages: messages,
            messagesRow: [],
          });

          // Create & send request for each message id from messages List
          this.getMessagesRow(messages);
        },
        (err) => {
          console.error("getMessages error", err);
        }
      );
  };

  getMessagesRow = (messages) => {
    messages.map((message) => {
      return window.gapi.client.gmail.users.messages
        .get({
          userId: "me",
          id: message.id,
        })
        .then(
          (response) => {
            console.log("getMessagesRow...", response);
            this.setState((state) => ({
              messagesRow: [...state.messagesRow, response.result],
            }));
          },
          (err) => {
            console.error("getMessagesRow error", err);
          }
        );
    });
  };

  getOneMessage = (messageId) => {
    console.log("getOneMessage...");

    return window.gapi.client.gmail.users.messages
      .get({
        userId: "me",
        id: messageId,
      })
      .then(
        (response) => {
          this.setState({
            message: response.result,
          });
        },
        (err) => {
          console.error("getMessage error", err);
        }
      );
  };

  handleMessageClick = (e) => {
    console.log("handleMessageClick...");
    console.log("currentTarget", e.currentTarget);
    const messageId = e.currentTarget.getAttribute("id");
    console.log("Message ID : ", messageId);
    this.getOneMessage(messageId);
  };

  getMessagesByCategory = (e) => {
    var categoryId = e.target.id;
    console.log(categoryId);
    this.getMessages([categoryId]);
  };

  render() {
    console.log(this.state);
    const { message, messagesRow } = this.state;

    return (
      <React.Fragment>
        <ThemeProvider>
          <CSSReset />
          <Button
            id='authBtn'
            display='none'
            variantColor='teal'
            variant='outline'
            onClick={this.handleAuthClick}
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
            <Aside getMessagesByCategory={this.getMessagesByCategory} />
            <MessageList
              handleMessageClick={this.handleMessageClick}
              messagesRow={messagesRow}
            />
            <Message message={message} />
          </Flex>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default App;
