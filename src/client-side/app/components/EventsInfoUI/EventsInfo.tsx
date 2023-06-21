"use client";

import { ReactNotifications, Store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

class NotificationDisplay {
	constructor(title: string, message: string, duration?: number, type?: "success" | "danger" | "info" | "default" | "warning") {
		this.title = title;
		this.message = message;
		this.type = type ? type : "success";
		this.insert = "top";
		this.container = "top-right";
		this.animationIn = ["animate__animated", "animate__fadeIn"];
		this.animationOut = ["animate__animated", "animate__fadeOut"];
		this.dismiss = {
			duration: duration ? duration : 5000,
			onScreen: true
		};
	}
	title: string;
	message: string;
	type: "success" | "danger" | "info" | "default" | "warning";
	insert: "top" | "bottom";
	container: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	animationIn: string[];
	animationOut: string[];
	dismiss: {
		duration: number;
		onScreen: boolean;
	};
}

const DisplayPopUp: Function = (title: string, message: string, duration?: number, type?: "success"): void => {
	const info = new NotificationDisplay(title, message, duration, type);
	Store.addNotification(info);
}

const DisplayComponent = () => {
	return (
		<ReactNotifications />
	);
}

export default DisplayPopUp;
export { NotificationDisplay, DisplayComponent };