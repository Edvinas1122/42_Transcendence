import { Message } from "@/lib/DTO/AppData";
import "@/public/layout.css";
import "./Chat.css";

interface MessageListProps {
    messages: Message[];
}

const MessageBox = ({ message }: { message: Message }) => {

    const messageClass = message.myMessage ? 'Message user' : 'Message';
    const messageSpace = "MessageSpace";

    return (
        <div className="MessageArea">
            <div className={messageSpace}></div>
            <div className={messageClass}>
                <p>{message.content}</p>
            </div>
            <div className={messageSpace}></div>
        </div>
    );
}

const MessageList = ({ messages }: MessageListProps) => {
    return (
        <div className="List MessageList">
            {messages && messages.map((message) => (
                <MessageBox key={message._id} message={message} />
            ))}
        </div>
    );
}

export default MessageList;