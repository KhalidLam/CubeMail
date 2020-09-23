import React from "react";
import { Button, Flex } from "@chakra-ui/core";
import { FcGoogle } from "react-icons/fc";

const SignIn = ({ handleAuthClick, loading }) => (
  <Flex h='100vh' justify='center' alignItems='center' bg='#e5f4f1'>
    <Button
      isLoading={loading}
      leftIcon={FcGoogle}
      height='50px'
      variantColor='blue'
      variant='outline'
      backgroundColor='white'
      onClick={handleAuthClick}
    >
      Sign in with Google
    </Button>
  </Flex>
);

export default SignIn;
