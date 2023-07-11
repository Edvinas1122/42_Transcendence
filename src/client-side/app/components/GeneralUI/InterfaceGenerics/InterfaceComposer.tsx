import React, { useState, useEffect, MouseEvent, useContext } from 'react';
import DisplayPopUp from "@/components/EventsInfoUI/EventsInfo";
import { serverFetch } from '@/lib/fetch.util';
import { useServerFetch } from '@/lib/fetch.client';
import { SpinnerLoaderSmall } from '../Loader';
import { usePathname, useRouter } from 'next/navigation';
import { ConfirmationContext } from '@/components/confirmationDialog/Confirmation';
import {
	ButtonConfig,
	ToggleUnit,
	ToggleButtonConf,
	EntityInterfaceBuilder,
	BehaviouralMap,
	HasId,
	FormField,
	UnitRouter,
	Confirmation
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
	// autoField,
	callBackBehaviour,
	renderDependency,
	link,
	setEntityState,
	editEntity,
	confirmation,
}: {
	name: string,
	endpointTemplate: string,
	httpmethod?: "POST" | "DELETE";
	item: any,
	fields?: FormField[],
	// autoField?: (item: any) => string,
	callBackBehaviour?: (item: any, response?: EntityUpdateResponse) => void,
	renderDependency?: (item: any) => boolean,
	link?: UnitRouter,
	setEntityState?: (item: any) => void,
	editEntity?: (item: any) => any,
	confirmation?: Confirmation,
}) => {
	const pathname = usePathname();
	const {setConfirmation} = useContext(ConfirmationContext);
	// const pageId = pathname.split("/").pop() || ''; // fallback to empty string if no value
	const endpoint = endpointTemplate.replace("[id]", item._id)
	// .replace("[@]", pageId);
	const [loading, setLoading] = useState(false);
	// const [visible, setVisible] = useState(true);
	const [error, setError] = useState(false);
	const [fieldValues, setFieldValues] = useState<Record<string, any>>(
		fields?.reduce((acc, field) => ({
		  ...acc,
		  [field.name]: field.autoField ? field.autoField(item) : field.value
		}), {}) || {}
	);
	const method = httpmethod || "POST";
	const router = useRouter();
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
			!link?.push ? router.replace(interfaceUnitLinksTo):
			router.push(interfaceUnitLinksTo);
		}
	};
	
    const onSubmitFunction = (event: React.FormEvent) => {
		event.preventDefault();
        onClickFunction();
	};

	// useEffect(() => {
	// 	if (renderDependency && !renderDependency(item))
	// 		setVisible(false);
	// }, [item]);
	const visible = renderDependency ? renderDependency(item) : true; // removed state for now


	const onClickFunction = () => {
		// console.log("trigered on clieck ", confirmation, setConfirmation);
	if (confirmation && confirmation.condition(item)) {
		// Show confirmation dialog
		setConfirmation({
			title: confirmation.title,
			message: confirmation.question,
			yes: confirmation.yes,
			no: confirmation.no,
			onConfirm: proceedWithAction,  // the function that performs the actual action
			onCancel: () => {}  // You could perform some action on cancel, or leave this empty
		});
	} else {
		proceedWithAction();
	}
	};

	// const proceedWithAction = async () => {
	// // Place your original onClickFunction logic here
	// };

	const proceedWithAction = () => {
		(async () => {
			setLoading(true);
			if (fields) {
				setFieldValues(prevState =>
				  fields.reduce((acc, field) => {
					// If it's an autofilled field, keep its current value
					if (field.autoField) {
					  return {
						...acc,
						[field.name]: prevState[field.name]
					  };
					}
					// Else reset its value
					return {
					  ...acc,
					  [field.name]: ''
					};
				  }, {} as Record<string, any>)
				);
			  }
			// setFieldValues(fields?.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}) || {});
			try {
				// console.log("endpoint", endpoint, "field Values", fieldValues);
				const response = await serverFetch<Promise<EntityUpdateResponse>>(endpoint, method, { 'Content-Type': 'application/json' }, JSON.stringify(fieldValues));
				if (response?.error) {
					throw new Error(JSON.stringify(response));
				}
				setLoading(false);
				callBackBehaviour && callBackBehaviour(item, response);
				editEntity && setEntityState && setEntityState(editEntity(item));
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

	useEffect(() => {
		if (fields) {
		  setFieldValues(prevState => (
			fields.reduce((acc, field) => {
			  if (field.autoField) {
				return {
				  ...acc,
				  [field.name]: field.autoField(item)
				};
			  }
			  return acc;
			}, prevState)
		  ));
		}
	  }, [item, fields]);

	const onInputChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
		const field = fields?.find(field => field.name === name);
		if (field?.autoField) {
		  // Ignore user input for auto-filled fields
		  return;
		}
		setFieldValues(prevState => ({...prevState, [name]: event.target.value}));
	  };

	return (
		<div className="Unit">
		<Button
			name={name}
			onClick={onClickFunction}
			state={!visible ? "notVisible" : error? "error": loading ? "loading" : "idle"}
		/>
		{fields && visible && !loading && (
			<form onSubmit={onSubmitFunction}>
				{fields.map((field, index) => {
					if (field.dependency === undefined || field.dependency(item)) {
						return (
							<input 
								key={index} 
								type={field.invisible ? 'hidden' : field.type || 'text'}
								value={fieldValues[field.name] || ''} 
								onChange={onInputChange(field.name)}
								onClick={(e) => e.stopPropagation()}
								placeholder={field.name + "..."} // This line adds the placeholder text
							/>
						);
					}
					return null; // don't render anything if dependency is not met
				})}
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
	initialToggleState,
	setEntityState,
}: {
	unitOne: ToggleUnit,
	unitTwo: ToggleUnit,
	item: any,
	dependency?: (item: any) => boolean,
	toggleBehaviour?: (status: boolean) => void
	initialToggleState?: boolean,
	setEntityState?: (item: any) => void,
}) => {
	const individualToggleDependency = dependency? dependency : (item: any) => true;
	const dependencyState = dependency ? individualToggleDependency(item) : initialToggleState;
	// const dependencyState = typeof initialToggleState !== 'undefined' ? initialToggleState : individualToggleDependency(item) ;
	const [visibleUnit, setVisibleUnit] = useState(unitOne);
	const [hiddenUnit, setHiddenUnit] = useState(unitTwo);

	// console.log("dependencyState", item, dependency(item), initialToggleState);
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
				key={visibleUnit.name}
				name={visibleUnit.name}
				endpointTemplate={visibleUnit.endpointTemplate}
				item={item}
				fields={visibleUnit.fields}
				httpmethod={"POST"}
				callBackBehaviour={toggleUnit}
				link={visibleUnit.link}
				setEntityState={setEntityState}
				editEntity={visibleUnit.editEntity}
				confirmation={visibleUnit.confirmation}
			/>
		</>
	);
};

export function EntityInterfaceBuilder<T extends HasId>(): EntityInterfaceBuilder<T> {
	let buttonConfigs: ButtonConfig<T>[] = [];
	let toggleConfigs: ToggleButtonConf<T>[] = [];

	const getButtons = (item: T, callBackBehaviourMap: BehaviouralMap, setEntityState: (item: any) => void, linkStatus?: boolean): JSX.Element[] => {
		const regularButtons = buttonConfigs.map((button, index) => 
			<InterfaceUnit
				key={`interface-${index}`}
				name={button.name}
				endpointTemplate={button.endpointTemplate}
				item={item}
				fields={button.fields}
				httpmethod={callBackBehaviourMap[button.type].method}
				callBackBehaviour={callBackBehaviourMap[button.type].sucessBehaviour}
				renderDependency={button.displayDependency}
				setEntityState={setEntityState}
				editEntity={button.editEntity}
				confirmation={button.confirmation}
				link={button.link}
			/>
		);

		const toggleButtons = toggleConfigs.map((toggle, index) => 
			<ToggleInterfaceUnit
				key={`toggle-${index}`}
				unitOne={toggle.unitOne}
				unitTwo={toggle.unitTwo}
				item={item}
				dependency={toggle.dependency}
				toggleBehaviour={callBackBehaviourMap[toggle.type]?.togggledBehaviour}
				initialToggleState={linkStatus}
				setEntityState={setEntityState}
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
		getButtons: (item: T, callBackBehaviourMap: BehaviouralMap, setEntityState: (item: any) => void, linkStatus?: boolean) => {
			const regularButtons = buttonConfigs.map((button, index) => 
			  <InterfaceUnit
				key={`button-${index}`}
				name={button.name}
				endpointTemplate={button.endpointTemplate}
				item={item}
				fields={button.fields}
				httpmethod={callBackBehaviourMap[button.type].method}
				callBackBehaviour={callBackBehaviourMap[button.type].sucessBehaviour}
				renderDependency={button.displayDependency}
				setEntityState={setEntityState}
				confirmation={button.confirmation}
				link={button.link}
			  />
			);

		const toggleButtons = toggleConfigs.map((toggle, index) => 
			<ToggleInterfaceUnit
				key={`toggle-${index}`}
				unitOne={toggle.unitOne}
				unitTwo={toggle.unitTwo}
				item={item}
				dependency={toggle.dependency}
				toggleBehaviour={callBackBehaviourMap[toggle.type]?.togggledBehaviour}
				initialToggleState={linkStatus}
				setEntityState={setEntityState}
			/>
		  );

		  return [...regularButtons, ...toggleButtons];
		},
	};

	return builder;
}

interface EntityUpdateResponse extends Response {
	title: string;
	message: string;
	error?: any;
}

export const EntityInterface = ({ 
		item,
		interfaceBuilder,
		removeItemFromList,
		setLinkActiveStatus,
		linkStatus,
		setEntityState
	}: {
		item: any,
		interfaceBuilder: any,
		removeItemFromList: (item: any) => void,
		setLinkActiveStatus: (status: boolean) => void,
		linkStatus: boolean,
		setEntityState: (item: any) => void
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
		// linkToggle: {
		// 	// togggledBehaviour: setLinkActiveStatus,
		// 	method: "POST",
		// },
		action: {
			sucessBehaviour: (item: any, response?: EntityUpdateResponse) => {response && DisplayPopUp(response.title, response.message, 1500)},
			method: "POST",
		},
	};

	useEffect(() => {
		setButtons(interfaceBuilder.getButtons(item, callBackBehaviourMap, setEntityState, linkStatus));
	}, [item]);

	return (
		<>
			<div className="Interface">
				{buttons}
			</div>
		</>
	)
}

