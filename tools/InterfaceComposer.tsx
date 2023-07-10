import React, { useState,  MouseEvent } from 'react';
import { serverFetch } from '@/lib/fetch.util';

interface FormField {
	name: string;
	type: string;
	value: string;
	onChange: (event: MouseEvent<HTMLInputElement>) => void;
}

interface ButtonConfig {
    name: string,
	endpointTemplate: string,
	type: "simple" | "grayout" | "delete",
	displayDependency: (item: any) => boolean,
	fields?: FormField[],
}

const Button = ({ name, onClick }: { name: string, onClick: () => void }) => {
	return <button onClick={onClick}>{name}</button>;
};

export class InterfaceUnit {
	private name: string;
	private endpoint: string;
	private method: "POST" | "DELETE";
	private key: number;

	constructor(key: number, name: string, endpointTemplate: string, item: any, type: "simple" | "grayout" | "delete") {
		this.name = name;
		this.key = key;
		this.endpoint = endpointTemplate.replace("{item._id}", item._id);
		this.method = this.getMethod(type);
	}
	
	build = () => {
		const onClickFunction = this.composeOnClickFunction();
		return (
			<>
				<Button key={this.key} name={this.name} onClick={onClickFunction} />;
			</>
		)
	}

	private composeOnClickFunction = () => {
		return async (item: any, event: MouseEvent<HTMLButtonElement>) => {
			event.preventDefault();
			const response = await serverFetch(
				this.endpoint, 
				this.method);
			return response;
		};
	}

	private getMethod = (type: "simple" | "grayout" | "delete") => {
		switch(type) {
			case "simple":
				return "POST";
			case "grayout":
				return "POST";
			case "delete":
				return "DELETE";
		}
	}
}

export const EntityInterfaceBuilder = () => {
	let buttonConfigs: ButtonConfig[] = [];
	// let toggleUnits: ToggleUnitProps[] = [];

	const getButtons = (item: any): InterfaceUnit[] => {
		return buttonConfigs.map((button, index) => {
			return new
				InterfaceUnit(
					index,
					button.name,
					button.endpointTemplate,
					item,
					button.type
				),
			};
		);
	}

	const addButton = (props: ButtonConfig) => {
		buttonConfigs = [...buttonConfigs, props];
		return builder;
	}

	const build = () => {
		return {
			buttonConfigs,
			// forms,
			// toggleUnits,
		};
	}

	const builder = { addButton, build };
	return builder;
}

