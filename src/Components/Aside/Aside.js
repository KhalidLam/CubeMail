import React from "react";
import SendModel from "../Message/SendModel";
// Icons
import { MdArchive } from "react-icons/md";
import { FiSend, FiFile } from "react-icons/fi";
// Chakra Component
import { Button, Box, List, ListItem } from "@chakra-ui/core";

const Aside = (props) => {
  console.log("Aside Component");
  return (
    <>
      <Box w='16%' h='100%' bg='#00043c' color='white'>
        <List py={4}>
          {/* Send Model */}
          <ListItem p={4}>
            <SendModel />
          </ListItem>
          <ListItem>
            <Button
              w='100%'
              h='45px'
              py={2}
              pl={8}
              leftIcon='email'
              justifyContent='flex-start'
              bg='#353863'
              _hover={{ bg: "#89b0c7" }}
            >
              My Inbox
            </Button>
          </ListItem>
          <ListItem>
            <Button
              w='100%'
              h='45px'
              py={2}
              pl={8}
              leftIcon={MdArchive}
              justifyContent='flex-start'
              variantColor='blue'
              variant='ghost'
            >
              Archive
            </Button>
          </ListItem>
          <ListItem>
            <Button
              w='100%'
              h='45px'
              py={2}
              pl={8}
              leftIcon='delete'
              justifyContent='flex-start'
              variantColor='blue'
              variant='ghost'
            >
              Trash
            </Button>
          </ListItem>
          <ListItem>
            <Button
              w='100%'
              h='45px'
              py={2}
              pl={8}
              leftIcon={FiSend}
              justifyContent='flex-start'
              variantColor='blue'
              variant='ghost'
            >
              Sent
            </Button>
          </ListItem>
          <ListItem>
            <Button
              w='100%'
              h='45px'
              py={2}
              pl={8}
              leftIcon={FiFile}
              justifyContent='flex-start'
              variantColor='blue'
              variant='ghost'
            >
              My Drafts
            </Button>
          </ListItem>
        </List>
      </Box>
    </>
  );
};

export default Aside;
