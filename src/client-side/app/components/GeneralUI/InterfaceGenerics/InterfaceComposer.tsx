import React, { useState,  MouseEvent } from 'react';
import { ToggleUnit, Button, Form, FormProps, ButtonProps, ToggleUnitProps } from './InterfaceGenerics';


export const EntityInterfaceBuilder = () => {
	let buttons: ButtonProps[] = [];
	let forms: FormProps[] = [];
	let toggleUnits: ToggleUnitProps[] = [];

	const addRemoveButton = (props: ButtonProps) => {
		buttons = [...buttons, props];
		return builder;
	}

	const addInteractButton = (props: ButtonProps) => {
		console.log("addInteractButton", props);
		buttons = [...buttons, props];
		return builder;
	}

	const addForm = (props: FormProps) => {
		forms = [...forms, props];
		return builder;
	}

	const addToggleUnit = (props: ToggleUnitProps) => {
		toggleUnits = [...toggleUnits, props];
		return builder;
	}

	const build = () => {
		return {
			buttons,
			forms,
			toggleUnits,
		};
	}

	const builder = { addRemoveButton, addInteractButton, addForm, addToggleUnit, build };
	return builder;
}

export type { ButtonProps, FormProps, ToggleUnitProps };
export { ToggleUnit, Button, Form};