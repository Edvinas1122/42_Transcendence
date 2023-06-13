"use client";

import { User } from '@/app/dtos/AppData';
import React, { useState, useEffect } from 'react';
import FriendRequests from './PendingFriendRequests/FriendRequests';

/**
 * Plan: 
 * Friend Requests
 *  - recieved (accept/deny)
 * 
 * User List
 *  - list 
 *      - sorted by
 *      - send request
 * 
 * Blocked users 
 *   - unblock
 */

const FriendsAndUsers = () => {

    return (
        <div>
            <FriendRequests />
        </div>
    );
};

export default FriendsAndUsers;