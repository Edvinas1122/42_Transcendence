import React, { useContext, useEffect } from 'react';
import { ConfirmationContext } from './confirmationDialog/Confirmation';
import { useRouter } from 'next/navigation';
import { EventSourceProviderContext } from './ContextProviders/eventContext';


interface GameInfo {
	event: string;
	message: string;
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
							confirm: () => {
								router.replace("/");
							},
							cancel: () => {},
							yes: "Let's Ping Gop!",
							no: "Hard Pass",
						});
					break;
				break;
			}
			});

			return () => unregister;
		}, []);

	return null;
}