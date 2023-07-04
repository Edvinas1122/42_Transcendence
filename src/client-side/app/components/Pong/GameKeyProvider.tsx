"use client";
import React, { useState } from 'react';

interface GameKeyContextData {
	gameKey: string | null;
	setGameKey: (gameKey: string | null) => void; // a function that accepts a string or null
}

export const GameKeyContext = React.createContext<GameKeyContextData>({
	gameKey: null,
	setGameKey: () => {}, // Add a default function
});

interface GameKeyProviderProps {
	children: React.ReactNode;
}

export const GameKeyProvider: React.FC<GameKeyProviderProps> = (
	{children}
) => {
	const [gameKey, setGameKey] = useState<string | null>(null); 

	return (
		<GameKeyContext.Provider 
			value={{ 
				gameKey,
				setGameKey 
			}}
			>
			{children}
		</GameKeyContext.Provider>
	);
};