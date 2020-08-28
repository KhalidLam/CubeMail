import React from "react";
import { getHeader, decodeHtml, removeQuote } from "../Helper";
import { Flex, Box, Avatar, Text } from "@chakra-ui/core";
import PropTypes from "prop-types";

const EmailRow = ({ message, handleMessageClick }) => {
  // Get name of email sender
  const name = removeQuote(
    getHeader(message.payload.headers, "From").split("<")[0]
  );

  // Get subject of email
  const subject = getHeader(message.payload.headers, "Subject");

  // Get part of email snippet
  const msg = decodeHtml(message.snippet.substr(0, 75));

  // Set backgroundColor to white if the mail is not yet opened
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

EmailRow.prototype = {
  message: PropTypes.object.isRequired,
  handleMessageClick: PropTypes.func.isRequired,
};
