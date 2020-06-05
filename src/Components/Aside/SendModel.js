import React from "react";
import { Base64 } from "js-base64";
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
import { BsPlusCircle } from "react-icons/bs";

const SendModel = () => {
  console.log("SendModel...");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  let handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const emailTo = form.elements["emailTo"].value;
    const subject = form.elements["subject"].value;
    const message = form.elements["message"].value;

    console.log(e.target);
    console.log(emailTo, subject, message);

    // Send Simple Mail
    sendMessage(
      {
        To: emailTo,
        Subject: subject,
      },
      message,
      handleSendResponse
    );

    // Send Replay
    // getHeader(message.payload.headers, "Message-ID")
    // sendMessage(
    //   {
    //     To: emailTo,
    //     Subject: emailTo,
    //     "In-Reply-To": replayMsgId,
    //   },
    //   message,
    //   handleReplayResponse
    // );
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

  let handleSendResponse = (res) => {
    console.log(res.result);
    if (res.result.labelIds.indexOf("SENT") !== -1) {
      toast({
        title: "Email Sent.",
        description: "We've Sent your email.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: "An error occurred.",
        description: "Unable to sent your email.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <React.Fragment>
      <Button
        w='100%'
        h='48px'
        leftIcon={BsPlusCircle}
        border='1px'
        borderRadius='20px'
        borderColor='green.500'
        variantColor='green'
        variant='solid'
        onClick={onOpen}
      >
        Compose mail
      </Button>
      <Modal isOpen={isOpen} size='xl' onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Message</ModalHeader>
          <ModalCloseButton />
          <form id='form' onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl isRequired>
                <Input
                  type='email'
                  id='emailTo'
                  name='To'
                  placeholder='To'
                  aria-describedby='email-helper-text'
                />
              </FormControl>
              <FormControl isRequired>
                <Input
                  type='text'
                  id='subject'
                  name='Subject'
                  placeholder='Subject'
                  aria-describedby='subject-email-helper-text'
                />
              </FormControl>
              <FormControl isRequired>
                <Textarea
                  id='message'
                  name='message'
                  // value={value}
                  // onChange={handleInputChange}
                  minH='280px'
                  size='xl'
                  resize='vertical'
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button type='reset' variantColor='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button
                type='submit'
                variantColor='green'
                // onClick={() =>
                //   toast({
                //     title: "Email Sent.",
                //     description: "We've Sent your email.",
                //     status: "success",
                //     duration: 9000,
                //     isClosable: true,
                //   })
                // }
              >
                Send
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

export default SendModel;
