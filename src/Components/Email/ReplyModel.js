import React, { Fragment, useState } from "react";
import { Base64 } from "js-base64";
import { MdReplay } from "react-icons/md";
import PropTypes from "prop-types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { useToast } from "../../hooks/useToast";

const ReplyModel = ({ replayData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const emailTo = form.elements["emailTo"].value;
    const subject = form.elements["subject"].value;
    const replayMsgId = form.elements["reply-message-id"].value;
    const message = form.elements["message"].value;

    // Send Replay
    sendMessage(
      {
        To: emailTo,
        Subject: subject,
        "In-Reply-To": replayMsgId,
      },
      message,
      displayToast
    );

    setIsOpen(false);
  };

  const sendMessage = (headers_obj, message, callback) => {
    let email = "";

    for (let header in headers_obj) {
      email += header + ": " + headers_obj[header] + "\r\n";
    }

    email += "\r\n" + message;

    const base64EncodedEmail = Base64.encodeURI(email);
    const request = window.gapi.client.gmail.users.messages.send({
      userId: "me",
      resource: {
        raw: base64EncodedEmail,
      },
    });

    request.execute(callback);
  };

  const displayToast = ({ result }) => {
    if (result.labelIds.indexOf("SENT") !== -1) {
      toast({
        title: "Message Sent.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "An error occurred.",
        description: "Unable to sent your replay.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Fragment>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <MdReplay />
        Replay
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Replay</DialogTitle>
          </DialogHeader>
          
          <form id='form' onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                type='hidden'
                id='reply-message-id'
                value={replayData.msgId}
                readOnly
              />
              
              <div className="space-y-2">
                <label htmlFor="emailTo" className="text-sm font-medium">
                  To
                </label>
                <Input
                  type='email'
                  id='emailTo'
                  placeholder='To'
                  value={replayData.to}
                  readOnly
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input
                  type='text'
                  id='subject'
                  placeholder='Subject'
                  value={replayData.subject}
                  readOnly
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id='message'
                  className="min-h-[280px] resize-y"
                  placeholder="Type your message here..."
                  required
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
              <Button type="submit">
                Send
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default ReplyModel;

ReplyModel.propTypes = {
  replayData: PropTypes.object.isRequired,
};
