import { Message } from "@/lib/DTO/AppData";

interface MessageListProps {
	messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
    return (
        <div>
            {messages && messages.map((message) => (
                <MessageBox key={message._id} message={message} />
            ))}
        </div>
    );
}

const MessageBox = ({ message }: { message: Message }) => {
	return (
		<div>
			<p>{message.content}</p>
		</div>
	);
}

export default MessageList;