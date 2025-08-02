import React, { useEffect, useContext } from "react";
import EmailContext from "../context/email/emailContext";

// Import Components
import MailboxList from "../Components/MailboxList/MailboxList";
import EmailList from "../Components/EmailList/EmailList";
import Email from "../Components/Email/Email";

import { Flex } from "@chakra-ui/react";

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
      justify='space-around'
      wrap={{ base: 'wrap', lg: 'nowrap' }}
      p={{ base: '0.5rem', md: '1rem' }}
      bg='#e5f4f1'
      color='white'
      direction={{ base: 'column', lg: 'row' }}
    >
      <MailboxList />
      <EmailList />
      <Email />
    </Flex>
  );
};

export default Main;
