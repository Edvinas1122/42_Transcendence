"use client";
import React, { useState } from 'react';
// import { Link } from 'next/link';
import Image from 'next/image';
import { User } from '@/app/dtos/AppData';

// add child for styling user list 
// Don't display user in list 

const UserList = ({users}: {users: User[]} ) => {
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('rank');

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(e.target.value);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSort(e.target.value);
    };

    const filteredUsers = filterUsers(users, filter);
    const sortedUsers = sortUsers(filteredUsers, sort);

    return (
        <div className="user-list">
            <h2>User List</h2>
            <div className="menus">
                <label>Filter:</label>
                <select value={filter} onChange={handleFilterChange}>
                    <option value="all">All</option>
                    <option value="online">Online</option>
                    <option value="friends">Friends</option>
                </select>
                <label>Sort:</label>
                <select value={sort} onChange={handleSortChange}>
                <option value="alphabetical">Alphabetical</option>
                </select>
            </div>
            {sortedUsers.length <= 0 && <p>No users available</p>}
            {sortedUsers.map((user) => (
                <div key={user._id}>
                    {/* <img src={user.avatar} width="50" height="50"/> */}
                    <h1>{user.name}</h1>
                    {/* <Link to={`/users/${user._id}`}>View Profile</Link> */}
                </div>
            ))}
        </div>
    );
};

export default UserList;

//helper functions for sort/filter

const filterUsers = (users: User[], filter: string) => {
    switch (filter) {
        case 'all':
            return users;
        case 'online':
            return users.filter((user) => user.Online);
        case 'friends': 
            return users.filter((user) => user.friend);
        default:
            return users;
    }
};

const sortUsers = (users: User[], sort: string) => {
    switch (sort) {
        case 'alphabetical':
            return users.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return users;
    }
};