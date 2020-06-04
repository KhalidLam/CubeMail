import React from "react";
import {
  Flex,
  Box,
  Button,
  AspectRatioBox,
  Avatar,
  Text,
} from "@chakra-ui/core";

import {
  MdArchive,
  MdMoreHoriz,
  MdArrowForward,
  MdReplay,
} from "react-icons/md";

const Message = () => {
  return (
    // Container
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
        <Button rightIcon={MdReplay} variantColor='teal' variant='outline'>
          Replay
        </Button>
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
        <Button variantColor='teal' variant='outline'>
          <Box as={MdMoreHoriz} size='22px' />
        </Button>
      </Flex>

      {/* Mail Container */}
      <Box p={2} overflow='auto'>
        {/* Header Mail */}
        <Box mb={2}>
          <Text fontSize='lg' fontWeight='bold' color='gray.700' mb={1}>
            16 nouveaux emplois development - Maroc
          </Text>
          <Flex wrap='no-wrap' justify='flex-start'>
            <Avatar
              name='Kola Tioluwani'
              src='https://bit.ly/tioluwani-kolawole'
              mr={4}
            />
            <Box w='80%'>
              <Text fontSize='md' color='gray.700'>
                Indeed {`<alert@indeed.com>`}
              </Text>
              <Text fontSize='sm' color='gray.500'>
                6/2/2020 9:01 PM
              </Text>
            </Box>
          </Flex>
          <Text fontSize='sm' color='gray.700' mt={1}>
            To: lamsadiKhalid@gmail
          </Text>
        </Box>

        {/* Body Mail */}
        <Box>
          <AspectRatioBox ratio={16 / 9}>
            <Box
              as='iframe'
              title='naruto'
              src='http://127.0.0.1:5500/public/test.html'
            />
          </AspectRatioBox>
        </Box>
      </Box>
    </Flex>
  );
};

export default Message;
