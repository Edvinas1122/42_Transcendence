import { IsArray, IsBoolean, IsInt, IsOptional, IsEnum, IsString, MinLength, ArrayMinSize, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { RoleType } from '../entities/role.entity';


export class CreateChatDto {
	@IsString()
	@MinLength(1)
	name: string;

	@IsBoolean()
	isPrivate: boolean;

	@IsOptional()
	@IsInt()
	ownerID?: number;

	@IsOptional()
	@IsString()
	password?: string;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => Number)
	invitedUsersID?: number[];
}

export class ChatIdDto {
	chatId: number;
}

export class UpdateChatDto extends CreateChatDto {
	id: number;
}

export class JoinChatDto {
	@IsString()
	@IsOptional()
	chatPassword?: string;
  }
export class SendMessageDto {
	@IsString()
	content: string;
  
	@IsString()
	@IsOptional()
	password?: string | null;
}

export class DeleteMessageDto {
	messageId: number;
}

export class EditRoleDto {
	@IsEnum(RoleType)
	newRole: RoleType;
}

import { UserInfo } from '../../users/dtos/user.dto';
import { MessageDto } from './message.dtos';
import { Chat } from '../entities/chat.entity';

export class ChatDto {
	constructor(chat: Chat, pesonal: boolean, messages?: MessageDto[], amParticipant?: boolean) {
		this._id = chat.id;
		this.name = chat.name;
		// set a default empty array or set the messages directly if you have them at this point
		this.messages = messages || [];
	}

	_id: number;
	name: string;
	messages: MessageDto[];
	personal: boolean;
	amParticipant?: boolean;
	type?: "group" | "personal";
}

export class PersonalChatDto extends ChatDto {
	constructor(chat: Chat, participant: UserInfo, messages?: MessageDto[]) {
		super(chat, true, messages);
		this.participant = participant || null; // Assuming you can pass the participant during construction
		this.amParticipant
	}
	participant: UserInfo;
}

interface ChatGroup {
	chat: Chat;
	owner: UserInfo;
	privileged: boolean;
	mine?: boolean;
	participants?: UserInfo[];
	messages?: MessageDto[];
	type?: "group";
	amParticipant: boolean;
}

export class GroupChatDto extends ChatDto {
	constructor(props: ChatGroup) {
		super(props.chat, false, props.messages, props.amParticipant);
		this.owner = props.owner || null; // Assuming you can pass the owner during construction
		this.participants = props.participants || []; // Assuming you can pass the participants during construction
		this.privileged = props.privileged || false; // Assuming you can pass the privileged status during construction
		this.type = "group";
		this.mine = props.mine || false;
		this.amParticipant = props.amParticipant || false;
	}
	owner: UserInfo;
	participants: UserInfo[];
	privileged: boolean;
	passwordProtected: boolean;
	mine?: boolean;
	amParticipant?: boolean;
	type?: "group";
}
