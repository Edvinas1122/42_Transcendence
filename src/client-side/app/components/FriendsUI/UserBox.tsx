"use client";	
import React from "react";
import { User } from "@/lib/DTO/AppData";

interface UserBoxProps {
	item: User,
	childnode: React.ReactNode
}

const UserBox: React.FC<UserBoxProps> = ({ item, childnode }: UserBoxProps) => {
	return (
	  <>
		<p>
		  <strong>{item.name}</strong>
		  <span>{item.name}</span>
		</p>
		  <div className="status"></div>
		{childnode}
	  </>
	);
}

export type { UserBoxProps};
export default UserBox;