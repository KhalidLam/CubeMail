import React from "react";
import SendModel from "./SendModel";
import { Button, Box, List, ListItem } from "@chakra-ui/core";
import { MdLabel, MdStar, MdPeople, MdLoyalty, MdInbox } from "react-icons/md";
import { FiSend, FiFile } from "react-icons/fi";
import "./Aside.css";

const Aside = ({ getMessagesByCategory }) => {
  return (
    <React.Fragment>
      <Box
        w='16%'
        h='100%'
        bg='#00043c'
        color='white'
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
              className='activeBtn'
              w='100%'
              h='45px'
              py={2}
              pl={8}
              leftIcon={MdInbox}
              justifyContent='flex-start'
              onClick={getMessagesByCategory}
            >
              Inbox
            </Button>
          </ListItem>
          <ListItem>
            <Button
              id='STARRED'
              className='labelBtn'
              w='100%'
              h='45px'
              py={2}
              pl={8}
              leftIcon={MdStar}
              justifyContent='flex-start'
              onClick={getMessagesByCategory}
            >
              Starred
            </Button>
          </ListItem>
          <ListItem>
            <Button
              id='IMPORTANT'
              className='labelBtn'
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
              className='labelBtn'
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
              className='labelBtn'
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
              className='labelBtn'
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
              className='labelBtn'
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
              className='labelBtn'
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
