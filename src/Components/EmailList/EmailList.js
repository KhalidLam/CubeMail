import React, { useContext } from "react";
import { EmailContext } from "../../App";
import EmailRow from "./EmailRow";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Flex,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Spinner,
} from "@chakra-ui/core";

const EmailList = () => {
  const { messages } = useContext(EmailContext);

  return (
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
      {!messages.length ? <ListSpinner /> : <MessagesList />}
    </Flex>
  );
};

export default EmailList;

const MessagesList = () => {
  const {
    messages,
    getOneMessage,
    hasMoreMessages,
    loadMoreMessages,
  } = useContext(EmailContext);


  const fetchMoreData = () => {
    // Load more Messages
    loadMoreMessages();
  };

  const handleMessageClick = (e) => {
    const messageId = e.currentTarget.getAttribute("id");
    getOneMessage(messageId);
  };

  return (
    <Box overflowY='auto' id='scrollableDiv'>
      <InfiniteScroll
        dataLength={messages.length}
        next={fetchMoreData}
        hasMore={hasMoreMessages}
        loader={<h4>Loading...</h4>}
        scrollableTarget='scrollableDiv'
      >
        {messages.map((message, index) => (
          <EmailRow
            key={index}
            message={message}
            handleMessageClick={handleMessageClick}
          />
        ))}
      </InfiniteScroll>
    </Box>
  );
};

const ListSpinner = () => (
  <Box mt={6} display='flex' align='center' justifyContent='center'>
    <Spinner
      thickness='4px'
      speed='0.65s'
      emptyColor='gray.200'
      color='blue.500'
      size='xl'
    />
  </Box>
);
