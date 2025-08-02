import React from "react";
import { Base64 } from "js-base64";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useToast } from "../../hooks/useToast";

const SendModel = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const emailTo = form.elements["emailTo"].value;
    const subject = form.elements["subject"].value;
    const message = form.elements["message"].value;

    // Send Simple Mail && Display Toast
    sendMessage(
      {
        To: emailTo,
        Subject: subject,
      },
      message,
      displayToast
    );

    onClose();
  };

  const sendMessage = (headers_obj, message, callback) => {
    let email = "";

    for (let header in headers_obj)
      email += header += ": " + headers_obj[header] + "\r\n";

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
      toast.toast({
        title: "Message Sent",
        description: "We've sent your email.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast.toast({
        title: "An error occurred",
        description: "Unable to send your email.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button
        className="w-full h-12 rounded-2xl"
        onClick={onOpen}
      >
        <Plus className="mr-2 h-4 w-4" />
        New Message
      </Button>
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <Input
                type="email"
                id="emailTo"
                placeholder="To"
                required
                className="w-full"
              />
              <Input
                type="text"
                id="subject"
                placeholder="Subject"
                required
                className="w-full"
              />
              <Textarea
                id="message"
                placeholder="Write your message..."
                required
                className="min-h-[280px] resize-y"
              />
            </div>
            
            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
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
    </>
  );
};

export default SendModel;
