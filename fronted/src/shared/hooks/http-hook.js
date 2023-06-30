import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          if (responseData.message) {
            throw new Error(responseData.message);
          }
          else{
            throw new Error(responseData.error.message);
          }
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};

// A custom HTTP hook is being created to handle parsing, response, status code checking, and state management logic.
// The function "useHTTPClient" is exported, which will send a request and update the state behind the scenes.
// The hook uses React's "useState" to manage loading and error states.
// The "sendRequest" function is created to send the request with configurable options such as URL, method, body, and headers.
// The hook wraps the fetch function and handles data extraction and error handling.
// The hook returns the loading state, error state, and the "sendRequest" function.
// To avoid infinite loops, the "sendRequest" function is wrapped with "useCallback".
// The hook includes a "clearError" function to set the error to null.
// An "activeHTTPRequests" array is used to store active HTTP requests to handle cancellation.
// The abort controller is created and added to the "activeHTTPRequests" array before sending the request.
// The signal property is added to the fetch configuration to link the abort controller to the request.
// The "useEffect" hook is used to clean up the active HTTP requests when the component unmounts.
// The clean-up function aborts all the active requests using the stored abort controllers.