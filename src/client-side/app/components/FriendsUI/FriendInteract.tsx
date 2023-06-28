"use client";
import GenericButton from "../GeneralUI/GenericButton";
import Link from "next/link";
import { User } from "@/lib/DTO/AppData";

const acceptButtonStyle: React.CSSProperties = {
	border: 'none',  /* Remove borders */
	textAlign: 'center', /* Centered text */
	textDecoration: 'none', /* Remove underline */
	cursor: 'pointer', /* Add a mouse pointer on hover */
    padding: '5px',
};

const FriendRequestBoxBase: Function = ({item}: {item: User}) => {
	return (
		<div className="Entity">
			<p>
				<strong>{item.name}</strong>
			</p>
			<GenericButton
			text="Accept"
			type="button"
			endpoint={`/users/manage/approve-friend-request/${item._id}`} />
			<GenericButton
			text="Reject"
			type="button"
			endpoint={`/users/manage/reject-friend-request/${item._id}`} />
		</div>
	);
}

export const FriendRequestBox: Function = ({item}: {item: User}) => {
	return (
		<Link href={`/user/${item._id}`}>
			<FriendRequestBoxBase item={item} />
		</Link>
	);
}

export const BlockedUserBox: Function = ({item}: {item: User}) => {
    return (
        <div className="Entity">
			<p>
				<strong>{item.name}</strong>
			</p>
			<GenericButton
			text="Unblock"
			type="button"
			endpoint={`/users/manage/unblock-user/${item._id}`} />
		</div>
    );
}