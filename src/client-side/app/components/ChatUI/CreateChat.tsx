"use client";
import { CreateChatRequest } from '@/lib/DTO/PostData';
import React, { useContext } from 'react';
// import fetchWithToken from '@/lib/fetch.util';
import { AuthorizedFetchContext } from '../ContextProviders/authContext';
import "./Chat.css"


const CreateChatBox = () => {

	const { fetchWithToken, loading } = useContext(AuthorizedFetchContext);
	const [name, setName] = React.useState('');
	const [isPrivate, setPrivate] = React.useState(false);
	const [password, setPassword] = React.useState('');
	
	const CreateChat = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const chatData: CreateChatRequest = {
			name: name,
			isPrivate: isPrivate,
			password: password
		};

		const response = await fetchWithToken('/chat/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(chatData),
		});

		const data = await response.json();
		console.log('Chat successfully created:', data);
	}

	return (
		<div>
			<h2>Create Chat</h2>
			<form onSubmit={CreateChat}>
				<label>
					Name:
					<input type="text" name="name" required value={name} onChange={e => setName(e.target.value)} />
				</label>
				<label>
					Private:
					<input type="checkbox" name="private" checked={isPrivate} onChange={e => setPrivate(e.target.checked)} />
				</label>
				<label>
					Password:
					<input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
				</label>
				<input type="submit" value="Submit" />
			</form>
		</div>
	);
};

export default CreateChatBox;