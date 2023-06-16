import FriendsAndUsers from "@/app/components/FriendsAndUsers/FriendsAndUsers";

export default function FriendsLayout({
	children,
}: {
	children: React.ReactNode
})
{
	return (
		<section>
			<FriendsAndUsers />
			{children}
		</section>
	);
}