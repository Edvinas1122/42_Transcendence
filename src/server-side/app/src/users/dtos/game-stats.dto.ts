export interface MachHistory {
	_id: string;
	opeonent: string;
	userScore: number;
	oponentScore: number;
	created: Date;
	completed: boolean;
}

export interface Achievement {
	_id: string;
	name: string;
	description: string;
	achievedOn: Date;
}