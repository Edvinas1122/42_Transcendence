import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { serverFetch } from '@/lib/fetch.util';

interface GenericButtonProps {
	text: string;
	disabled?: boolean;
	className?: string;
	type?: "button" | "submit" | "reset";
	icon?: any;
	iconPosition?: "left" | "right";
	iconStyle?: React.CSSProperties;
	iconClassName?: string;
	endpoint?: string;
	body?: object;
}

const GenericButton: React.FC<GenericButtonProps> = ({ text, disabled, className, type, icon, iconPosition, iconClassName, endpoint, body }) => {
	// const { fetchWithToken } = useContext(AuthorizedFetchContext);

	const handleClick = async () => {
		if (endpoint) {
			// const response = await fetchWithToken(endpoint, {
			// 	method: 'POST',
			// 	body: JSON.stringify(body),
			// 	headers: { 'Content-Type': 'application/json' },
			// });
			const response = await serverFetch(
				endpoint,
				"POST",
				{ 'Content-Type': 'application/json' },
				JSON.stringify(body)
			);
			// handle the response here...
		}
	};

	return (
		<button className={`${className}`} onClick={handleClick} disabled={disabled} type={type}>
			{icon && iconPosition === 'left' && <FontAwesomeIcon icon={icon} className={iconClassName} />}
			{text}
			{icon && iconPosition === 'right' && <FontAwesomeIcon icon={icon} className={iconClassName} />}
		</button>
	);
};

export default GenericButton;