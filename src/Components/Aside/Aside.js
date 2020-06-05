import React from "react";
import SendModel from "./SendModel";
import { Button, Box, List, ListItem } from "@chakra-ui/core";
import { MdLabel, MdStar, MdPeople, MdLoyalty, MdInbox } from "react-icons/md";
import { FiSend, FiFile } from "react-icons/fi";

const Aside = ({ getMessagesByCategory }) => {
  console.log("Aside Component");
  return (
    <React.Fragment>
      <Box w='16%' h='100%' bg='#00043c' color='white'>
        <List>
          {/* Send Model */}
          <ListItem p='0.5rem 1rem 1rem'>
            <SendModel />
          </ListItem>
          <ListItem>
            <Button
              id='INBOX'
              w='100%'
              h='45px'
              py={2}
              pl={8}
              leftIcon={MdInbox}
              justifyContent='flex-start'
              bg='#353863'
              _hover={{ bg: "#89b0c7" }}
              onClick={getMessagesByCategory}
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
              justifyContent='flex-start'
              variantColor='blue'
              variant='ghost'
              onClick={getMessagesByCategory}
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
              justifyContent='flex-start'
              variantColor='blue'
              variant='ghost'
              onClick={getMessagesByCategory}
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
              justifyContent='flex-start'
              variantColor='blue'
              variant='ghost'
              onClick={getMessagesByCategory}
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
              justifyContent='flex-start'
              variantColor='blue'
              variant='ghost'
              onClick={getMessagesByCategory}
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
              justifyContent='flex-start'
              variantColor='blue'
              variant='ghost'
              onClick={getMessagesByCategory}
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
              justifyContent='flex-start'
              variantColor='blue'
              variant='ghost'
              onClick={getMessagesByCategory}
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
              justifyContent='flex-start'
              variantColor='blue'
              variant='ghost'
              onClick={getMessagesByCategory}
            >
              Promotions
            </Button>
          </ListItem>
        </List>
      </Box>
    </React.Fragment>
  );
};

export default Aside;
