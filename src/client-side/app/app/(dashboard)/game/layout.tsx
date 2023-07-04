import { WebSocketProvider } from "@/components/MachMakingUI/GameDataProvider";
import { ReactNode } from "react";

export default function GameLayout({
	children
}: {
	children: ReactNode
}){
	return (
		<section>
			<WebSocketProvider>
			{children}
			</WebSocketProvider>
		</section>
	);
}
