import React from "react";
import Aside from "./Aside";
import MessageList from "./MessageList";
import Message from "./Message";
import { Flex } from "@chakra-ui/core";

const Main = ({ message }) => {
  return (
    <React.Fragment>
      <Flex
        h='100vh'
        minH='600px'
        justify='space-arround'
        wrap='no-wrap'
        p='2em 1em'
        bg='#e5f4f1'
        color='white'
      >
        <Aside />
        <MessageList />
        <Message message={message} />
      </Flex>
    </React.Fragment>
  );
};

export default Main;
