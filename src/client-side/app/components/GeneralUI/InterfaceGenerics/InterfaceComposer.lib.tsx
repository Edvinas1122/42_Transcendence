
interface FormField {
	name: string;
	type?: string;
	value?: string;
	dependency?: (item: any) => boolean;
}

interface ButtonConfig<T extends HasId> {
    name: string,
	endpointTemplate: string,
	type: "simple" | "grayout" | "delete" | "toggle",
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
		sucessBehaviour?: (item: any) => void,
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
	UnitRouter
};