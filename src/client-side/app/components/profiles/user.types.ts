interface User {
	_id: string;
	name: string;
	avatar: string;
	ImageLinks?: JSON;
	FullName: string;
	OriginJson?: JSON;
}

export default User;