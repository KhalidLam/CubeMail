import React, { Fragment, useState } from "react";
import { Base64 } from "js-base64";
import { MdArrowForward } from "react-icons/md";
import { getHeader } from "../Helper";
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

const ForwardModel = ({ forwardData, getMessageBody }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const forwardTo = form.elements["emailTo"].value;
    handleForwardMsg(
      forwardTo,
      forwardData.payload.headers,
      getMessageBody(forwardData.payload)
    );
    setIsOpen(false);
  };

  const handleForwardMsg = (forwardTo, headers, body) => {
    let email = "";
    email += `From: ${getHeader(headers, "From")} \r\n`;
    email += `Date: ${getHeader(headers, "Date")} \r\n`;
    email += `Subject: ${getHeader(headers, "Subject")} \r\n`;
    email += `To: ${forwardTo} \r\n`;
    email += `Content-Type: text/html; charset=UTF-8 \r\n`;
    email += `\r\n ${body}`;

    sendMessage("me", email, displayToast);
  };

  const sendMessage = (userId, email, callback) => {
    const base64EncodedEmail = Base64.encodeURI(email);
    const request = window.gapi.client.gmail.users.messages.send({
      userId: userId,
      resource: {
        raw: base64EncodedEmail,
      },
    });
    request.execute(callback);
  };

  const displayToast = ({ result }) => {
    if (result.labelIds.indexOf("SENT") !== -1) {
      toast({
        title: "Email forwarded Successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "An error occurred.",
        description: "Unable to sent your mail.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getForwardHead = (headers) => {
    let msg = "";
    msg += "From: " + getHeader(headers, "From") + "\r\n";
    msg += "Date: " + getHeader(headers, "Date") + "\r\n";
    msg += "Subject: " + getHeader(headers, "Subject") + "\r\n";
    msg += "To: " + getHeader(headers, "To") + "\r\n";
    return msg;
  };

  return (
    <Fragment>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <MdArrowForward />
        Forward
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Forward</DialogTitle>
          </DialogHeader>
          
          <form id='form' onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="emailTo" className="text-sm font-medium">
                  To
                </label>
                <Input
                  type='email'
                  id='emailTo'
                  placeholder='To'
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
                  value={getHeader(forwardData.payload.headers, "Subject")}
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
                  value={
                    "------Forward Message------\r\n" +
                    getForwardHead(forwardData.payload.headers)
                  }
                  readOnly
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

export default ForwardModel;

ForwardModel.propTypes = {
  forwardData: PropTypes.object.isRequired,
  getMessageBody: PropTypes.func.isRequired,
};
