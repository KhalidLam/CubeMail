import React from "react";
import { getHeader, decodeHtml, removeQuote } from "../Helper";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "../../lib/utils";
import PropTypes from "prop-types";

const EmailRow = ({ message, handleMessageClick }) => {
  // Get name of email sender
  const name = removeQuote(
    getHeader(message.payload.headers, "From").split("<")[0]
  );

  // Get subject of email
  const subject = getHeader(message.payload.headers, "Subject");

  // Get part of email snippet
  const msg = decodeHtml(message.snippet.substring(0, 75));

  // Set backgroundColor to white if the mail is not yet opened
  const backgroundColor =
    message.labelIds.indexOf("UNREAD") > -1 ? "#fff" : "#E2E8F0";

  return (
    <div
      key={message.id}
      id={message.id}
      onClick={handleMessageClick}
      className={cn(
        "flex items-center space-x-3 py-2 px-3 cursor-pointer border-t border-b border-gray-300 hover:bg-gray-50 transition-colors",
        backgroundColor === "#fff" ? "bg-white" : "bg-gray-100"
      )}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src="https://bit.ly/tioluwani-kolawole" alt={name} />
        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 truncate font-medium">
          {name}
        </p>
        <p className="text-base font-bold text-blue-600 truncate">
          {subject}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {msg}
        </p>
      </div>
    </div>
  );
};

export default EmailRow;

EmailRow.propTypes = {
  message: PropTypes.object.isRequired,
  handleMessageClick: PropTypes.func.isRequired,
};
