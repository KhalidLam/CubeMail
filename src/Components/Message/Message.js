import React from "react";
import ReplyModel from "./ReplyModel";
import ForwardModel from "./ForwardModel";
import { getHeader, isEmpty, removeQuote } from "../Helper";
import { Base64 } from "js-base64";

import {
  Flex,
  Box,
  Button,
  AspectRatioBox,
  Avatar,
  Text,
  useToast,
} from "@chakra-ui/core";

import { MdArchive, MdArrowForward } from "react-icons/md";

const Message = ({ message }) => {
  console.log("Message Component", message);
  const headers = isEmpty(message) ? [] : message.payload.headers;
  const toast = useToast();

  React.useEffect(() => {
    if (!isEmpty(message)) {
      addToFrame(message);
    }
  }, [message]);

  let formatReplayData = (headers) => {
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

  let handleTrashBtn = (userId, messageId) => {
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

  let handleArchiveBtn = (ids, labelIds) => {
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

  let addToFrame = (message) => {
    var ifrm = document.getElementById("iframe").contentWindow.document;
    ifrm.body.innerHTML = getMessageBody(message.payload);
  };

  let getMessageBody = (message) => {
    var encodedBody = "";
    if (typeof message.parts === "undefined") {
      encodedBody = message.body.data;
    } else {
      encodedBody = getHTMLPart(message.parts);
    }

    return Base64.decode(encodedBody);
  };

  let getHTMLPart = (arr) => {
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

  if (!isEmpty(message)) {
    return (
      <Flex
        direction='column'
        wrap='no-wrap'
        w='58%'
        h='100%'
        p='0.6rem 1rem'
        bg='white'
        border='1px'
        borderColor='gray.200'
        color='black'
      >
        {/* Header Buttons */}
        <Flex justify='space-around' wrap='no-wrap' mb={2}>
          <ReplyModel replayData={formatReplayData(message.payload.headers)} />
          <ForwardModel forwardData={message} getMessageBody={getMessageBody} />

          <Button
            rightIcon={MdArchive}
            variantColor='teal'
            variant='outline'
            onClick={() => handleArchiveBtn([message.id], ["INBOX"])}
          >
            Archive
          </Button>
          <Button
            rightIcon='delete'
            variantColor='teal'
            variant='outline'
            onClick={() => handleTrashBtn("me", message.id)}
          >
            Delete
          </Button>
        </Flex>

        {/* Mail Container */}
        <Box className='mailContainer' p={2}>
          {/* Header Mail */}
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
                SAK
                <Text fontSize='md' color='gray.700'>
                  {getHeader(headers, "From")}
                </Text>
                <Text fontSize='sm' color='gray.500'>
                  {getHeader(headers, "Date")}
                </Text>
              </Box>
            </Flex>
            <Text fontSize='sm' color='gray.700' mt={1}>
              {`To: ${getHeader(headers, "To")}`}
            </Text>
          </Box>

          {/* Body Mail */}
          <Box className='mailBody'>
            <AspectRatioBox ratio={16 / 9}>
              <Box as='iframe' id='iframe' title='messageBody'>
                <p>Your browser does not support iframes.</p>
              </Box>
            </AspectRatioBox>
          </Box>
        </Box>
      </Flex>
    );
  } else {
    return (
      <Flex
        direction='column'
        wrap='no-wrap'
        w='58%'
        h='100%'
        p='0.6rem 1rem'
        bg='white'
        border='1px'
        borderColor='gray.200'
        color='black'
      >
        {/* Header Buttons */}
        <Flex justify='space-around' wrap='no-wrap' mb={2}>
          <ReplyModel replayData={{}} />
          <Button
            rightIcon={MdArrowForward}
            variantColor='teal'
            variant='outline'
          >
            Forward
          </Button>
          <Button rightIcon={MdArchive} variantColor='teal' variant='outline'>
            Archive
          </Button>
          <Button rightIcon='delete' variantColor='teal' variant='outline'>
            Delete
          </Button>
        </Flex>
        <Box
          className='mailContainer'
          mt={6}
          p={2}
          display='flex'
          align='center'
          justifyContent='center'
        ></Box>
      </Flex>
    );
  }
};

export default Message;
