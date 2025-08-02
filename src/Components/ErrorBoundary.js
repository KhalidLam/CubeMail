import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './ui/button';

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
        <div className="flex items-center justify-center min-h-screen p-8 bg-gray-50">
          <div className="flex flex-col items-center space-y-6 text-center max-w-md">
            <h1 className="text-2xl font-bold text-red-500">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600">
              We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md text-left text-sm max-w-full overflow-auto">
                <p className="font-bold text-red-700 mb-2">
                  Error Details:
                </p>
                <p className="text-red-600 font-mono whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </p>
              </div>
            )}
            <Button onClick={this.handleReload}>
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;