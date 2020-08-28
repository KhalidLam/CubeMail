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
