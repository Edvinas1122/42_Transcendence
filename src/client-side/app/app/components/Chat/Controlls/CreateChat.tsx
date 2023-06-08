import React, { useState, useEffect } from 'react';
import fetchWithToken from '@/app/network/fetchWithToken';

const CreateChat = () => {
	const [name, setName] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);
	const [password, setPassword] = useState("");
  
	const handleSubmit = (e) => {
	  e.preventDefault();
	  const chatData = { name, private: isPrivate, password };
  
	  fetchWithToken('/chat/create', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify(chatData),
	  })
	  .then(response => response.json())
	  .then(data => {
		console.log('Chat successfully created:', data);
		setName("");  // Reset name
		setIsPrivate(false);  // Reset private status
		setPassword("");  // Reset password
	  })
	  .catch((error) => {
		console.error('Error:', error);
	  });
	}
  
	return (
	  <div>
		<h2>Create Chat</h2>
		<form onSubmit={handleSubmit}>
		  <label>
			Name:
			<input type="text" value={name} onChange={e => setName(e.target.value)} required />
		  </label>
		  <label>
			Private:
			<input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} />
		  </label>
		  <label>
			Password:
			<input type="password" value={password} onChange={e => setPassword(e.target.value)} required={isPrivate} />
		  </label>
		  <input type="submit" value="Submit" />
		</form>
	  </div>
	);
  }
  
  export default CreateChat;