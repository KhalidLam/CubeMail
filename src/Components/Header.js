import React from "react";
import { Box, Heading, Flex, Text, Button, useToast } from "@chakra-ui/core";
import { GiHamburgerMenu } from "react-icons/gi";

const MenuItems = ({ children }) => (
  <Text mt={{ base: 4, md: 0 }} mr={6} display='block'>
    {children}
  </Text>
);

const Header = (props) => {
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);
  const toast = useToast();

  return (
    <Flex
      as='nav'
      align='center'
      justify='space-between'
      wrap='wrap'
      padding='1em'
      bg='teal.500'
      color='white'
      {...props}
    >
      <Flex align='center' mr={5}>
        <Heading as='h1' size='lg'>
          Mail App
        </Heading>
      </Flex>

      {/* Hamburger Menu Icon */}
      <Box
        as={GiHamburgerMenu}
        display={{ sm: "block", md: "none" }}
        onClick={handleToggle}
      />

      {/* ---- MenuItems ---- */}
      {/* <Box
        display={{ sm: show ? "block" : "none", md: "flex" }}
        width={{ sm: "full", md: "auto" }}
        alignItems='center'
        flexGrow={1}
      >
        <MenuItems>Docs</MenuItems>
        <MenuItems>Examples</MenuItems>
        <MenuItems>Blog</MenuItems>
      </Box> */}

      {/* ----  Create account Button ---- */}
      <Box
        display={{ sm: show ? "block" : "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
      >
        <Button
          bg='transparent'
          border='1px'
          onClick={() =>
            toast({
              title: "Account created.",
              description: "We've created your account for you.",
              status: "success",
              duration: 9000,
              isClosable: true,
            })
          }
        >
          Create account
        </Button>
      </Box>
    </Flex>
  );
};

export default Header;
