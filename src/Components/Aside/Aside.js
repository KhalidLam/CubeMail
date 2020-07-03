import React from "react";
import SendModel from "./SendModel";
import { Button, Box, List, ListItem } from "@chakra-ui/core";
import { MdLabel, MdStar, MdPeople, MdLoyalty, MdInbox } from "react-icons/md";
import { FiSend, FiFile } from "react-icons/fi";
import PropTypes from "prop-types";

const Aside = ({ getMessages }) => {
  const handleClick = (e) => {
    const categoryId = e.target.id;
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
      // color='white'
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
            // className='activeBtn'
            variantColor='blue'
            variant='solid'
            w='100%'
            h='45px'
            py={2}
            pl={8}
            leftIcon={MdInbox}
            justifyContent='flex-start'
            onClick={handleClick}
          >
            Inbox
          </Button>
        </ListItem>
        <ListItem>
          <Button
            id='STARRED'
            // className='labelBtn'
            variantColor='blue'
            variant='ghost'
            w='100%'
            h='45px'
            py={2}
            pl={8}
            leftIcon={MdStar}
            justifyContent='flex-start'
            onClick={handleClick}
          >
            Starred
          </Button>
        </ListItem>
        <ListItem>
          <Button
            id='IMPORTANT'
            // className='labelBtn'
            w='100%'
            h='45px'
            py={2}
            pl={8}
            leftIcon={MdLabel}
            justifyContent='flex-start'
            variantColor='blue'
            variant='ghost'
            onClick={handleClick}
          >
            Important
          </Button>
        </ListItem>
        <ListItem>
          <Button
            id='SENT'
            // className='labelBtn'
            w='100%'
            h='45px'
            py={2}
            pl={8}
            leftIcon={FiSend}
            justifyContent='flex-start'
            variantColor='blue'
            variant='ghost'
            onClick={handleClick}
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
            onClick={handleClick}
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
            onClick={handleClick}
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
            onClick={handleClick}
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
            onClick={handleClick}
          >
            Promotions
          </Button>
        </ListItem>
      </List>
    </Box>
  );
};

Aside.prototype = {
  getMessages: PropTypes.func.isRequired,
};

export default Aside;
