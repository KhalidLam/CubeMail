import React from "react";
import { Button, Flex, VStack, Text, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import PropTypes from "prop-types";

const SignIn = ({ handleAuthClick, loading, error }) => (
  <Flex h='100vh' justify='center' alignItems='center' bg='#e5f4f1'>
    <VStack spacing={6} maxW="md" w="full" px={4}>
      {error && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <AlertTitle fontSize="sm">Authentication Error</AlertTitle>
            <AlertDescription fontSize="xs">
              {error.includes('403') 
                ? 'This app needs to be verified by Google to access Gmail. Please contact the developer or add your email as a test user in Google Cloud Console.'
                : error
              }
            </AlertDescription>
          </VStack>
        </Alert>
      )}
      
      <Button
        isLoading={loading}
        leftIcon={<FcGoogle />}
        height='50px'
        variantColor='blue'
        variant='outline'
        backgroundColor='white'
        onClick={handleAuthClick}
        size="lg"
      >
        Sign in with Google
      </Button>
      
      <Text fontSize="xs" color="gray.600" textAlign="center">
        Click to authenticate with your Gmail account
      </Text>
    </VStack>
  </Flex>
);

SignIn.propTypes = {
  handleAuthClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default SignIn;
