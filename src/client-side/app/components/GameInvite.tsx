import React, { useContext, useEffect } from 'react';
import { ConfirmationContext } from './confirmationDialog/Confirmation';
import { useRouter } from 'next/navigation';
import { EventSourceProviderContext } from './ContextProviders/eventContext';
import DisplayPopUp from './EventsInfoUI/EventsInfo';


interface GameInfo {
	event: string;
	message: string;
	inviteKey: string;
}

export const GameInvite: React.FC = () => {
	const { registerEventListener } = useContext(EventSourceProviderContext);
	const { setConfirmation } = useContext(ConfirmationContext);
	const router = useRouter();

	useEffect(() => {
		const unregister = registerEventListener("game", (data: GameInfo) => {
			console.log("game", data);
			switch (data.event) {
				case "invite":
						setConfirmation({
							title: "You been invited to a game!",
							message: data.message,
							onConfirm: () => {
								router.replace(`/game/?join=${data.inviteKey}`);
							},
							onCancel: () => {},
							yes: "Let's Ping Gop!",
							no: "Hard Pass",
						});
					break;
				case "inviteAccepted":
					router.replace(`/game/?join=${data.inviteKey}`);
					DisplayPopUp("Invite Accepted", data.message);
				break;
			}
			});

			return () => unregister;
		}, []);

	return null;
}