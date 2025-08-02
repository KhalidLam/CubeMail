import React, { useState, useContext } from "react";
import EmailContext from "../../context/email/emailContext";
import SendModel from "./SendModel";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

// Import Icons
import { MdLabel, MdStar, MdPeople, MdLoyalty, MdInbox } from "react-icons/md";
import { FiSend, FiFile, FiTrash } from "react-icons/fi";

const MailboxList = () => {
  const { getMessages, setCurrentLabel } = useContext(EmailContext);
  const [active, setActive] = useState("INBOX");

  const handleClick = (categoryId) => {
    setActive(categoryId);
    setCurrentLabel(categoryId);
    getMessages(categoryId);
  };

  const mailboxItems = [
    { id: 'INBOX', label: 'Inbox', icon: MdInbox },
    { id: 'STARRED', label: 'Starred', icon: MdStar },
    { id: 'IMPORTANT', label: 'Important', icon: MdLabel },
    { id: 'SENT', label: 'Sent', icon: FiSend },
    { id: 'DRAFT', label: 'Drafts', icon: FiFile },
    { id: 'TRASH', label: 'Trash', icon: FiTrash },
    { id: 'CATEGORY_SOCIAL', label: 'Social', icon: MdPeople },
    { id: 'CATEGORY_PROMOTIONS', label: 'Promotions', icon: MdLoyalty },
  ];

  return (
    <div className="w-full lg:w-[16%] h-auto lg:h-full bg-white border border-gray-200 rounded-l-md min-h-[200px] lg:min-h-0">
      {/* Send Model */}
      <div className="p-2 pb-4">
        <SendModel />
      </div>

      {/* Mailbox Navigation */}
      <nav className="space-y-1">
        {mailboxItems.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={active === id ? "default" : "ghost"}
            className={cn(
              "w-full h-11 justify-start pl-8 rounded-none text-left",
              active === id && "bg-blue-600 text-white hover:bg-blue-700"
            )}
            onClick={() => handleClick(id)}
          >
            <Icon className="mr-3 h-4 w-4" />
            {label}
          </Button>
        ))}
      </nav>
    </div>
  );
};

export default MailboxList;
