import React from "react";
import { Base64 } from "js-base64";
import { MdReplay, MdArrowForward } from "react-icons/md";
import { getHeader, isEmpty } from "../Helper";
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

const ForwardModel = ({ forwardData, getMessageBody }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  let handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const forwardTo = form.elements["emailTo"].value;
    handleForwardMsg(
      forwardTo,
      forwardData.payload.headers,
      getMessageBody(forwardData.payload)
    );
  };

  let handleForwardMsg = (forwardTo, headers, body) => {
    var email = "";
    email += `From: ${getHeader(headers, "From")} \r\n`;
    email += `Date: ${getHeader(headers, "Date")} \r\n`;
    email += `Subject: ${getHeader(headers, "Subject")} \r\n`;
    email += `To: ${forwardTo} \r\n`;
    email += `Content-Type: text/html; charset=UTF-8 \r\n`;
    email += `\r\n ${body}`;

    sendMessage("me", email, handleForwardResponse);
  };

  let sendMessage = (userId, email, callback) => {
    var base64EncodedEmail = Base64.encodeURI(email);
    var request = window.gapi.client.gmail.users.messages.send({
      userId: userId,
      resource: {
        raw: base64EncodedEmail,
      },
    });
    request.execute(callback);
  };

  let handleForwardResponse = (res) => {
    if (res.result) {
      if (res.result.labelIds.indexOf("SENT") !== -1) {
        toast({
          title: "Email forwarded Successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
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

  let getForwardHead = (headers) => {
    var msg = "";
    msg += "From: " + getHeader(headers, "From") + "\r\n";
    msg += "Date: " + getHeader(headers, "Date") + "\r\n";
    msg += "Subject: " + getHeader(headers, "Subject") + "\r\n";
    msg += "To: " + getHeader(headers, "To") + "\r\n";
    return msg;
  };

  if (!isEmpty(forwardData)) {
    return (
      <React.Fragment>
        <Button
          rightIcon={MdArrowForward}
          variantColor='teal'
          variant='outline'
          onClick={onOpen}
        >
          Forward
        </Button>

        <Modal isOpen={isOpen} size='xl' onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Forward </ModalHeader>
            <ModalCloseButton />
            <form id='form' onSubmit={handleSubmit}>
              <ModalBody>
                <FormControl isRequired>
                  <Input
                    type='email'
                    id='emailTo'
                    placeholder='To'
                    aria-describedby='email-helper-text'
                  />
                </FormControl>
                <FormControl isRequired>
                  <Input
                    type='text'
                    id='subject'
                    placeholder='Subject'
                    aria-describedby='subject-email-helper-text'
                    value={getHeader(forwardData.payload.headers, "Subject")}
                    readOnly
                  />
                </FormControl>
                <FormControl isRequired>
                  <Textarea
                    id='message'
                    minH='280px'
                    size='xl'
                    resize='vertical'
                    value={
                      "------Forward Message------\r\n" +
                      getForwardHead(forwardData.payload.headers)
                    }
                    readOnly
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

export default ForwardModel;
