import MachMakingUI from "@/components/MachMakingUI/MachMakingUI";
import { Oxanium } from 'next/font/google';

const oxanium = Oxanium({ 
	subsets: ['latin'],
})

const MachMakingPage: Function = () => {
	return (
		<div className={"Display"}>	
			<MachMakingUI/>
		</div>
	);
}

export default MachMakingPage;