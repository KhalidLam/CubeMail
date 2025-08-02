import React from 'react';
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          p={8}
          bg="gray.50"
        >
          <VStack spacing={6} textAlign="center" maxW="md">
            <Heading size="lg" color="red.500">
              Oops! Something went wrong
            </Heading>
            <Text color="gray.600">
              We apologize for the inconvenience. An unexpected error has occurred.
            </Text>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                p={4}
                bg="red.50"
                border="1px"
                borderColor="red.200"
                borderRadius="md"
                textAlign="left"
                fontSize="sm"
                maxW="100%"
                overflow="auto"
              >
                <Text fontWeight="bold" color="red.700" mb={2}>
                  Error Details:
                </Text>
                <Text color="red.600" fontFamily="mono" whiteSpace="pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </Text>
              </Box>
            )}
            <Button variantColor="blue" onClick={this.handleReload}>
              Reload Page
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;