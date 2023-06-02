import { WSMessage } from '../message.type';
import { NotificationInfo, NotificationDisplay } from '../notifications/notifications';

const image = "/logo_sample.svg";

export const RelationshipHandler = async (message: WSMessage) => {
	let info: NotificationInfo = { message: "" };

	info.image = `${process.env.NEXT_PUBLIC_FRONTEND_API_BASE_URL}` + image;
	info.body = "You are gay";
	console.log(info.image);
	if (message.info.event === 'PENDING') {
		info.message = "New friend request!";
		NotificationDisplay(info);
	}
	else if (message.info.event === 'APPROVED')
	{
		info.message = "Friend request accepted!";
	}
	if (info.message !== "")
		NotificationDisplay(info);
}