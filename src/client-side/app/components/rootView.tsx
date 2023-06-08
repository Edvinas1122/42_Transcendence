"use client";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

interface MachHistory {
	_id: string;
	opeonent: string;
	userScore: number;
	oponentScore: number;
	created: Date;
	completed: boolean;
}

interface Achievement {
	_id: string;
	name: string;
	description: string;
	achievedOn: Date;
}

interface User {
	_id: string;
	name: string;
	avatar: string;
	Online: boolean;
	Ingame: boolean;
	MachHistory: MachHistory[];
	Achievements: Achievement[];
	friend?: boolean;
}

interface AppData {
	user: User;
}

const dataExample : AppData = {
	user: {
		_id: "1234567890",
		name: "John Doe",
		avatar: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
		Online: true,
		Ingame: false,
		MachHistory: [],
		Achievements: [],
	}
}

const View1 = ({ user }) => <div>View 1: Hello {user.name}</div>
const View2 = ({ user }) => <div>View 2: Hello again {user.name}</div>
const View3 = ({ user }) => <div>View 3: Bye {user.name}</div>

const RootUI = () => {

	const [data, setData] = React.useState<AppData>(dataExample);

	return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li><Link to="/view1">View 1</Link></li>
                        <li><Link to="/view2">View 2</Link></li>
                        <li><Link to="/view3">View 3</Link></li>
                    </ul>
                </nav>
                
                <Routes>
					<Route path="/" element={} />
                    <Route path="/view1" element={<View1 user={data.user} />} />
                    <Route path="/view2" element={<View2 user={data.user} />} />
                    <Route path="/view3" element={<View3 user={data.user} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default RootUI;
export { AppData, User, MachHistory, Achievement};