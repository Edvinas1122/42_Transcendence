interface User {
	_id: string;
	name: string;
	avatar?: string;
	ImageLinks?: JSON;
	FullName: string;
	OriginJson?: JSON;
	isOnline: boolean;
	isInGame: boolean;
}

export default User;