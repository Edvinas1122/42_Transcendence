import React, { useState, useEffect, MouseEvent } from 'react';
import DisplayPopUp from "@/components/EventsInfoUI/EventsInfo";
import { serverFetch } from '@/lib/fetch.util';
import { SpinnerLoaderSmall } from '../Loader';
import { usePathname, useRouter } from 'next/navigation';
import {
	ButtonConfig,
	ToggleUnit,
	ToggleButtonConf,
	EntityInterfaceBuilder,
	BehaviouralMap,
	HasId,
	FormField,
	UnitRouter,
	} from './InterfaceComposer.lib';
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

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		onClick();
	};

	if (state === "loading")
		return <button className="waiting"><SpinnerLoaderSmall /></button>;
	else if (state === "disabled")
		return <button disabled>{name}</button>;
	else if (state === "notVisible") // not used
		return <></>;
	else if (state === "error")
		return <button className="waiting">Error...</button>;
	return <button onClick={handleClick}>{name}</button>;
};

const InterfaceUnit = ({
	name,
	endpointTemplate,
	httpmethod,
	item,
	fields,
	callBackBehaviour,
	renderDependency,
	link,
}: {
	name: string,
	endpointTemplate: string,
	httpmethod?: "POST" | "DELETE";
	item: any,
	fields?: FormField[],
	callBackBehaviour?: (item: any) => void,
	renderDependency?: (item: any) => boolean,
	link?: UnitRouter,
}) => {
	const endpoint = endpointTemplate.replace("[id]", item._id);
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(true);
	const [error, setError] = useState(false);
	const [fieldValues, setFieldValues] = useState<Record<string, any>>(
		fields?.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {}) || {}
		);
	const method = httpmethod || "POST";
	const router = useRouter();
	const pathname = usePathname();
	const interfaceUnitLinksTo = link ? link.link?.replace("[id]", item._id) : ""; 

	const routeActivatesLink = (): boolean => {
		
		if (!link?.currentActiveOnly)
			return true;
		if (pathname === link?.currentActiveOnly?.replace("[@]", item._id))
			return true;
		return false;
	}

	const linkHanlder = () => {
		if (interfaceUnitLinksTo.length > 0 && routeActivatesLink()) {
			router.replace(interfaceUnitLinksTo);
		}
	};
	
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
			setFieldValues(fields?.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}) || {});
			try {
				console.log("endpoint", endpoint, "field Values", fieldValues);
				const response = await serverFetch<Response>(endpoint, method, { 'Content-Type': 'application/json' }, JSON.stringify(fieldValues));
				// assume success
				setLoading(false);
				callBackBehaviour && callBackBehaviour(item);
				linkHanlder();
				return response;	
			} catch (error: any) {
				const errorObject = JSON.parse(error.message); 
				DisplayPopUp(errorObject.error, errorObject.message, 1500, "danger");
				setLoading(false);
				setError(true);
				setTimeout(() => {
					setError(false);
				}, 1000);
			}
		})();
	};

	const onInputChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
		setFieldValues(prevState => ({...prevState, [name]: event.target.value}));
	};

	return (
		<div className="Unit">
		<Button
			name={name}
			onClick={onClickFunction}
			state={!visible ? "notVisible" : error? "error": loading ? "loading" : "idle"}
		/>
		{fields && (
			<form onSubmit={onSubmitFunction}>
					{fields.map((field, index) => (
						<input 
							key={index} 
							type={field.type || 'text'} 
							value={fieldValues[field.name] || ''} 
							onChange={onInputChange(field.name)}
							placeholder={field.name + "..."} // This line adds the placeholder text
						/>
					))}
			</form>
		)}
		</div>
	)
}

export const ToggleInterfaceUnit = ({ 
	unitOne, 
	unitTwo, 
	item,
	dependency,
	toggleBehaviour,
	initialToggleState
}: {
	key: number,
	unitOne: ToggleUnit,
	unitTwo: ToggleUnit,
	item: any,
	dependency: (item: any) => boolean,
	toggleBehaviour?: (status: boolean) => void
	initialToggleState?: boolean
}) => {
	const dependencyState = typeof initialToggleState !== 'undefined' ? initialToggleState : dependency(item);
	const [visibleUnit, setVisibleUnit] = useState(unitOne);
	const [hiddenUnit, setHiddenUnit] = useState(unitTwo);

	useEffect(() => {
		if (dependencyState) {
			setVisibleUnit(unitOne);
			setHiddenUnit(unitTwo);
		} else {
			setVisibleUnit(unitTwo);
			setHiddenUnit(unitOne);
		}
	}, [dependencyState]);
	
	const toggleUnit = () => {
		setVisibleUnit(visibleUnit === unitOne ? unitTwo : unitOne);
		setHiddenUnit(hiddenUnit === unitTwo ? unitOne : unitTwo)
		toggleBehaviour && toggleBehaviour(!initialToggleState);
	}

	return (
		<>
			<InterfaceUnit
				key={1}
				name={visibleUnit.name}
				endpointTemplate={visibleUnit.endpointTemplate}
				item={item}
				fields={visibleUnit.fields}
				httpmethod={"POST"}
				callBackBehaviour={toggleUnit}
				link={visibleUnit.link}
			/>
		</>
	);
};

export function EntityInterfaceBuilder<T extends HasId>(): EntityInterfaceBuilder<T> {
	let buttonConfigs: ButtonConfig<T>[] = [];
	let toggleConfigs: ToggleButtonConf<T>[] = [];

	const getButtons = (item: T, callBackBehaviourMap: BehaviouralMap, linkStatus?: boolean): JSX.Element[] => {
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
				toggleBehaviour={callBackBehaviourMap[toggle.type]?.togggledBehaviour}

			/>
		);

		return [...regularButtons, ...toggleButtons];
	}

	const addButton = (props: ButtonConfig<T>) => {
		buttonConfigs = [...buttonConfigs, props];
		return builder;
	}

	const addToggleButton = (props: ToggleButtonConf<T>) => {
		toggleConfigs = [...toggleConfigs, props];
		return builder;
	};

	const builder: EntityInterfaceBuilder<T> = {
		addButton: (props: ButtonConfig<T>) => {
		  buttonConfigs = [...buttonConfigs, props];
		  return builder;
		},
		addToggleButton: (props: ToggleButtonConf<T>) => {
			toggleConfigs = [...toggleConfigs, props];
			return builder;
		},
		getButtons: (item: T, callBackBehaviourMap: BehaviouralMap, linkStatus?: boolean) => {
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
				toggleBehaviour={callBackBehaviourMap[toggle.type]?.togggledBehaviour}
				initialToggleState={linkStatus}
			/>
		  );
	
		  return [...regularButtons, ...toggleButtons];
		},
	};

	return builder;
}

export const EntityInterface = ({ 
		item,
		interfaceBuilder,
		removeItemFromList,
		setLinkActiveStatus,
		linkStatus
	}: {
		item: any,
		interfaceBuilder: any,
		removeItemFromList: (item: any) => void,
		setLinkActiveStatus: (status: boolean) => void
		linkStatus: boolean
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
		},
		linkToggle: {
			togggledBehaviour: setLinkActiveStatus,
			method: "POST",
		},
	};

	useEffect(() => {
		setButtons(interfaceBuilder.getButtons(item, callBackBehaviourMap, linkStatus));
	}, [item]);

	return (
		<>
			<div className="Interface">
				{buttons}
			</div>
		</>
	)
}

