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

const GenericButton: React.FC<GenericButtonProps> = ({ text, disabled, className, type, icon, iconPosition, iconClassName, endpoint, body }) => {
	// const { fetchWithToken } = useContext(AuthorizedFetchContext);

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
		<button className={`${className}`} onClick={handleClick} disabled={disabled} type={type}>
			{icon && iconPosition === 'left' && <FontAwesomeIcon icon={icon} className={iconClassName} />}
			{text}
			{icon && iconPosition === 'right' && <FontAwesomeIcon icon={icon} className={iconClassName} />}
		</button>
	);
};

export default GenericButton;