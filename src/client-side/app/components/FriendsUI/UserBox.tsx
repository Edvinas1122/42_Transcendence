"use client";	
import React from "react";
import { User } from "@/lib/DTO/AppData";
import { UserInfoBox } from "@/components/UserUI/UserProfileUI";

interface UserBoxProps {
	item?: User,
	childnode: React.ReactNode
}

const UserBox: React.FC<UserBoxProps> = ({
	item,
	childnode
}: UserBoxProps) => {

	return (
	  <>
		<UserInfoBox
		  user={item}
		  scale={70}
		/>
		{/* {item?.name} */}
		  <div className="status"></div>
		{childnode}
	  </>
	);
}

export type { UserBoxProps};
export default UserBox;