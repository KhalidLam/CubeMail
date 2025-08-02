This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where security check has been disabled.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Security check has been disabled - content may contain sensitive information
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
public/
  index.html
  manifest.json
  robots.txt
src/
  Components/
    Email/
      Email.js
      empty_email.svg
      ForwardModel.js
      ReplyModel.js
    EmailList/
      EmailList.js
      EmailRow.js
      SearchBar.js
    MailboxList/
      MailboxList.js
      SendModel.js
    Helper.js
  context/
    email/
      emailContext.js
      emailReducer.js
      EmailState.js
    types.js
  pages/
    Main.js
    SignIn.js
  App.js
  index.js
.env.example
.gitignore
LICENSE
package.json
README.md
```

# Files

## File: public/index.html
````html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Mail Box with React" />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>CubeMail</title>
    <script src="https://apis.google.com/js/api.js"></script>
    <!-- <script src="https://apis.google.com/js/client.js" async defer></script> -->
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
````

## File: public/manifest.json
````json
{
  "short_name": "React App",
  "name": "Create React App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
````

## File: public/robots.txt
````
# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow:
````

## File: src/Components/Email/Email.js
````javascript
import React, { Fragment, useContext } from "react";
import EmailContext from "../../context/email/emailContext";

import ReplyModel from "./ReplyModel";
import ForwardModel from "./ForwardModel";

import { getHeader, removeQuote, formatDate } from "../Helper"; // Helper functions
import { Base64 } from "js-base64";
import { MdArchive } from "react-icons/md"; // Icons
import {
  Flex,
  Box,
  Button,
  AspectRatioBox,
  Avatar,
  Text,
  useToast,
  Heading,
} from "@chakra-ui/core";

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
    <Flex
      direction='column'
      wrap='no-wrap'
      w='58%'
      h='100%'
      p='0.6rem 1rem'
      bg='white'
      color='black'
      border='1px'
      borderColor='gray.200'
      borderTopRightRadius='md'
      borderBottomRightRadius='md'
    >
      {!message ? (
        <EmptyMail />
      ) : (
        <Fragment>
          {/* Header Buttons */}
          <Flex justify='space-around' wrap='no-wrap' mb={2}>
            <ReplyModel replayData={formatReplayData(headers)} />
            <ForwardModel
              forwardData={message}
              getMessageBody={getMessageBody}
            />
            <Button
              rightIcon={MdArchive}
              variantColor='blue'
              variant='outline'
              onClick={() => handleArchiveBtn([message.id], ["INBOX"])}
            >
              Archive
            </Button>
            <Button
              rightIcon='delete'
              variantColor='blue'
              variant='outline'
              onClick={() => handleTrashBtn("me", message.id)}
            >
              Delete
            </Button>
          </Flex>

          {/* Mail Container */}
          <Flex
            className='mailContainer'
            flexGrow='2'
            direction='column'
            wrap='no-wrap'
            p={2}
          >
            <Box className='mailHeader' mb={2}>
              <Text fontSize='lg' fontWeight='bold' color='gray.700' mb={1}>
                {getHeader(headers, "Subject")}
              </Text>
              <Flex wrap='no-wrap' justify='flex-start'>
                <Avatar
                  name={removeQuote(getHeader(headers, "From").split("<")[0])}
                  src='https://bit.ly/tioluwani-kolawole'
                  mr={4}
                />
                <Box w='80%'>
                  <Text fontSize='md' color='gray.700'>
                    {getHeader(headers, "From")}
                  </Text>
                  <Text fontSize='sm' color='gray.500'>
                    {formatDate(getHeader(headers, "Date"))}
                  </Text>
                </Box>
              </Flex>
              <Text fontSize='sm' color='gray.700' mt={1}>
                {`To: ${getHeader(headers, "To")}`}
              </Text>
            </Box>
            <Box className='mailBody' flexGrow='2'>
              <AspectRatioBox ratio={16 / 9} h='100%'>
                <Box as='iframe' id='iframe' title='messageBody'>
                  <p>Your browser does not support iframes.</p>
                </Box>
              </AspectRatioBox>
            </Box>
          </Flex>
        </Fragment>
      )}
    </Flex>
  );
};

export default Email;

const EmptyMail = () => (
  <Flex
    flexDirection='column'
    justify='center'
    alignItems='center'
    mb={3}
    style={{ height: "100%" }}
  >
    <img
      src={emptyEmailImg}
      alt='React Logo'
      style={{ width: "40%", height: "auto" }}
    />
    <Heading as='h3' size='lg' color='#a6b0b7' mt={5}>
      Click on Email to Open it
    </Heading>
  </Flex>
);
````

## File: src/Components/Email/empty_email.svg
````
<svg id="060e19aa-3f7d-4f07-aa7e-820f8d371f55" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="870.71" height="691.21" viewBox="0 0 870.71 691.21"><defs><linearGradient id="96d5bb21-1965-4d3e-ab37-1bcc7be514e6" x1="309.27" y1="560.72" x2="309.27" y2="406.06" gradientTransform="matrix(-1, 0, 0, 1, 616.6, 82.28)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="gray" stop-opacity="0.25"/><stop offset="0.54" stop-color="gray" stop-opacity="0.12"/><stop offset="1" stop-color="gray" stop-opacity="0.1"/></linearGradient><linearGradient id="3608cfbe-4e57-42c8-8a3e-2b99e6b6c6a0" x1="-175.29" y1="157.73" x2="-175.29" y2="3.07" gradientTransform="matrix(0, -1, -1, 0, 970.73, 29.07)" xlink:href="#96d5bb21-1965-4d3e-ab37-1bcc7be514e6"/><linearGradient id="f4d6b150-3892-4d6f-bed9-22612cc59583" x1="-246.29" y1="456.25" x2="-246.29" y2="301.59" gradientTransform="matrix(0, -1, -1, 0, 1293.26, 304.09)" xlink:href="#96d5bb21-1965-4d3e-ab37-1bcc7be514e6"/><linearGradient id="675c2575-69c8-4c08-9859-0530d9a94ad2" x1="60" y1="226.17" x2="60" y2="71.51" gradientTransform="matrix(-1, 0, 0, 1, 436.24, 71.59)" xlink:href="#96d5bb21-1965-4d3e-ab37-1bcc7be514e6"/><linearGradient id="245258be-8ef2-4163-b815-3fbd211fc334" x1="435.66" y1="691.21" x2="435.66" y2="9.21" gradientTransform="matrix(1, 0, 0, 1, 0, 0)" xlink:href="#96d5bb21-1965-4d3e-ab37-1bcc7be514e6"/><linearGradient id="afb36fd3-f298-4117-ba9e-9f0c6a4eccfc" x1="435.66" y1="544.71" x2="435.66" y2="69.59" gradientTransform="matrix(1, 0, 0, 1, 0, 0)" xlink:href="#96d5bb21-1965-4d3e-ab37-1bcc7be514e6"/><linearGradient id="9b46ec67-d0ea-45ff-80f1-fe3db7b86030" x1="600.3" y1="786.69" x2="600.3" y2="565.96" gradientTransform="matrix(1, 0, 0, 1, 0, 0)" xlink:href="#96d5bb21-1965-4d3e-ab37-1bcc7be514e6"/></defs><title>opened</title><rect x="181.5" y="488.34" width="251.66" height="154.66" transform="translate(-313.48 7.02) rotate(-16.6)" fill="url(#96d5bb21-1965-4d3e-ab37-1bcc7be514e6)"/><rect x="184.26" y="492.57" width="243.13" height="144.34" transform="translate(-313.28 6.55) rotate(-16.6)" fill="#fff"/><g opacity="0.6"><rect x="184.56" y="532.96" width="30.93" height="22.89" transform="translate(382.63 904.55) rotate(163.4)" fill="#f55f44"/><rect x="221.97" y="570.99" width="118.78" height="7.42" transform="translate(550.57 940.64) rotate(163.4)" fill="#f55f44"/><rect x="258.42" y="584.23" width="86.61" height="4.95" transform="translate(593.88 958.32) rotate(163.4)" fill="#f55f44"/></g><rect x="812.99" y="78.53" width="154.66" height="251.66" transform="translate(354.91 934.8) rotate(-78.98)" fill="url(#3608cfbe-4e57-42c8-8a3e-2b99e6b6c6a0)"/><rect x="817.25" y="81.28" width="144.34" height="243.13" transform="translate(355.66 932.7) rotate(-78.98)" fill="#fff"/><g opacity="0.6"><rect x="789.65" y="124.32" width="30.93" height="22.89" transform="translate(1404.78 318.52) rotate(-168.98)" fill="#f55f44"/><rect x="803.74" y="196.61" width="118.78" height="7.42" transform="translate(1507.41 457.54) rotate(-168.98)" fill="#f55f44"/><rect x="832.3" y="217.92" width="86.61" height="4.95" transform="translate(1528.3 499.71) rotate(-168.98)" fill="#f55f44"/></g><rect x="837.01" y="424.55" width="154.66" height="251.66" transform="translate(-308.14 304.89) rotate(-23.45)" fill="url(#f4d6b150-3892-4d6f-bed9-22612cc59583)"/><rect x="842.9" y="427.21" width="144.34" height="243.13" transform="translate(-307.45 305.05) rotate(-23.45)" fill="#fff"/><g opacity="0.6"><rect x="907.2" y="429.86" width="30.93" height="22.89" transform="translate(720.31 1358.98) rotate(-113.45)" fill="#47e6b1"/><rect x="842.89" y="521.96" width="118.78" height="7.42" transform="translate(614.41 1458.22) rotate(-113.45)" fill="#47e6b1"/><rect x="849.48" y="544.85" width="86.61" height="4.95" transform="translate(581.28 1479.77) rotate(-113.45)" fill="#47e6b1"/></g><rect x="250.41" y="143.1" width="251.66" height="154.66" transform="translate(-216.69 34.06) rotate(-19.53)" fill="url(#675c2575-69c8-4c08-9859-0530d9a94ad2)"/><rect x="253.13" y="147.42" width="243.13" height="144.34" transform="translate(-216.5 33.5) rotate(-19.53)" fill="#fff"/><g opacity="0.6"><rect x="252.52" y="193.23" width="30.93" height="22.89" transform="translate(424.33 203.59) rotate(160.47)" fill="#9996c5"/><rect x="291.38" y="227.07" width="118.78" height="7.42" transform="translate(593.86 226.63) rotate(160.47)" fill="#9996c5"/><rect x="328.41" y="239.26" width="86.61" height="4.95" transform="translate(638.21 240.89) rotate(160.47)" fill="#9996c5"/></g><polygon points="435.66 9.21 142.66 285.04 142.66 691.21 728.65 691.21 728.65 285.04 435.66 9.21" fill="url(#245258be-8ef2-4163-b815-3fbd211fc334)"/><polygon points="725.68 682.3 145.63 682.3 145.63 284.38 435.66 14.16 725.68 284.38 725.68 682.3" fill="#fff"/><rect x="233.73" y="69.59" width="403.85" height="475.12" fill="url(#afb36fd3-f298-4117-ba9e-9f0c6a4eccfc)"/><rect x="238.83" y="73.55" width="393.65" height="471.16" fill="#fff"/><polygon points="145.63 284.38 435.66 483.34 145.63 682.3 145.63 284.38" fill="#f5f5f5"/><polygon points="725.68 284.38 435.66 483.34 725.68 682.3 725.68 284.38" fill="#f5f5f5"/><path d="M310.28,786.69,588.92,569.9a18.39,18.39,0,0,1,22.75,0L890.33,786.69Z" transform="translate(-164.65 -104.4)" fill="url(#9b46ec67-d0ea-45ff-80f1-fe3db7b86030)"/><path d="M310.28,786.69,588.92,579.37a19.06,19.06,0,0,1,22.75,0L890.33,786.69Z" transform="translate(-164.65 -104.4)" fill="#fff"/><rect x="298.56" y="164.61" width="82.16" height="13.86" fill="#47e6b1"/><rect x="298.56" y="201.24" width="274.19" height="13.86" fill="#f5f5f5"/><rect x="298.56" y="224.99" width="274.19" height="13.86" fill="#f5f5f5"/><rect x="298.56" y="248.75" width="274.19" height="13.86" fill="#f5f5f5"/><rect x="298.56" y="272.5" width="274.19" height="13.86" fill="#f5f5f5"/><rect x="298.56" y="296.26" width="124.72" height="13.86" fill="#f5f5f5"/><rect x="448.03" y="296.26" width="124.72" height="13.86" fill="#9996c5"/></svg>
````

## File: src/Components/Email/ForwardModel.js
````javascript
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
````

## File: src/Components/Email/ReplyModel.js
````javascript
import React, { Fragment } from "react";
import { Base64 } from "js-base64";
import { MdReplay } from "react-icons/md";
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

const ReplyModel = ({ replayData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
        rightIcon={MdReplay}
        variantColor='blue'
        variant='outline'
        onClick={onOpen}
      >
        Replay
      </Button>
      <Modal
        isOpen={isOpen}
        size='xl'
        onClose={onClose}
        closeOnOverlayClick={false}
      >
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

export default ReplyModel;

ReplyModel.prototype = {
  replayData: PropTypes.object.isRequired,
};
````

## File: src/Components/EmailList/EmailList.js
````javascript
import React, { useContext } from "react";
import EmailContext from "../../context/email/emailContext";

import EmailRow from "./EmailRow";
import SearchBar from "./SearchBar";

import InfiniteScroll from "react-infinite-scroll-component";
import { Flex, Box, Spinner } from "@chakra-ui/core";

const Messages = () => {
  const {
    messages,
    getOneMessage,
    hasMoreMessages,
    loadMoreMessages,
  } = useContext(EmailContext);

  const handleMessageClick = (e) => {
    const messageId = e.currentTarget.getAttribute("id");
    getOneMessage(messageId);
  };

  return (
    <Box overflowY='auto' id='scrollableDiv'>
      <InfiniteScroll
        dataLength={messages.length}
        next={loadMoreMessages}
        hasMore={hasMoreMessages}
        loader={<h4>Loading...</h4>}
        scrollableTarget='scrollableDiv'
      >
        {messages.map((message, index) => (
          <EmailRow
            key={index}
            message={message}
            handleMessageClick={handleMessageClick}
          />
        ))}
      </InfiniteScroll>
    </Box>
  );
};

const CustomSpinner = () => (
  <Box mt={6} display='flex' align='center' justifyContent='center'>
    <Spinner
      thickness='4px'
      speed='0.65s'
      emptyColor='gray.200'
      color='blue.500'
      size='xl'
    />
  </Box>
);

const EmailList = () => {
  const { messages, loading } = useContext(EmailContext);

  return (
    <Flex
      direction='column'
      wrap='no-wrap'
      w='26%'
      h='100%'
      bg='#f1f1f1'
      color='black'
    >
      {/* Search bar */}
      <SearchBar />

      {/* Messages */}
      {!messages.length && loading ? <CustomSpinner /> : <Messages />}
    </Flex>
  );
};

export default EmailList;
````

## File: src/Components/EmailList/EmailRow.js
````javascript
import React from "react";
import { getHeader, decodeHtml, removeQuote } from "../Helper";
import { Flex, Box, Avatar, Text } from "@chakra-ui/core";
import PropTypes from "prop-types";

const EmailRow = ({ message, handleMessageClick }) => {
  // Get name of email sender
  const name = removeQuote(
    getHeader(message.payload.headers, "From").split("<")[0]
  );

  // Get subject of email
  const subject = getHeader(message.payload.headers, "Subject");

  // Get part of email snippet
  const msg = decodeHtml(message.snippet.substr(0, 75));

  // Set backgroundColor to white if the mail is not yet opened
  const backgroundColor =
    message.labelIds.indexOf("UNREAD") > -1 ? "#fff" : "#E2E8F0";

  return (
    <Flex
      key={message.id}
      id={message.id}
      onClick={handleMessageClick}
      wrap='no-wrap'
      justify='space-around'
      py={2}
      bg={backgroundColor}
      borderTop='1px'
      borderBottom='1px'
      borderColor='gray.300'
      cursor='pointer'
    >
      <Avatar name={name} src='https://bit.ly/tioluwani-kolawole' />
      <Box w='80%'>
        <Text fontSize='sm' color='gray.700' isTruncated>
          {name}
        </Text>
        <Text fontSize='md' fontWeight='bold' color='#3182ce' isTruncated>
          {subject}
        </Text>
        <Text fontSize='xs' color='gray.500'>
          {msg}
        </Text>
      </Box>
    </Flex>
  );
};

export default EmailRow;

EmailRow.prototype = {
  message: PropTypes.object.isRequired,
  handleMessageClick: PropTypes.func.isRequired,
};
````

## File: src/Components/EmailList/SearchBar.js
````javascript
import React, { useState, useContext } from "react";
import { Box, Input, InputGroup, IconButton } from "@chakra-ui/core";
import EmailContext from "../../context/email/emailContext";

const SearchBar = () => {
  const { getMessagesQuery, loading } = useContext(EmailContext);
  const [query, setQuery] = useState("");

  const handleOnChange = (e) => setQuery(e.target.value);

  const handleQuery = (e) => {
    if (!query) return;
    if (e.keyCode === 13 || e.type === "click") getMessagesQuery(query);
  };

  return (
    <Box py='5px' bg='white' border='1px' borderColor='gray.200'>
      <InputGroup size='lg'>
        <IconButton
          icon='search'
          variant='ghost'
          variantColor='blue'
          marginLeft='5px'
          aria-label='Search messages'
          onClick={handleQuery}
          isLoading={loading}
        />
        <Input
          type='text'
          placeholder='Search mail'
          borderWidth='0px'
          borderRadius='0px'
          focusBorderColor='white'
          value={query}
          onChange={handleOnChange}
          onKeyDown={handleQuery}
        />
      </InputGroup>
    </Box>
  );
};

export default SearchBar;
````

## File: src/Components/MailboxList/MailboxList.js
````javascript
import React, { useState, useContext } from "react";
import EmailContext from "../../context/email/emailContext";
import SendModel from "./SendModel";

// Import Icons
import { Button, Box, List, ListItem } from "@chakra-ui/core";
import { MdLabel, MdStar, MdPeople, MdLoyalty, MdInbox } from "react-icons/md";
import { FiSend, FiFile } from "react-icons/fi";

const MailboxList = () => {
  const { getMessages, setCurrentLabel } = useContext(EmailContext);
  const [active, setActive] = useState("INBOX");

  const handleClick = (e) => {
    const categoryId = e.target.id;
    setActive(categoryId);
    setCurrentLabel(categoryId);

    // Get Messages using clicked category
    getMessages(categoryId);
  };

  return (
    <Box
      w='16%'
      h='100%'
      bg='white'
      border='1px'
      borderColor='gray.200'
      borderTopLeftRadius='md'
      borderBottomLeftRadius='md'
    >
      <List>
        {/* Send Model */}
        <ListItem p='0.5rem 1rem 1rem'>
          <SendModel />
        </ListItem>

        {/* Labels Buttons */}
        <ListItem>
          <Button
            id='INBOX'
            w='100%'
            h='45px'
            py={2}
            pl={8}
            leftIcon={MdInbox}
            variantColor='blue'
            variant={active === "INBOX" ? "solid" : "ghost"}
            justifyContent='flex-start'
            onClick={handleClick}
          >
            Inbox
          </Button>
        </ListItem>
        <ListItem>
          <Button
            id='STARRED'
            w='100%'
            h='45px'
            py={2}
            pl={8}
            leftIcon={MdStar}
            variantColor='blue'
            variant={active === "STARRED" ? "solid" : "ghost"}
            justifyContent='flex-start'
            onClick={handleClick}
          >
            Starred
          </Button>
        </ListItem>
        <ListItem>
          <Button
            id='IMPORTANT'
            w='100%'
            h='45px'
            py={2}
            pl={8}
            leftIcon={MdLabel}
            variantColor='blue'
            variant={active === "IMPORTANT" ? "solid" : "ghost"}
            justifyContent='flex-start'
            onClick={handleClick}
          >
            Important
          </Button>
        </ListItem>
        <ListItem>
          <Button
            id='SENT'
            w='100%'
            h='45px'
            py={2}
            pl={8}
            leftIcon={FiSend}
            variantColor='blue'
            variant={active === "SENT" ? "solid" : "ghost"}
            justifyContent='flex-start'
            onClick={handleClick}
          >
            Sent
          </Button>
        </ListItem>
        <ListItem>
          <Button
            id='DRAFT'
            w='100%'
            h='45px'
            py={2}
            pl={8}
            leftIcon={FiFile}
            variantColor='blue'
            variant={active === "DRAFT" ? "solid" : "ghost"}
            justifyContent='flex-start'
            onClick={handleClick}
          >
            Drafts
          </Button>
        </ListItem>
        <ListItem>
          <Button
            id='TRASH'
            w='100%'
            h='45px'
            py={2}
            pl={8}
            leftIcon='delete'
            variantColor='blue'
            variant={active === "TRASH" ? "solid" : "ghost"}
            justifyContent='flxex-start'
            onClick={handleClick}
          >
            Trash
          </Button>
        </ListItem>
        <ListItem>
          <Button
            id='CATEGORY_SOCIAL'
            w='100%'
            h='45px'
            py={2}
            pl={8}
            leftIcon={MdPeople}
            variantColor='blue'
            variant={active === "CATEGORY_SOCIAL" ? "solid" : "ghost"}
            justifyContent='flxex-start'
            onClick={handleClick}
          >
            Social
          </Button>
        </ListItem>
        <ListItem>
          <Button
            id='CATEGORY_PROMOTIONS'
            w='100%'
            h='45px'
            py={2}
            pl={8}
            leftIcon={MdLoyalty}
            variantColor='blue'
            variant={active === "CATEGORY_PROMOTIONS" ? "solid" : "ghost"}
            justifyContent='flxex-start'
            onClick={handleClick}
          >
            Promotions
          </Button>
        </ListItem>
      </List>
    </Box>
  );
};

export default MailboxList;
````

## File: src/Components/MailboxList/SendModel.js
````javascript
import React, { Fragment } from "react";
import { Base64 } from "js-base64";
import { BsPlusCircle } from "react-icons/bs";
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

    for (var header in headers_obj)
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
      toast({
        title: "Message Sent.",
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
    <Fragment>
      <Button
        w='100%'
        h='48px'
        leftIcon={BsPlusCircle}
        borderRadius='20px'
        variant='solid'
        variantColor='blue'
        onClick={onOpen}
      >
        New Message
      </Button>
      <Modal
        isOpen={isOpen}
        size='xl'
        onClose={onClose}
        closeOnOverlayClick={false}
      >
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

export default SendModel;
````

## File: src/Components/Helper.js
````javascript
export const getHeader = (headers, name) => {
  const header = headers.find((header) => header.name === name);
  return header !== undefined ? header.value : undefined;
};

export const isEmpty = (obj) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

export const decodeHtml = (html) => {
  let txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export const removeQuote = (str) => {
  return str.replace(/['"]+/g, "");
};

export const formatDate = (strDate) => {
  const date = new Date(strDate);
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};
````

## File: src/context/email/emailContext.js
````javascript
import { createContext } from "react";

const emailContext = createContext();

export default emailContext;
````

## File: src/context/email/emailReducer.js
````javascript
import {
  SET_MESSAGE,
  SET_MESSAGES,
  CLEAR_MESSAGES,
  SET_LOADING,
  SET_CURRENT_LABEL,
  SET_NEXT_PAGE_TOKEN,
  SET_HAS_MORE_MESSAGES,
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case SET_MESSAGES:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        loading: false,
      };

    case SET_MESSAGE:
      return {
        ...state,
        message: action.payload,
      };

    case SET_CURRENT_LABEL:
      return {
        ...state,
        currentLabel: action.payload,
      };

    case SET_NEXT_PAGE_TOKEN: {
      return {
        ...state,
        nextPageToken: action.payload,
      };
    }

    case SET_HAS_MORE_MESSAGES: {
      return {
        ...state,
        hasMoreMessages: action.payload,
      };
    }

    case CLEAR_MESSAGES: {
      return {
        ...state,
        messages: [],
      };
    }

    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
};
````

## File: src/context/email/EmailState.js
````javascript
import React, { useReducer } from "react";
import EmailContext from "./emailContext";
import EmailReducer from "./emailReducer";
import {
  SET_MESSAGE,
  SET_MESSAGES,
  CLEAR_MESSAGES,
  SET_LOADING,
  SET_CURRENT_LABEL,
  SET_NEXT_PAGE_TOKEN,
  SET_HAS_MORE_MESSAGES,
} from "../types";

const EmailState = (props) => {
  const initialState = {
    messages: [],
    message: null,
    currentLabel: "INBOX",
    nextPageToken: "",
    hasMoreMessages: true,
    isAuthorize: false,
    loading: false,
  };

  const [state, dispatch] = useReducer(EmailReducer, initialState);

  // Send reques to get IDs of 20 Messages and call getMessagesData(Ids)
  const getMessages = (labelIds = state.currentLabel) => {
    // Set Loading to true
    setLoading();

    // Empty previous messages
    clearMessages();

    const request = window.gapi.client.gmail.users.messages.list({
      userId: "me",
      labelIds: labelIds,
      maxResults: 20,
    });

    request.execute((resp) => {
      // Set NextPageToken
      if (resp.result.nextPageToken) {
        setNextPageToken(resp.result.nextPageToken);
        setHasMoreMessages(true);
      } else {
        setNextPageToken("");
        setHasMoreMessages(false);
      }

      // Send Id list to getMessagesData to get Message Data foreach Id
      getMessagesData(resp);
    });
  };

  const getMessagesQuery = (query) => {
    // Set Loading to true
    setLoading();

    // Empty previous messages
    clearMessages();

    // Get List of 20 message's Id
    const request = window.gapi.client.gmail.users.messages.list({
      userId: "me",
      q: query,
    });

    // Send Id list to getMessagesData to get Message Data foreach Id
    request.execute(getMessagesData);
  };

  // Send Request to get data of each message
  const getMessagesData = (resp) => {
    const messages = resp.result.messages ? resp.result.messages : [];

    // Get Data for each message
    messages.forEach((message) => {
      const request = window.gapi.client.gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });

      request.execute((resp) => {
        dispatch({
          type: SET_MESSAGES,
          payload: resp.result,
        });
      });
    });
  };

  // Get Message
  const getOneMessage = (messageId) => {
    const request = window.gapi.client.gmail.users.messages.get({
      userId: "me",
      id: messageId,
    });

    request.execute((resp) => {
      console.log(resp);
      dispatch({
        type: SET_MESSAGE,
        payload: resp.result,
      });
    });
  };

  // Load More Messages
  const loadMoreMessages = (labelIds = state.currentLabel) => {
    const request = window.gapi.client.gmail.users.messages.list({
      userId: "me",
      labelIds: labelIds,
      maxResults: 20,
      pageToken: state.nextPageToken,
    });

    request.execute((resp) => {
      if (resp.result.nextPageToken) {
        setNextPageToken(resp.result.nextPageToken);
        setHasMoreMessages(true);
      } else {
        setNextPageToken("");
        setHasMoreMessages(false);
      }

      getMessagesData(resp);
    });
  };

  // Set Next Page Token
  const setNextPageToken = (token) =>
    dispatch({ type: SET_NEXT_PAGE_TOKEN, payload: token });

  // Set Has More Messages
  const setHasMoreMessages = (bool) =>
    dispatch({ type: SET_HAS_MORE_MESSAGES, payload: bool });

  // Set Current Label
  const setCurrentLabel = (labelId) =>
    dispatch({ type: SET_CURRENT_LABEL, payload: labelId });

  // Clear Messages
  const clearMessages = () => dispatch({ type: CLEAR_MESSAGES });

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <EmailContext.Provider
      value={{
        messages: state.messages,
        message: state.message,
        currentLabel: state.currentLabel,
        nextPageToken: state.nextPageToken,
        hasMoreMessages: state.hasMoreMessages,
        loading: state.loading,
        getMessages,
        getMessagesQuery,
        getOneMessage,
        setCurrentLabel,
        loadMoreMessages,
        setLoading,
      }}
    >
      {props.children}
    </EmailContext.Provider>
  );
};

export default EmailState;
````

## File: src/context/types.js
````javascript
// Email Context Variables
export const SET_MESSAGE = "SET_MESSAGE";
export const GET_MESSAGE = "GET_MESSAGE";
export const SET_MESSAGES = "SET_MESSAGES";
export const GET_MESSAGES = "GET_MESSAGES";
export const CLEAR_MESSAGES = "CLEAR_MESSAGES";
export const SET_LOADING = "SET_LOADING";
export const SET_CURRENT_LABEL = "SET_CURRENT_LABEL";
export const GET_CURRENT_LABEL = "GET_CURRENT_LABEL";
export const SET_NEXT_PAGE_TOKEN = "SET_NEXT_PAGE_TOKEN";
export const SET_HAS_MORE_MESSAGES = "SET_HAS_MORE_MESSAGES";

// Authentication Context Variables
export const SET_IS_AUTHORIZE = "SET_IS_AUTHORIZE";
````

## File: src/pages/Main.js
````javascript
import React, { useEffect, useContext } from "react";
import EmailContext from "../context/email/emailContext"

// Import Components
import MailboxList from "../Components/MailboxList/MailboxList";
import EmailList from "../Components/EmailList/EmailList";
import Email from "../Components/Email/Email";

import { Flex } from "@chakra-ui/core";

const Main = () => {
  const { getMessages } = useContext(EmailContext);

  useEffect(() => {
    getMessages();
    // eslint-disable-next-line
  }, []);

  return (
    <Flex
      h='100vh'
      minH='600px'
      justify='space-arround'
      wrap='no-wrap'
      p='1em'
      bg='#e5f4f1'
      color='white'
    >
      <MailboxList />
      <EmailList />
      <Email />
    </Flex>
  );
};

export default Main;
````

## File: src/pages/SignIn.js
````javascript
import React from "react";
import { Button, Flex } from "@chakra-ui/core";
import { FcGoogle } from "react-icons/fc";

const SignIn = ({ handleAuthClick, loading }) => (
  <Flex h='100vh' justify='center' alignItems='center' bg='#e5f4f1'>
    <Button
      isLoading={loading}
      leftIcon={FcGoogle}
      height='50px'
      variantColor='blue'
      variant='outline'
      backgroundColor='white'
      onClick={handleAuthClick}
    >
      Sign in with Google
    </Button>
  </Flex>
);

export default SignIn;
````

## File: src/App.js
````javascript
import React, { useEffect, useState } from "react";

// Import Context
import EmailState from "./context/email/EmailState";

// Import Pages
import Main from "./pages/Main";
import SignIn from "./pages/SignIn";

import { ThemeProvider, CSSReset } from "@chakra-ui/core";

const App = () => {
  const [isAuthorize, setIsAuthorize] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const initialGoogleConnection = async () => {
      await window.gapi.load("client:auth2", {
        callback: () => {
          // Handle gapi.client initialization.
          window.gapi.client.setApiKey(process.env.REACT_APP_API_KEY);
          window.gapi.auth.authorize(
            {
              client_id: process.env.REACT_APP_CLIENT_ID,
              scope: process.env.REACT_APP_SCOPES,
              immediate: true,
            },
            handleAuthResult
          );
        },
        onerror: function () {
          // Handle loading error.
          console.log("gapi.client failed to load!");
        },
        timeout: 5000, // 5 seconds.
        ontimeout: function () {
          // Handle timeout.
          console.log("gapi.client could not load in a timely manner!");
        },
      });
    };

    try {
      initialGoogleConnection();
    } catch (error) {
      console.log("error: ", error);
    }

    setLoading(false);
    // eslint-disable-next-line
  }, []);

  const handleAuthResult = (authResult) => {
    if (authResult && !authResult.error) {
      console.log("Sign-in successful");
      // setIsAuthorize(true);
      loadClient();
    } else {
      console.error("handleAuthResult...");
      console.error(authResult);
    }
    setLoading(false);
  };

  const handleAuthClick = () => {
    setLoading(true);
    return window.gapi.auth.authorize(
      {
        client_id: process.env.REACT_APP_CLIENT_ID,
        scope: process.env.REACT_APP_SCOPES,
        immediate: false,
      },
      handleAuthResult
    );
  };

  const loadClient = () => {
    return window.gapi.client.load("gmail", "v1").then(
      (res) => {
        console.log("gapi client loaded for API");
        setIsAuthorize(true);
        // getMessages();
      },
      (err) => {
        console.error("Error loading window.gapi client for API", err);
      }
    );
  };

  return (
    <EmailState>
      <ThemeProvider>
        <CSSReset />
        {isAuthorize ? (
          <Main />
        ) : (
          <SignIn loading={loading} handleAuthClick={handleAuthClick} />
        )}
      </ThemeProvider>
    </EmailState>
  );
};

export default App;
````

## File: src/index.js
````javascript
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
````

## File: .env.example
````
REACT_APP_CLIENT_ID=<YOUR-CLIENT-ID>
REACT_APP_API_KEY=<YOUR-API-KEY>
REACT_APP_SCOPES=https://mail.google.com/
````

## File: .gitignore
````
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
````

## File: LICENSE
````
MIT License

Copyright (c) 2020 Lamsadi khalid

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````

## File: package.json
````json
{
  "name": "react-gmail-api",
  "version": "1.0.0",
  "description": "Gmail React App using JavaScript Gmail API",
  "main": "index.js",
  "homepage": "https://KhalidLam.github.io/CubeMail",
  "scripts": {
    "start": "react-scripts --openssl-legacy-provider start",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build",
    "build": "react-scripts build"
  },
  "author": "Khalid Lam",
  "license": "ISC",
  "devDependencies": {
    "gh-pages": "^3.0.0"
  },
  "dependencies": {
    "@chakra-ui/core": "^0.8.0",
    "@emotion/core": "^10.0.28",
    "@emotion/styled": "^10.0.27",
    "emotion-theming": "^10.0.27",
    "js-base64": "^2.5.2",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-icons": "^3.10.0",
    "react-infinite-scroll-component": "^5.0.5",
    "react-scripts": "^3.4.3"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
````

## File: README.md
````markdown
# CubeMail [![Build Status](https://img.shields.io/github/license/KhalidLam/Gmail-App-React)](https://github.com/KhalidLam/Gmail-App-React/blob/master/LICENSE)

![alt text](https://github.com/KhalidLam/CubeMail/blob/master/screenshot.jpg?raw=true)

CubeMail is a webmail-client built using [Create-React-App](https://github.com/facebook/create-react-app) and [Chakra UI](https://github.com/chakra-ui/chakra-ui/), It runs completely in the browser and uses the [Gmail's public Javascript API](https://developers.google.com/gmail/api/).

## [Check it live here](https://khalidlam.github.io/CubeMail/)

## How does it work?

The account sign-in and authentication process is **totally managed by Gmail's secure protocols**. The workflow is as follows:

- First-time users will see a landing page with a button to sign in to Gmail.
- Once successfully signed-in, Gmail will display a screen asking the user for permission to use the account in the application.
- After permission is granted, the application will load all account data and display the Inbox folder

**IMPORTANT:** The application does **NOT** store or persist any account or user data in any way at all. It simply fetches data from Gmail's API and displays it in the browser.

## Requirements

- All Gmail API requests require an **_API Key_** and an **_OAuth 2.0 Client ID_**. You can follow [these instructions](https://developers.google.com/fit/android/get-api-key) to obtain those credentials. Then, store those two values in the **_[.env](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables)_** file located in the root folder by replacing `<YOUR_API_KEY>` and `<YOUR_CLIENT_ID>` respectively.

## Getting started

1. Clone this repo

```sh
$ git clone https://github.com/KhalidLam/CubeMail.git
$ cd  CubeMail
$ npm install
```

2. Create a `.env` from `.env.example` and add your Google API credentials - [Google Api](https://console.developers.google.com)

```
$ cp .env.example .env
```

3. enable Gmail API - [Enable Google APIs](https://support.google.com/googleapi/answer/6158841?hl=en)

4. Run: `$ npm start`
5. Open http://localhost:3000 in your browser.

## Technologies used

- [React](https://github.com/facebook/react) - build interfaces & data flow
- [Chakra UI](https://github.com/chakra-ui/chakra-ui/) - components & styling
- [React Icons](https://github.com/react-icons/react-icons) - Icons
- [js-base64](https://github.com/dankogai/js-base64) - Base64 transcoder
- [Gmail's public Javascript API](https://github.com/google/google-api-javascript-client) - access to Google APIs
- [Gmail REST API](https://developers.google.com/gmail/api) - Documentation

## Features

- Read, Send, Reply, Forward, Trash And archive messages

## Todo

- [ ] Make app responsive
- [x] Add search feature
- [ ] Display user's Labels
- [ ] Add animation on Buttons
- [x] Add infinite scrolling
- [ ] Error handling on login or connexion issues
- [ ] Switch to Redux instead of Context API

### License:

[MIT License](https://opensource.org/licenses/MIT)
````
