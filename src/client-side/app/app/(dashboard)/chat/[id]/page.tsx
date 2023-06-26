import "@/public/layout.css"
import MessangerUI from "@/components/ChatUI/MessangerUI";


const ChatDisplay: Function = ({ params }: { params: { id: string } }) => {

	return (
		<MessangerUI params={params}/>
	);
};
  
export default ChatDisplay;