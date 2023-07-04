import PongGame from "@/components/Pong/Pong";

const GameInstance: Function = ({
	params
}: {
	params: { id: string }
}) => {
	return (
		<div>
			<PongGame />
		</div>
	);
}

export default GameInstance;