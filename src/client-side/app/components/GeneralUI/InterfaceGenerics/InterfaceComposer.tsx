import React, { useState, useEffect, MouseEvent } from 'react';
import { serverFetch } from '@/lib/fetch.util';
import { SpinnerLoaderSmall } from '../Loader';
import { ButtonConfig, ToggleUnit, ToggleButtonConf, EntityInterfaceBuilder, BehaviouralMap  } from './InterfaceComposer.lib';
import "@/public/layout.css";

const Button = ({
	name,
	onClick,
	state
}: {
	name: string,
	onClick: () => void
	state: "loading" | "idle" | "disabled" | "notVisible" | "error"
}) => {
	if (state === "loading")
		return <button className="waiting"><SpinnerLoaderSmall /></button>;
	else if (state === "disabled")
		return <button disabled>{name}</button>;
	else if (state === "notVisible") // not used
		return <></>;
	else if (state === "error")
		return <button className="waiting">Error...</button>;
	return <button onClick={onClick}>{name}</button>;
};

const InterfaceUnit = ({
	name,
	endpointTemplate,
	httpmethod,
	item,
	fields,
	callBackBehaviour,
	renderDependency
}: {
	name: string,
	endpointTemplate: string,
	httpmethod?: "POST" | "DELETE";
	item: any,
	fields?: FormField[],
	callBackBehaviour?: (item: any) => void,
	renderDependency?: (item: any) => boolean,
}) => {
	const endpoint = endpointTemplate.replace("${item._id}", item._id);

	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(true);
	const [error, setError] = useState(false);
	const [fieldValues, setFieldValues] = useState(
		fields?.reduce((acc, field) => ({...acc, [field.name]: field.value}), {}) || {}
	);
	const method = httpmethod || "POST";

    const onSubmitFunction = (event: React.FormEvent) => {
		event.preventDefault();
        onClickFunction();
	};

	useEffect(() => {
		if (renderDependency && !renderDependency(item))
			setVisible(false);
	}, [item]);


	const onClickFunction = () => {
		(async () => {
			setLoading(true);
			try {
				console.log("here is field values", fieldValues);
				const response = await serverFetch<Response>(endpoint, method);
				// assume success
				callBackBehaviour && callBackBehaviour(item);
				setLoading(false);
				return response;	
			} catch (error) {
				console.error(error);
				setLoading(false);
				setError(true);
			}
		})();
	};

	const onInputChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
		setFieldValues(prevState => ({...prevState, [name]: event.target.value}));
	};

	return (
		<>
		<Button
			name={name}
			onClick={onClickFunction}
			state={!visible ? "notVisible" : error? "error": loading ? "loading" : "idle"}
		/>
		<form onSubmit={onSubmitFunction}>
		{fields && fields.map((field, index) => (
			<input 
				key={index} 
				type={field.type || 'text'} 
				value={fieldValues[field.name] || ''} 
				onChange={onInputChange(field.name)} 
			/>
			))}
		</form>
		</>
	)
}

export const ToggleInterfaceUnit = ({ 
	key,
	unitOne, 
	unitTwo, 
	item,
	dependency
}: {
	key: number,
	unitOne: ToggleUnit,
	unitTwo: ToggleUnit,
	item: any,
	dependency: (item: any) => boolean
}) => {
	const [visibleUnit, setVisibleUnit] = useState(unitOne);
	const [hiddenUnit, setHiddenUnit] = useState(unitTwo);

	const toggleUnit = () => {
		setVisibleUnit(visibleUnit === unitOne ? unitTwo : unitOne);
		setHiddenUnit(hiddenUnit === unitTwo ? unitOne : unitTwo);
	}

	useEffect(() => {
		if (dependency(item)) {
			setVisibleUnit(unitOne);
			setHiddenUnit(unitTwo);
		} else {
			setVisibleUnit(unitTwo);
			setHiddenUnit(unitOne);
		}
	}, [item]);

	return (
		<>
			<InterfaceUnit
				key={key}
				name={visibleUnit.name}
				endpointTemplate={visibleUnit.endpointTemplate}
				item={item}
				fields={visibleUnit.fiedls}
				httpmethod={"POST"}
				callBackBehaviour={toggleUnit}
			/>
		</>
	);
};

export const EntityInterfaceBuilder: EntityInterfaceBuilder<T> = () => {
	let buttonConfigs: ButtonConfig[] = [];
	let toggleConfigs: ToggleDependency[] = [];

	const getButtons = (item: T, callBackBehaviourMap: BehaviouralMap): JSX.Element[] => {
		const regularButtons = buttonConfigs.map((button, index) => 
			<InterfaceUnit
				key={index}
				name={button.name}
				endpointTemplate={button.endpointTemplate}
				item={item}
				fields={button.fields}
				httpmethod={callBackBehaviourMap[button.type].method}
				callBackBehaviour={callBackBehaviourMap[button.type].sucessBehaviour}
				renderDependency={button.displayDependency}
			/>
		);

		const toggleButtons = toggleConfigs.map((toggle, index) => 
			<ToggleInterfaceUnit
				key={index}
				unitOne={toggle.unitOne}
				unitTwo={toggle.unitTwo}
				item={item}
				dependency={toggle.dependency}
			/>
		);

		return [...regularButtons, ...toggleButtons];
	}

	const addButton = (props: ButtonConfig) => {
		buttonConfigs = [...buttonConfigs, props];
		return builder;
	}

	const addToggleButton = (props: ToggleButtonConf) => {
		toggleConfigs = [...toggleConfigs, props];
		return builder;
	};

	const builder = { addButton, addToggleButton, getButtons };
	return builder;
}

export const EntityInterface = ({ 
		item,
		interfaceBuilder,
		removeItemFromList
	}: {
		item: any,
		interfaceBuilder: any,
		removeItemFromList: (item: any) => void
}) => {
	const [buttons, setButtons] = useState<JSX.Element[]>([]);

	const callBackBehaviourMap: BehaviouralMap = {
		delete: {
			sucessBehaviour: removeItemFromList,
			method: "DELETE",
		},
		grayout: {
			sucessBehaviour: () => {},
			method: "POST",
		},
		simple: {
			sucessBehaviour: () => {},
			method: "POST",
		}
	};

	useEffect(() => {
		setButtons(interfaceBuilder.getButtons(item, callBackBehaviourMap));
	}, [item]);

	return (
		<>
			<div className="Interface">
				{buttons}
			</div>
		</>
	)
}

