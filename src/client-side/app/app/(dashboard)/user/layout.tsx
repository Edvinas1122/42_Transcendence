import "@/public/layout.css";

export default function UserLayout({
	children,
}: {
	children: React.ReactNode
})
{
	return (
		<section className="Display">
			{children}
		</section>
	);
}