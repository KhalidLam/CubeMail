import React from "react";
import { Button } from "../Components/ui/button";
import { Alert, AlertDescription } from "../Components/ui/alert";
import { Spinner } from "../Components/ui/spinner";
import { AlertTriangle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import PropTypes from "prop-types";

const SignIn = ({ handleAuthClick, loading, error }) => (
  <div className="flex h-screen justify-center items-center bg-[#e5f4f1]">
    <div className="flex flex-col space-y-6 max-w-md w-full px-4">
      {error && (
        <Alert variant="destructive" className="rounded-md">
          <AlertTriangle className="h-4 w-4" />
          <div className="flex flex-col items-start space-y-1">
            <div className="text-sm font-medium">Authentication Error</div>
            <AlertDescription className="text-xs">
              {error.includes('403') 
                ? 'This app needs to be verified by Google to access Gmail. Please contact the developer or add your email as a test user in Google Cloud Console.'
                : error
              }
            </AlertDescription>
          </div>
        </Alert>
      )}
      
      <Button
        disabled={loading}
        className="h-12 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        onClick={handleAuthClick}
        size="lg"
      >
        {loading ? (
          <Spinner className="mr-2 h-4 w-4" />
        ) : (
          <FcGoogle className="mr-2 h-5 w-5" />
        )}
        Sign in with Google
      </Button>
      
      <p className="text-xs text-gray-600 text-center">
        Click to authenticate with your Gmail account
      </p>
    </div>
  </div>
);

SignIn.propTypes = {
  handleAuthClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default SignIn;
