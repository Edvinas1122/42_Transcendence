import React from 'react';

export const ConfirmationContext = React.createContext();

export const ConfirmationProvider = ({ children }) => {
  const [confirmation, setConfirmation] = React.useState(null);

  return (
    <ConfirmationContext.Provider value={{ confirmation, setConfirmation }}>
      {children}
      {confirmation && (
        <ConfirmationDialog
          title={confirmation.title}
          message={confirmation.message}
          onConfirm={confirmation.onConfirm}
          onCancel={() => setConfirmation(null)}
        />
      )}
    </ConfirmationContext.Provider>
  );
};

function ConfirmationDialog({ title, message, onConfirm, onCancel }) {
	return (
	  <div className="confirmation-dialog">
		<h2>{title}</h2>
		<p>{message}</p>
		<button onClick={onConfirm}>Confirm</button>
		<button onClick={onCancel}>Cancel</button>
	  </div>
	);
}