import React from "react";
import { Base64 } from "js-base64";
import { MdReplay } from "react-icons/md";
import { isEmpty } from "../Helper";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  Textarea,
  useToast,
  useDisclosure,
} from "@chakra-ui/core";

const ReplyModel = ({ replayData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  let handleSubmit = (e) => {
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
      handleReplayResponse
    );
  };

  let sendMessage = (headers_obj, message, callback) => {
    var email = "";

    for (var header in headers_obj)
      email += header += ": " + headers_obj[header] + "\r\n";

    email += "\r\n" + message;

    var base64EncodedEmail = Base64.encodeURI(email);
    var request = window.gapi.client.gmail.users.messages.send({
      userId: "me",
      resource: {
        raw: base64EncodedEmail,
      },
    });
    request.execute(callback);
  };

  let handleReplayResponse = (res) => {
    if (res.result) {
      if (res.result.labelIds.indexOf("SENT") !== -1) {
        toast({
          title: "Message Sent.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
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

  if (!isEmpty(replayData)) {
    return (
      <React.Fragment>
        <Button
          rightIcon={MdReplay}
          variantColor='teal'
          variant='outline'
          onClick={onOpen}
        >
          Replay
        </Button>
        <Modal isOpen={isOpen} size='xl' onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Replay </ModalHeader>
            <ModalCloseButton />
            <form id='form' onSubmit={handleSubmit}>
              <ModalBody>
                <Input
                  type='hidden'
                  id='reply-message-id'
                  value={replayData.msgId}
                  readOnly
                />
                <FormControl isRequired>
                  <Input
                    type='email'
                    id='emailTo'
                    placeholder='To'
                    aria-describedby='email-helper-text'
                    value={replayData.to}
                    readOnly
                  />
                </FormControl>
                <FormControl isRequired>
                  <Input
                    type='text'
                    id='subject'
                    placeholder='Subject'
                    aria-describedby='subject-email-helper-text'
                    value={replayData.subject}
                    readOnly
                  />
                </FormControl>
                <FormControl isRequired>
                  <Textarea
                    id='message'
                    minH='280px'
                    size='xl'
                    resize='vertical'
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button
                  type='reset'
                  variantColor='blue'
                  mr={3}
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button type='submit' variantColor='green'>
                  Send
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Button rightIcon={MdReplay} variantColor='teal' variant='outline'>
          Replay
        </Button>
      </React.Fragment>
    );
  }
};

export default ReplyModel;
