import React, { useEffect, useContext } from "react";
import EmailContext from "../context/email/emailContext"

// Import Components
import MailboxList from "../Components/MailboxList/MailboxList";
import EmailList from "../Components/EmailList/EmailList";
import Email from "../Components/Email/Email";

import { Flex } from "@chakra-ui/core";

const Main = () => {
  const { getMessages } = useContext(EmailContext);

  useEffect(() => {
    getMessages();
    // eslint-disable-next-line
  }, []);

  return (
    <Flex
      h='100vh'
      minH='600px'
      justify='space-arround'
      wrap='no-wrap'
      p='1em'
      bg='#e5f4f1'
      color='white'
    >
      <MailboxList />
      <EmailList />
      <Email />
    </Flex>
  );
};

export default Main;
