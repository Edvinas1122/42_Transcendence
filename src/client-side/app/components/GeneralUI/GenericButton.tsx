import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { serverFetch } from '@/lib/fetch.util';

interface GenericButtonProps {
	text: string;
	endpoint?: string;
	body?: object;
	disabled?: boolean;
	className?: string;
	type?: "button" | "submit" | "reset";
	icon?: any;
	iconPosition?: "left" | "right";
	iconClassName?: string;
}

const defaultStyle: React.CSSProperties = {
	backgroundColor: '#4CAF50', /* Green background */
	border: 'none',  /* Remove borders */
	color: 'white', /* White text */
	padding: '15px 32px', /* Some padding */
	textAlign: 'center', /* Centered text */
	textDecoration: 'none', /* Remove underline */
	display: 'inline-block', /* Display the next element on the same line */
	fontSize: '16px', /* Change default font size */
	margin: '4px 2px', /* Some margin */
	cursor: 'pointer', /* Add a mouse pointer on hover */
}

const GenericButton: React.FC<GenericButtonProps> = ({
	text,
	disabled,
	className,
	type,
	icon,
	iconPosition,
	iconClassName,
	endpoint,
	body,
}) => {
	const handleClick = async () => {
		if (endpoint) {
			const response = await serverFetch(
				endpoint,
				"POST",
				{ 'Content-Type': 'application/json' },
				JSON.stringify(body)
			);
		}
	};

	return (
		<button className={`GenericButton ${className}`} onClick={handleClick} disabled={disabled} type={type}>
			{icon && iconPosition === 'left' && <FontAwesomeIcon icon={icon} className={iconClassName} />}
			{text}
			{icon && iconPosition === 'right' && <FontAwesomeIcon icon={icon} className={iconClassName} />}
		</button>
	);
};

export default GenericButton;