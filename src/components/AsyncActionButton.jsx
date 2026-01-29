import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default function AsyncActionButton({
  isRunning,
  onRun,                   // () => Promise<void>; call run(...) from parent
  label = 'Generate',
  busyLabel = 'Generating…',
  successOpen,
  onSuccessClose,
  failureOpen,
  onFailureClose,
  message,
  className = 'btn btn-primary',
  successTitle = '✅ Task Complete',
  failureTitle = '‼️ Failure',
}) {
  return (
    <>
      <button
        onClick={onRun}
        disabled={isRunning}
        className={className}
        aria-busy={isRunning}
      >
        {isRunning ? busyLabel : label}
      </button>

      <Popup open={successOpen} onClose={onSuccessClose} modal>
        <div style={{ padding: '1rem' }}>
          <h3>{successTitle}</h3>
          <p>{message || 'Success'}</p>
          <button onClick={onSuccessClose}>Close</button>
        </div>
      </Popup>

      <Popup open={failureOpen} onClose={onFailureClose} modal>
        <div style={{ padding: '1rem' }}>
          <h3>{failureTitle}</h3>
          <p>{message || 'Something went wrong. Please try again.'}</p>
          <button onClick={onFailureClose}>Close</button>
        </div>
      </Popup>
    </>
  );
}
``