import React from "react";
import Aside from "./Aside";
import MessageList from "./MessageList";
import Message from "./Message";
import { Box, Heading, Flex, Text, Button, useToast } from "@chakra-ui/core";
import { GiHamburgerMenu } from "react-icons/gi";

const Main = (props) => {
  return (
    <>
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
        <Message />
      </Flex>
    </>
  );
};

export default Main;
