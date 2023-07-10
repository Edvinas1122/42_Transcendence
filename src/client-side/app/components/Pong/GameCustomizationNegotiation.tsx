import WebSocketContex from '../MachMakingUI/GameDataProvider';
import React, { useEffect, useContext, useState } from 'react';
import "./Pong.css";

interface gameCustomizationRequest {
	winCondition: 'score' | 'time',
	winConditionValue: number,
	ballType: 'simple' | 'speedy' | 'bouncy',
}

interface RadioGroupProps {
	name: string;
	title: string;
	options: string[];
	selected: string;
	setSelected: (value: string) => void;
}
  
const RadioGroup: React.FC<RadioGroupProps> = ({ name, title, options, selected, setSelected }) => (
	<div className={`Field`}>
	<div className={`gameCustomizationNegotiation__${name}__title`}>{title}</div>
		<div className={`Options`}>
			{options.map((option) => (
			<div className={`Option`} key={option}>
				<input
				type="radio"
				name={name}
				value={option}
				checked={selected === option}
				onChange={() => setSelected(option)}
				/>
				<label>{option.charAt(0).toUpperCase() + option.slice(1)}</label>
			</div>
			))}
		</div>
	</div>
);

const config = [
	{
		name: 'winCondition',
		title: 'Win Condition',
		options: ['score', 'time'],
		stateVariable: 'winCondition',
	},
	{
		name: 'ballType',
		title: 'Ball Type',
		options: ['simple', 'speedy', 'bouncy'],
		stateVariable: 'ballType',
	},
];

interface NumericRadioGroupProps {
	name: string;
	title: string;
	options: number[];
	selected: number;
	setSelected: (value: number) => void;
}

  
const NumericRadioGroup: React.FC<NumericRadioGroupProps> = ({ name, title, options, selected, setSelected }) => (
	<div className={`Field`}>
	<div className={`gameCustomizationNegotiation__${name}__title`}>{title}</div>
		<div className={`Options`}>
			{options.map((option) => (
			<div className={`Option`} key={option}>
				<input
				type="radio"
				name={name}
				value={option}
				checked={selected === option}
				onChange={() => setSelected(option)}
				/>
				<label>{option}</label> {/* Directly use option as a label */}
			</div>
			))}
		</div>
	</div>
);

const numericToggles = [
	{
		name: 'timeConditionDuration',
		title: 'Time Condition Duration',
		options: [1, 2, 3, 4, 5],
		stateVariable: 'winConditionValue',
	},
	{
		name: 'scoreConditionScore',
		title: 'Score Condition Score',
		options: [3, 5, 10, 15, 20],
		stateVariable: 'winConditionValue',
	},
];

interface GameCustomizationNegotiationProps {
	startGame: (gameCustomizationRequest: gameCustomizationRequest) => void;
}

const GameCustomizationNegotiation: React.FC<GameCustomizationNegotiationProps> = ({ 
	startGame
}) => {
	const [winCondition, setWinCondition] = useState<'score' | 'time'>('score');
	const [ballType, setBallType] = useState<'simple' | 'speedy' | 'bouncy'>('simple');
	const [winConditionValue, setWinConditionValue] = useState<number>(3);

	const stateVariables = {
		winCondition: [winCondition, setWinCondition],
		ballType: [ballType, setBallType],
		winConditionValue: [winConditionValue, setWinConditionValue],
	};

	const handleStartGame = () => {
		startGame({ winCondition, ballType, winConditionValue });
		console.log("Game has started with settings:", { winCondition, ballType, winConditionValue });
	};

	return (
		<div className="Negotiation">
			<div className="gameCustomizationNegotiation">
				{config.map(({ name, title, options, stateVariable }) => (
				<RadioGroup
					key={name}
					name={name}
					title={title}
					options={options}
					selected={(stateVariables as any)[stateVariable][0]}
					setSelected={(stateVariables as any)[stateVariable][1]}
				/>
				))}
			{winCondition === 'score' && (
				<NumericRadioGroup
				name="scoreConditionScore"
				title="Score Condition Score"
				options={numericToggles[1].options}
				selected={winConditionValue}
				setSelected={setWinConditionValue}
				/>
			)}
			{winCondition === 'time' && (
				<NumericRadioGroup
				name="timeConditionDuration"
				title="Time Condition Duration"
				options={numericToggles[0].options}
				selected={winConditionValue}
				setSelected={setWinConditionValue}
				/>
			)}
		<button onClick={handleStartGame}>Start Pong Gop!</button>
	  </div>
	  </div>
	);
};

export default GameCustomizationNegotiation;