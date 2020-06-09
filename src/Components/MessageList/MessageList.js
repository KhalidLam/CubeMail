import React from "react";
import CustomSkeleton from "./CustomSkeleton";
import { getHeader, isEmpty, decodeHtml, removeQuote } from "../Helper";
import {
  Flex,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Avatar,
  Text,
} from "@chakra-ui/core";

const Messages = ({ handleMessageClick, messagesRow }) => {
  if (!isEmpty(messagesRow)) {
    return (
      <React.Fragment>
        <Flex
          direction='column'
          wrap='no-wrap'
          w='26%'
          h='100%'
          bg='#f1f1f1'
          color='black'
        >
          {/* Search bar */}
          <Box py='5px' bg='white' border='1px' borderColor='gray.200'>
            <InputGroup size='lg'>
              <InputLeftElement
                children={<Icon name='search' color='gray.300' />}
              />
              <Input
                type='text'
                placeholder='Search mail'
                borderWidth='0px'
                borderRadius='0px'
                focusBorderColor='white'
              />
            </InputGroup>
          </Box>

          {/* Message List */}
          <Box overflowY='auto'>
            {messagesRow.map((message) => {
              const name = removeQuote(
                getHeader(message.payload.headers, "From").split("<")[0]
              );
              const subject = getHeader(message.payload.headers, "Subject");
              const msg = message.snippet.substr(0, 75);
              const background =
                message.labelIds.indexOf("UNREAD") > -1 ? "#fff" : "#E2E8F0";

              return (
                <Flex
                  key={message.id}
                  id={message.id}
                  onClick={handleMessageClick}
                  wrap='no-wrap'
                  justify='space-around'
                  py={2}
                  bg={background}
                  borderTop='1px'
                  borderBottom='1px'
                  borderColor='gray.300'
                  cursor='pointer'
                >
                  <Avatar name={name} src='https://bit.ly/tioluwani-kolawole' />
                  <Box w='80%'>
                    <Text fontSize='sm' color='gray.700' isTruncated>
                      {removeQuote(name)}
                    </Text>
                    <Text
                      fontSize='md'
                      fontWeight='bold'
                      color='#3182ce'
                      isTruncated
                    >
                      {subject}
                    </Text>
                    <Text fontSize='xs' color='gray.500'>
                      {decodeHtml(msg)}
                    </Text>
                  </Box>
                </Flex>
              );
            })}
          </Box>
        </Flex>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        {/* Container */}
        <Flex
          direction='column'
          wrap='no-wrap'
          w='26%'
          h='100%'
          bg='#f1f1f1'
          color='black'
        >
          {/* Search bar */}
          <Box py='5px' bg='white' border='1px' borderColor='gray.200'>
            <InputGroup size='lg'>
              <InputLeftElement
                children={<Icon name='search' color='gray.300' />}
              />
              <Input
                type='text'
                placeholder='Search mail'
                borderWidth='0px'
                borderRadius='0px'
                focusBorderColor='white'
              />
            </InputGroup>
          </Box>

          {/* Message List */}
          {/* Display Skeleton */}
          <CustomSkeleton />
          <CustomSkeleton />
          <CustomSkeleton />
          <CustomSkeleton />
          <CustomSkeleton />

          {/* Display Spinner */}
          {/*
          <Box mt={6} display='flex' align='center' justifyContent='center'>
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            />
          </Box>
          */}
        </Flex>
      </React.Fragment>
    );
  }
};

export default Messages;
