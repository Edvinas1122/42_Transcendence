import React from 'react';
import "./Confirmation.css";

interface ConfiramtionContext {
	confirmation : ConfirmationDialogProps | null;
	setConfirmation : React.Dispatch<React.SetStateAction<ConfirmationDialogProps | null>>;
}

export const ConfirmationContext = React.createContext<ConfiramtionContext>(
	{
		confirmation: null,
		setConfirmation: () => {}
	}
);

interface ConfirmationDialogProps {
	title: string;
	message: string;
	yes?: string;
	no?: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export const ConfirmationProvider = ({
	children
} : {
	children: React.ReactNode;
}) => {
  const [confirmation, setConfirmation] = React.useState<ConfirmationDialogProps | null>(null);

  return (
    <ConfirmationContext.Provider value={{ confirmation, setConfirmation }}>
      {children}
      {confirmation && (
        <ConfirmationDialog
          title={confirmation.title}
          message={confirmation.message}
		  yes={confirmation.yes || "Confirm"}
		  no={confirmation.no || "Cancel"}
          onConfirm={confirmation.onConfirm}
          onCancel={() => setConfirmation(null)}
		  setConfirmation={setConfirmation}
        />
      )}
    </ConfirmationContext.Provider>
  );
};

function ConfirmationDialog({
	title,
	message,
	yes,
	no,
	onConfirm,
	onCancel,
	setConfirmation
}: ConfirmationDialogProps & {
	setConfirmation: React.Dispatch<React.SetStateAction<ConfirmationDialogProps | null>>
}) {

	React.useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.keyCode === 27) {
				setConfirmation(null);
			}
		};
		window.addEventListener('keydown', handleEsc);
		return () => {
			window.removeEventListener('keydown', handleEsc);
		};
	}, [setConfirmation]);

	const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (event.target === event.currentTarget) {
			setConfirmation(null);
		}
	};

	const handleConfirm = () => {
		onConfirm();
		setConfirmation(null);
	};

	return (
	  <div className="confirmation-dialog">
		<div className="dialog-content">
		<h2>{title}</h2>
		<p>{message}</p>
		<button onClick={handleConfirm}>{yes}</button>
		<button onClick={onCancel}>{no}</button>
		</div>
	  </div>
	);
}