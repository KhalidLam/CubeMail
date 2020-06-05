import React, { Component } from "react";
import ReplyModel from "./ReplyModel";
import { getHeader, isEmpty } from "./Helper";
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

import {
  MdArchive,
  MdMoreHoriz,
  MdArrowForward,
  MdReplay,
} from "react-icons/md";

export class MessageCp extends Component {
  componentDidUpdate() {
    console.log("Component Did Update.");
    if (!isEmpty(this.props.message)) {
      this.addToFrame(this.props.message);
    }
  }

  formatReplayData = (headers) => {
    console.log("formatReplayData...", headers);

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

  handleTrashBtn = (userId, messageId) => {
    console.log("Trash Message...");
    return window.gapi.client.gmail.users.messages
      .trash({
        userId: userId,
        id: messageId,
      })
      .then((resp) => {
        console.log("resp: ", resp);
        if (resp.status === 200) {
          this.toast({
            title: "Message Deleted",
            description: "We've Delete this Message.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        console.log("error: ", error);
        this.toast({
          title: "An error occurred.",
          description: "Unable to Delete Message.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  handleArchiveBtn = (ids, labelIds) => {
    console.log("Archive Message...");
    return window.gapi.client.gmail.users.messages
      .batchModify({
        userId: "me",
        resource: {
          ids: ids,
          removeLabelIds: labelIds,
        },
      })
      .then((resp) => {
        console.log("resp: ", resp);
        if (resp.status === 204) {
          this.toast({
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
        this.toast({
          title: "An error occurred.",
          description: "Unable to Archive Message.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  addToFrame = (message) => {
    console.log("add To Iframe...");
    var ifrm = document.getElementById("iframe").contentWindow.document;
    ifrm.body.innerHTML = this.getMessageBody(message.payload);
  };

  getMessageBody = (message) => {
    var encodedBody = "";
    if (typeof message.parts === "undefined") {
      encodedBody = message.body.data;
    } else {
      encodedBody = this.getHTMLPart(message.parts);
    }

    return Base64.decode(encodedBody);
  };

  getHTMLPart = (arr) => {
    for (var x = 0; x <= arr.length; x++) {
      if (typeof arr[x].parts === "undefined") {
        if (arr[x].mimeType === "text/html") {
          return arr[x].body.data;
        }
      } else {
        return this.getHTMLPart(arr[x].parts);
      }
    }
    return "";
  };

  render() {
    // console.log("Message Component", this.state.message);
    console.log("Message Component State: ", this.state);
    console.log("Message Component Props: ", this.props);
    const message = this.props.message;
    const headers = isEmpty(message) ? [] : message.payload.headers;

    if (!isEmpty(message)) {
      console.log("inside If");
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
            <ReplyModel
              replayData={this.formatReplayData(message.payload.headers)}
            />
            <Button
              rightIcon={MdArrowForward}
              variantColor='teal'
              variant='outline'
              onClick={() => this.addToFrame(message)}
            >
              Forward
            </Button>
            <Button
              rightIcon={MdArchive}
              variantColor='teal'
              variant='outline'
              onClick={() => this.handleArchiveBtn([message.id], ["INBOX"])}
            >
              Archive
            </Button>
            <Button
              rightIcon='delete'
              variantColor='teal'
              variant='outline'
              onClick={() => this.handleTrashBtn("me", message.id)}
            >
              Delete
            </Button>
            {/*
            <Button variantColor='teal' variant='outline'>
              <Box as={MdMoreHoriz} size='22px' />
            </Button>
          */}
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
                  name={getHeader(headers, "From")}
                  src='https://bit.ly/tioluwani-kolawole'
                  mr={4}
                />
                <Box w='80%'>
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
                <Box
                  as='iframe'
                  id='iframe'
                  title='messageBody'
                  srcdoc='<p>Hello world!</p>'
                >
                  <p>Your browser does not support iframes.</p>
                </Box>
              </AspectRatioBox>
            </Box>
          </Box>
        </Flex>
      );
    } else {
      console.log("inside else");

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
          <Box className='mailContainer' p={2} overflow='auto'></Box>
        </Flex>
      );
    }
  }
}

export default MessageCp;
