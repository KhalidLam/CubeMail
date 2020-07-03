import React, { Fragment } from "react";
import { Base64 } from "js-base64";
import { MdArrowForward } from "react-icons/md";
import { getHeader } from "../Helper";
import PropTypes from "prop-types";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const forwardTo = form.elements["emailTo"].value;
    handleForwardMsg(
      forwardTo,
      forwardData.payload.headers,
      getMessageBody(forwardData.payload)
    );
    onClose();
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
        rightIcon={MdArrowForward}
        variantColor='blue'
        variant='outline'
        onClick={onOpen}
      >
        Forward
      </Button>

      <Modal
        isOpen={isOpen}
        size='xl'
        onClose={onClose}
        closeOnOverlayClick={false}
      >
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
              <Button type='reset' variantColor='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button type='submit' variantColor='green'>
                Send
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default ForwardModel;

ForwardModel.prototype = {
  forwardData: PropTypes.object.isRequired,
  getMessageBody: PropTypes.func.isRequired,
};
