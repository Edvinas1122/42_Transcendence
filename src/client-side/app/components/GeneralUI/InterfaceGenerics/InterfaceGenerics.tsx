import React, { MouseEvent, useState } from 'react';

interface FormField {
	name: string;
	type: string;
	value: string;
	onChange: (event: MouseEvent<HTMLInputElement>) => void;
}

interface InterfaceUnitProps {
	name: string;
	dependency?: (item: any) => boolean;
}

interface ButtonProps extends InterfaceUnitProps {
	onClick: (event: MouseEvent<HTMLButtonElement>) => Promise<boolean>;
}

interface FormProps {
    name: string,
    fields: any[],
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<boolean>,
    dependency?: (item: any) => boolean,
}

interface ToggleUnitProps {
    unitA: any,
    unitB: any,
    item: any,
    onSubmit: (event: React.MouseEvent<HTMLButtonElement>) => Promise<boolean>,
}

const Button = ({ name, onClick, dependency }: ButtonProps) => {
	return (
		<button onClick={onClick}>{name}</button>
	);
}

const Form = ({ name, fields, onSubmit, dependency }: FormProps) => {
	return (
        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();  // Prevent page refresh
            onSubmit(e);
        }}>
			{fields.map((field, index) => {
			return (
				<div key={index}>
				<label htmlFor={field.name}>{field.name}</label>
				<input
					type={field.type}
					name={field.name}
					value={field.value}
					onChange={field.onChange}
				/>
				</div>
			);
			})}
			<button type="submit">{name}</button>
		</form>
	);
}

const ToggleUnit: Function = ({ unitA, unitB, item, onSubmit }: ToggleUnitProps) => {
    const [activeUnit, setActiveUnit] = useState(unitA);
    const handleOnClick = async (event: React.MouseEvent<HTMLButtonElement>) => {

    try {
        const result = await onSubmit(event);
        if (result) {
            setActiveUnit(activeUnit === unitA ? unitB : unitA);
        }
    } catch (error) {
        console.log(error);
    }
    }

    return activeUnit;
}

export type { ButtonProps, FormProps, ToggleUnitProps, FormField, InterfaceUnitProps };
export { Button, Form, ToggleUnit};