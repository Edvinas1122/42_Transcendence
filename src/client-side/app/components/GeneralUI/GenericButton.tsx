import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AuthorizedFetchContext } from '@/components/ContextProviders/authContext';

interface GenericButtonProps {
	text: string;
	disabled?: boolean;
	className?: string;
	style?: React.CSSProperties;
	type?: "button" | "submit" | "reset";
	icon?: any;
	iconPosition?: "left" | "right";
	iconStyle?: React.CSSProperties;
	iconClassName?: string;
	endpoint?: string;
	body?: object;
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

const defaultIconStyle: React.CSSProperties = {
	marginRight: '10px',
}

const GenericButton: React.FC<GenericButtonProps> = ({ text, disabled, className, style=defaultStyle, type, icon, iconPosition, iconStyle=defaultIconStyle, iconClassName, endpoint, body }) => {
	const { fetchWithToken } = useContext(AuthorizedFetchContext);

	const handleClick = async () => {
		if (endpoint) {
			const response = await fetchWithToken(endpoint, {
				method: 'POST',
				body: JSON.stringify(body),
				headers: { 'Content-Type': 'application/json' },
			});

			// handle the response here...
		}
	};

	return (
		<button className={`GenericButton ${className}`} style={style} onClick={handleClick} disabled={disabled} type={type}>
			{icon && iconPosition === 'left' && <FontAwesomeIcon icon={icon} className={iconClassName} style={iconStyle} />}
			{text}
			{icon && iconPosition === 'right' && <FontAwesomeIcon icon={icon} className={iconClassName} style={iconStyle} />}
		</button>
	);
};

export default GenericButton;