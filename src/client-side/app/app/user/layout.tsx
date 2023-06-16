export default function UserLayout({
	children,
}: {
	children: React.ReactNode
})
{
	return (
		<section>
			<h1>UserPage</h1>
			{children}
		</section>
	);
}