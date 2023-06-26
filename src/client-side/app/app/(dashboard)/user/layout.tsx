import "@/public/layout.css";

export default function UserLayout({
	children,
}: {
	children: React.ReactNode
})
{
	return (
		<section className="Display">
			<h1>UserPage</h1>
			{children}
		</section>
	);
}