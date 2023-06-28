import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { serverFetch } from '@/lib/fetch.util';

interface GenericMultiStateButtonProps {
	text: string;
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
	icon?: any;
	endpoint?: string;
	body?: object;
}

interface ButtonStates {
    firstState: GenericMultiStateButtonProps;
    secondState: GenericMultiStateButtonProps;
    thirdState?: GenericMultiStateButtonProps;
    toggle?: boolean; //toggle means that every time the button is clicked, state is changed. false means it only changes once.
    className?: string;
    iconClassName?: string;
    iconPosition?: "left" | "right";
}

const GenericMultiStateButton: React.FC<ButtonStates> = ({firstState, secondState, thirdState, toggle, className, iconClassName, iconPosition}) => {

    const [buttonState, setButtonState] = useState(firstState);

    const changeState = () => {
        if (buttonState === firstState) {
            setButtonState(secondState);
        } else if (thirdState && buttonState === secondState) {
            setButtonState(thirdState);
        } else if (toggle) {
            if (!thirdState && buttonState === secondState ||
                thirdState && buttonState === thirdState) {
                setButtonState(firstState);
            }
        }
    };
	const handleClick = async () => {
        try {
            if (buttonState.endpoint) {
                const response = await serverFetch(
                    buttonState.endpoint,
                    "POST",
                    { 'Content-Type': 'application/json' },
                    JSON.stringify(buttonState.body)
                );
            }
        } catch (error) {
            console.error("Error: ", error);
        }
        changeState();
	};

	return (
		<button className={`${className}`} onClick={handleClick} disabled={buttonState.disabled} type={buttonState.type}>
			{buttonState.icon && iconPosition === 'left' && <FontAwesomeIcon icon={buttonState.icon} className={iconClassName} />}
			{buttonState.text}
			{buttonState.icon && iconPosition === 'right' && <FontAwesomeIcon icon={buttonState.icon} className={iconClassName} />}
		</button>
	);
};

export default GenericMultiStateButton;