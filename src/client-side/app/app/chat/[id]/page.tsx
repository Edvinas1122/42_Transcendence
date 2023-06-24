import "@/public/layout.css"
import MessangerUI from "@/components/ChatUI/MessangerUI";


const ChatDisplay: Function = async ({ params }: { params: { id: string } }) => {

	return (
		<MessangerUI params={params}/>
	);
};
  
export default ChatDisplay;