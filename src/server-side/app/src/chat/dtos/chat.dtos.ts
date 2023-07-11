import { IsArray, IsBoolean, Length, IsInt, IsOptional, IsEnum, IsString, MinLength, ArrayMinSize, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { RoleType } from '../entities/role.entity';
import { IsShortField, IsLongField } from '../../utils/formFields.decorator';

export class RecipientParam {
	@IsString()
	@Length(1, 20)
	recipient: string;
  }

export class CreateChatDto {
	@IsString()
	@IsShortField({message: 'Name too long'})
	@MinLength(1)
	name: string;

	@IsBoolean()
	isPrivate: boolean;

	@IsOptional()
	@IsInt()
	ownerID?: number;

	@IsOptional()
	@IsString()
	@IsShortField({message: 'Password too Long'})
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

export class UpdateChatDto {
	@IsString()
	@IsOptional()
	@IsShortField()
	password: string | undefined;
}

export class JoinChatDto {
	@IsString()
	@IsOptional()
	@IsShortField()
	password?: string;
  }
export class SendMessageDto {
	@IsString()
	@IsLongField({message: 'Message too long'})
	content: string;
  
	@IsString()
	@IsOptional()
	@IsShortField({message: 'Password too long'})
	password?: string | null;
}

export class DeleteMessageDto {
	@IsNumber()
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
		this.amParticipant = true;
		this.type = "personal";
		this.personal = true;
	}
	participant: UserInfo;
}

interface ChatGroup {
	chat: Chat;
	owner: UserInfo;
	privileged?: boolean;
	mine?: boolean;
	participants?: UserInfo[];
	messages?: MessageDto[];
	type?: "group";
	amParticipant?: boolean;
	kickedId?: number; // single case
	pritvate?: boolean;
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
		this.passwordProtected = (props.chat.password !== "" && props.chat.password !== null);
		this.kickedId = props.kickedId;
		this.isPrivate = props.chat.private;
	}
	owner: UserInfo;
	participants: UserInfo[];
	privileged: boolean;
	mine?: boolean;
	amParticipant?: boolean;
	type?: "group";
	passwordProtected: boolean;
	kickedId?: number;
	isPrivate?: boolean;
}
