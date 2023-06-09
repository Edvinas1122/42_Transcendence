import { RoleType } from '../roles/role.dto';
import { MachHistory, Achievement } from '../machines/machine.dto';

export interface User {
	_id: string;
	name: string;
	avatar: string;
	Online: boolean;
	Ingame: boolean;
	MachHistory: MachHistory[];
	Achievements: Achievement[];
	friend?: boolean;
}

export interface User_small {
	_id: string;
	name: string;
	avatar: string;
	Online: boolean;
	Ingame: boolean;
	Role?: RoleType;
}