import { WebSocketProvider } from "@/components/MachMakingUI/GameDataProvider";
import { GameKeyProvider } from "@/components/Pong/GameKeyProvider";
import { ReactNode } from "react";

export default function GameLayout({
	children
}: {
	children: ReactNode
}){
	return (
		<section>
			<WebSocketProvider>
				<GameKeyProvider>
				{children}
				</GameKeyProvider>
			</WebSocketProvider>
		</section>
	);
}
