// "use client";
// import UIClientListBox, { EntityInterfaceBuilder } from "@/components/GeneralUI/GenericClientList";
// import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
// import "@/public/layout.css";
// import { serverFetch } from "@/lib/fetch.util";
// import { useRouter } from 'next/navigation';
// import { User } from "@/lib/DTO/AppData";

// // TESTING

// const FriendRequestBox: Function = ({ item, style }: { item: User, style?: string }) => {
//     const router = useRouter();
//     const openUserProfile = () => router.replace(`/user/${item._id}`);
// 	return (
// 		<div onClick={openUserProfile} style={{ cursor: 'pointer' }}>
// 			<p>
// 				<strong>{item.name}</strong>
// 			</p>
// 		</div>
// 	);
// }

// const FriendRequestsLive: Function = ({ requests }: { requests: User[] }) => {
//     const approveFriendRequest = (user: User) => {
//         serverFetch(`/users/manage/approve-friend-request/${user._id}`);
//     }
    
// 	const rejectFriendRequest = (user: User) => {
//         serverFetch(`/users/manage/reject-friend-request/${user._id}`);
//     }

// 	const FriendRequestInterface = new EntityInterfaceBuilder()
// 		.addRemoveButton("Approve", approveFriendRequest)
//         .addRemoveButton("Reject", rejectFriendRequest)
// 		.build();
    
// 	return (
// 		<UIClientListBox
// 			initialItems={requests}
// 			BoxComponent={FriendRequestBox}
// 			ListStyle="AvailableChats"
// 			entityInterface={FriendRequestInterface}
// 		/>
// 	);
// }

// export default FriendRequestsLive;