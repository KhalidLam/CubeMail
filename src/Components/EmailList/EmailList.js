import React, { useContext } from "react";
import EmailContext from "../../context/email/emailContext";

import EmailRow from "./EmailRow";
import SearchBar from "./SearchBar";

import InfiniteScroll from "react-infinite-scroll-component";
import { Flex, Box, Spinner } from "@chakra-ui/core";

const Messages = () => {
  const {
    messages,
    getOneMessage,
    hasMoreMessages,
    loadMoreMessages,
  } = useContext(EmailContext);

  const handleMessageClick = (e) => {
    const messageId = e.currentTarget.getAttribute("id");
    getOneMessage(messageId);
  };

  return (
    <Box overflowY='auto' id='scrollableDiv'>
      <InfiniteScroll
        dataLength={messages.length}
        next={loadMoreMessages}
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

const CustomSpinner = () => (
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

const EmailList = () => {
  const { messages, loading } = useContext(EmailContext);

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
      <SearchBar />

      {/* Messages */}
      {!messages.length && loading ? <CustomSpinner /> : <Messages />}
    </Flex>
  );
};

export default EmailList;
