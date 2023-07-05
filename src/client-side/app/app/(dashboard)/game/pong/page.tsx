import PongGame from "@/components/Pong/Pong";
import { Oxanium } from 'next/font/google';

const oxanium = Oxanium({ 
	subsets: ['latin'],
})

const GameInstance: Function = ({
	params
}: {
	params: { id: string }
}) => {
	return (
		<div className={oxanium.className}>
			<PongGame />
		</div>
	);
}

export default GameInstance;