import React, { useContext } from "react";
import EmailContext from "../../context/email/emailContext";

import EmailRow from "./EmailRow";
import SearchBar from "./SearchBar";

import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "../ui/spinner";

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
    <div className="overflow-y-auto flex-1" id="scrollableDiv">
      <InfiniteScroll
        dataLength={messages.length}
        next={loadMoreMessages}
        hasMore={hasMoreMessages}
        loader={
          <div className="flex justify-center py-4">
            <Spinner className="h-6 w-6" />
          </div>
        }
        scrollableTarget="scrollableDiv"
      >
        {messages.map((message) => (
          <EmailRow
            key={message.id}
            message={message}
            handleMessageClick={handleMessageClick}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};

const CustomSpinner = () => (
  <div className="mt-6 flex items-center justify-center">
    <Spinner className="h-8 w-8 text-blue-500" />
  </div>
);

const EmailList = () => {
  const { messages, loading } = useContext(EmailContext);

  return (
    <div className="flex flex-col w-full lg:w-[26%] h-[50vh] lg:h-full bg-gray-100 text-black min-h-[300px] lg:min-h-0">
      {/* Search bar */}
      <SearchBar />

      {/* Messages */}
      {!messages.length && loading ? <CustomSpinner /> : <Messages />}
    </div>
  );
};

export default EmailList;
