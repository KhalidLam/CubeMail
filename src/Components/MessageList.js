import React from "react";
import {
  Flex,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Avatar,
  Text,
} from "@chakra-ui/core";

const SingleMessage = ({ name, subject, msg }) => (
  <Flex
    wrap='no-wrap'
    justify='space-around'
    py={2}
    borderTop='1px'
    borderBottom='1px'
    borderColor='gray.200'
    cursor='pointer'
    _hover={{ borderColor: "black" }}
  >
    <Avatar name={name} src='https://bit.ly/tioluwani-kolawole' />
    <Box w='80%'>
      <Text fontSize='sm' color='gray.700'>
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

const Messages = () => {
  return (
    <React.Fragment>
      {/* Container */}
      <Flex
        direction='column'
        wrap='no-wrap'
        w='26%'
        h='100%'
        bg='#f1f1f1'
        color='black'
      >
        {/* Search bar */}
        <Box py='5px' bg='white' border='1px' borderColor='gray.200'>
          <InputGroup size='lg'>
            <InputLeftElement
              children={<Icon name='search' color='gray.300' />}
            />
            <Input
              type='text'
              placeholder='Search mail'
              borderWidth='0px'
              borderRadius='0px'
              focusBorderColor='white'
            />
          </InputGroup>
        </Box>

        {/* Message List */}
        <Box overflowY='auto'>
          <SingleMessage
            name='khalid Lam'
            subject='Welcome to the course + Your first JavaScript challenge'
            msg=' Lorem ipsum is placeholder text commonly used in the graphic and
        publishing.'
          />
          <SingleMessage
            name='Ahmed sami'
            subject='Welcome to the course + Your first JavaScript challenge'
            msg=' Lorem ipsum is placeholder text commonly used in the graphic and
        publishing.'
          />
          <SingleMessage
            name='Ali Dari'
            subject='Welcome to the course + Your first JavaScript challenge'
            msg=' Lorem ipsum is placeholder text commonly used in the graphic and
        publishing.'
          />
          <SingleMessage
            name='Mohamed Amine'
            subject='Welcome to the course + Your first JavaScript challenge'
            msg=' Lorem ipsum is placeholder text commonly used in the graphic and
        publishing.'
          />
          <SingleMessage
            name='Youness Reda'
            subject='Welcome to the course + Your first JavaScript challenge'
            msg=' Lorem ipsum is placeholder text commonly used in the graphic and
        publishing.'
          />
          <SingleMessage
            name='Samir Lachkar'
            subject='Welcome to the course + Your first JavaScript challenge'
            msg=' Lorem ipsum is placeholder text commonly used in the graphic and
        publishing.'
          />
          <SingleMessage
            subject='Welcome to the course + Your first JavaScript challenge'
            name='Omar Nasor'
          />
        </Box>
      </Flex>
    </React.Fragment>
  );
};

export default Messages;
