export interface NotificationInfo {
	message: string;
	image?: string;
	body?: string;
}

export const NotificationDisplay = async (notification: NotificationInfo) =>
{
	if (!("Notification" in window)) {
		console.log("This browser does not support system notifications");
	} else if (Notification.permission === "granted") {
		new Notification(notification.message, {icon: notification.image, body: notification.body});
	} else if (Notification.permission !== "denied") {
		Notification.requestPermission().then(function (permission) {
			if (permission === "granted") {
				new Notification(notification.message, {icon: notification.image, body: notification.body});
			}
		});
	}
}