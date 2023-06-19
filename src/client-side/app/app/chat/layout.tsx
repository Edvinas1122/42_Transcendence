import "@/public/layout.css";
import ChatUI from "./ChatUI";

export default function	ChatsLayout({
	children,
}: {
	children: React.ReactNode
})
{
	return (
		<section>
			<div className="LeftSection">
				<ChatUI />
			</div>
			<div className="MainSection">
				{children}
			</div>
		</section>
	);
}