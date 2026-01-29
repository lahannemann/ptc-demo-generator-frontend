import { useState, useCallback } from 'react';

export default function useAsyncPopupAction() {
  const [isRunning, setIsRunning] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFailurePopup, setShowFailurePopup] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  // run(fn) expects an async function that returns a success string.
  // Throw an Error(message) inside fn to trigger failure.
  const run = useCallback(async (fn) => {
    if (isRunning) return;
    setIsRunning(true);
    setResponseMessage('');
    try {
      const message = await fn();                 // <- page-specific work
      setResponseMessage(message || 'Success');   // success message for popup
      setShowSuccessPopup(true);
    } catch (e) {
      setResponseMessage(e?.message || 'Operation failed');
      setShowFailurePopup(true);
    } finally {
      setIsRunning(false);
    }
  }, [isRunning]);

  return {
    isRunning,
    responseMessage,
    showSuccessPopup,
    setShowSuccessPopup,
    showFailurePopup,
    setShowFailurePopup,
    run,
  };
}