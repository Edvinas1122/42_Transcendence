
interface FormField {
	name: string;
	type?: string;
	value?: string;
	dependency?: (item: any) => boolean;
}

/*
	simple - just a button
	grayout - button that grays out when clicked
	delete - use callback to remove item from list
	toggle - not sure yet
	action - updates notifcation if successful, designed for put or post entity updates
*/ 
interface ButtonConfig<T extends HasId> {
    name: string,
	endpointTemplate: string,
	type: "simple" | "grayout" | "delete" | "toggle" | "action",
	displayDependency?: (item: T) => boolean,
	fields?: FormField[],
}

interface UnitRouter {
	link: string,
	currentActiveOnly?: string,
}

interface ToggleUnit {
	name: string,
	endpointTemplate: string,
	fields?: FormField[],
	link?: UnitRouter,
}

interface ToggleButtonConf<T extends HasId> {
	dependency: (item: T) => boolean,
	type: "linkToggle" | "simple",
	unitOne: ToggleUnit,
	unitTwo: ToggleUnit,
}

interface HasId {
	_id: number;
}


type EntityInterfaceBuilder<T extends HasId> = {
	addButton: (props: ButtonConfig<T>) => EntityInterfaceBuilder<T>,
	addToggleButton: (props: ToggleButtonConf<T>) => EntityInterfaceBuilder<T>,
	getButtons: (item: T, callBackBehaviourMap: BehaviouralMap) => JSX.Element[],
};

interface BehaviouralMap {
	[key: string]: {
		sucessBehaviour?: (item: any, response?: EntityUpdateResponse) => void,
		togggledBehaviour?: (status: boolean) => void,
		method?: "POST" | "DELETE"
	}
}

export type {
	ButtonConfig,
	ToggleUnit,
	ToggleButtonConf,
	EntityInterfaceBuilder,
	HasId,
	BehaviouralMap,
	FormField,
	UnitRouter,
	EntityUpdateResponse,
};

interface EntityUpdateResponse extends Response {
	title: string;
	message: string;
}