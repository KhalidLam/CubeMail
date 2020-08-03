import React from "react";
import { getHeader, decodeHtml, removeQuote } from "../Helper";
import { Flex, Box, Avatar, Text } from "@chakra-ui/core";

const EmailRow = ({ message, handleMessageClick }) => {
  const name = removeQuote(
    getHeader(message.payload.headers, "From").split("<")[0]
  );
  const subject = getHeader(message.payload.headers, "Subject");
  const msg = decodeHtml(message.snippet.substr(0, 75));
  const backgroundColor =
    message.labelIds.indexOf("UNREAD") > -1 ? "#fff" : "#E2E8F0";

  return (
    <Flex
      key={message.id}
      id={message.id}
      onClick={handleMessageClick}
      wrap='no-wrap'
      justify='space-around'
      py={2}
      bg={backgroundColor}
      borderTop='1px'
      borderBottom='1px'
      borderColor='gray.300'
      cursor='pointer'
    >
      <Avatar name={name} src='https://bit.ly/tioluwani-kolawole' />
      <Box w='80%'>
        <Text fontSize='sm' color='gray.700' isTruncated>
          {name}
        </Text>
        <Text fontSize='md' fontWeight='bold' color='#3182ce' isTruncated>
          {subject}
        </Text>
        <Text fontSize='xs' color='gray.500'>
          {msg}
        </Text>
      </Box>
    </Flex>
  );
};

export default EmailRow;
