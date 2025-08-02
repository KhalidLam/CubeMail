import React, { Fragment, useContext } from "react";
import EmailContext from "../../context/email/emailContext";

import ReplyModel from "./ReplyModel";
import ForwardModel from "./ForwardModel";

import { getHeader, removeQuote, formatDate } from "../Helper"; // Helper functions
import { Base64 } from "js-base64";
import { MdArchive } from "react-icons/md"; // Icons
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useToast } from "../../hooks/useToast";
import { FiTrash } from "react-icons/fi";

import emptyEmailImg from "./empty_email.svg";

const Email = () => {
  const { message } = useContext(EmailContext);
  const headers = message ? message.payload.headers : [];
  const toast = useToast();

  React.useEffect(() => {
    if (message) {
      addToFrame(message);
    }
    // eslint-disable-next-line
  }, [message]);

  const formatReplayData = (headers) => {
    const replayTo =
      getHeader(headers, "Reply-to") !== undefined
        ? getHeader(headers, "Reply-to")
        : getHeader(headers, "From");
    const replaySubject = getHeader(headers, "Subject");
    const replayMsgId = getHeader(headers, "Message-ID");

    return {
      to: `${replayTo}`,
      subject: `Re: ${replaySubject}`,
      msgId: `${replayMsgId}`,
    };
  };

  const handleTrashBtn = (userId, messageId) => {
    return window.gapi.client.gmail.users.messages
      .trash({
        userId: userId,
        id: messageId,
      })
      .then((resp) => {
        if (resp.status === 200) {
          toast({
            title: "Message Deleted",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        console.log("error: ", error);
        toast({
          title: "An error occurred.",
          description: "Unable to Delete Message.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleArchiveBtn = (ids, labelIds) => {
    return window.gapi.client.gmail.users.messages
      .batchModify({
        userId: "me",
        resource: {
          ids: ids,
          removeLabelIds: labelIds,
        },
      })
      .then((resp) => {
        if (resp.status === 204) {
          toast({
            title: "Message Archived",
            description: "The Message is now in archive category.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        console.log("error: ", error);
        toast({
          title: "An error occurred.",
          description: "Unable to Archive Message.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const addToFrame = (message) => {
    let ifrm = document.getElementById("iframe").contentWindow.document;
    ifrm.body.innerHTML = getMessageBody(message.payload);
  };

  const getMessageBody = (message) => {
    const encodedBody =
      typeof message.parts === "undefined"
        ? message.body.data
        : getHTMLPart(message.parts);

    return Base64.decode(encodedBody);
  };

  const getHTMLPart = (arr) => {
    for (var x = 0; x <= arr.length; x++) {
      if (typeof arr[x].parts === "undefined") {
        if (arr[x].mimeType === "text/html") {
          return arr[x].body.data;
        }
      } else {
        return getHTMLPart(arr[x].parts);
      }
    }
    return "";
  };

  return (
    <div className="flex flex-col w-full lg:w-[58%] h-full lg:h-full p-2 lg:p-4 bg-white text-black border border-gray-200 rounded-r-md min-h-[400px] lg:min-h-auto">
      {!message ? (
        <EmptyMail />
      ) : (
        <Fragment>
          {/* Header Buttons */}
          <div className="flex justify-around flex-wrap lg:flex-nowrap mb-2 gap-2 lg:gap-0">
            <ReplyModel replayData={formatReplayData(headers)} />
            <ForwardModel
              forwardData={message}
              getMessageBody={getMessageBody}
            />
            <Button
              variant="outline"
              onClick={() => handleArchiveBtn([message.id], ["INBOX"])}
              className="flex items-center gap-2"
            >
              <MdArchive />
              Archive
            </Button>
            <Button
              variant="outline"
              onClick={() => handleTrashBtn("me", message.id)}
              className="flex items-center gap-2"
            >
              <FiTrash />
              Delete
            </Button>
          </div>

          {/* Mail Container */}
          <div className="flex flex-col flex-grow p-2">
            <div className="mb-2">
              <h2 className="text-lg font-bold text-gray-700 mb-1">
                {getHeader(headers, "Subject")}
              </h2>
              <div className="flex items-start">
                <Avatar className="mr-4">
                  <AvatarFallback>
                    {removeQuote(getHeader(headers, "From").split("<")[0]).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="w-4/5">
                  <p className="text-base text-gray-700">
                    {getHeader(headers, "From")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(getHeader(headers, "Date"))}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mt-1">
                {`To: ${getHeader(headers, "To")}`}
              </p>
            </div>
            <div className="flex-grow">
              <div className="h-full w-full">
                <iframe 
                  id="iframe" 
                  title="messageBody" 
                  className="h-full w-full border-0"
                >
                  <p>Your browser does not support iframes.</p>
                </iframe>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Email;

const EmptyMail = () => (
  <div className="flex flex-col justify-center items-center h-full">
    <img
      src={emptyEmailImg}
      alt='Empty Email'
      className="w-2/5 h-auto"
    />
    <h3 className="text-xl font-bold text-gray-400 mt-5">
      Click on Email to Open it
    </h3>
  </div>
);
