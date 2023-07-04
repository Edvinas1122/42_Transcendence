"use client";
import React, { useState } from 'react';

interface GameKeyContextData {
	gameKey: string | null;
	setGameKey: (gameKey: string | null) => void; // a function that accepts a string or null
}

export const GameKeyContext = React.createContext<GameKeyContextData | undefined>(undefined);

interface GameKeyProviderProps {
	children: React.ReactNode;
}

export const GameKeyProvider: React.FC<GameKeyProviderProps> = (
	{children}
) => {
	const [gameKey, setGameKey] = useState<string | null>(null); 

	return (
		<GameKeyContext.Provider value={{ gameKey, setGameKey }} >
			{children}
		</GameKeyContext.Provider>
	);
};

export const useGameKey = (): GameKeyContextData => {
	const context = React.useContext(GameKeyContext);
	if (context === undefined) {
		throw new Error('useGameKey must be used within a GameKeyProvider');
	}
	return context;
};

export const setGameKey = (gameKey: string | null): void => {
	const context = React.useContext(GameKeyContext);
	if (context === undefined) {
		throw new Error('setGameKey must be used within a GameKeyProvider');
	}
	context.setGameKey(gameKey);
}