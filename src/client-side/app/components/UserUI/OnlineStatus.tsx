"use client";

import React, { useState, useEffect, useContext, useCallback } from "react";
import { serverFetch } from "@/lib/fetch.util";

interface OnlineStatusResponse {
	status: 'online' | 'offline' | 'InGame';
}

interface OnlineStatusProps {
    id: number;
}

export const OnlineStatus: React.FC<OnlineStatusProps> = ({id}) => {
    const [online, setOnline] = useState<string>("loading...");

	console.log("user id: ", id);
    const checkOnline = useCallback(async () => {
        const response = await serverFetch<OnlineStatusResponse>(
            `/online-status/${id}`,
            "GET",
            { 'Content-Type': 'application/json' },
        );
        setOnline(response.status);
    }, [id]);

    useEffect(() => {
        checkOnline();
    }, [checkOnline]);

    return (
        <div className="status">
            <p>
                Status: {online}
            </p>
        </div>
    );
}