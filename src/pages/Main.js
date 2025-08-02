import React, { useEffect, useContext } from "react";
import EmailContext from "../context/email/emailContext";

// Import Components
import MailboxList from "../Components/MailboxList/MailboxList";
import EmailList from "../Components/EmailList/EmailList";
import Email from "../Components/Email/Email";

const Main = () => {
  const { getMessages } = useContext(EmailContext);

  useEffect(() => {
    getMessages();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen min-h-[600px] justify-around flex-wrap lg:flex-nowrap p-2 md:p-4 bg-[#e5f4f1] text-white">
      <MailboxList />
      <EmailList />
      <Email />
    </div>
  );
};

export default Main;
