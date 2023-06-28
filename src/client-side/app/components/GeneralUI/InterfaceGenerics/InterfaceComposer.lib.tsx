
interface FormField {
	name: string;
	type?: string;
	value?: string;
}

interface ButtonConfig<T extends HasId> {
    name: string,
	endpointTemplate: string,
	type: "simple" | "grayout" | "delete" | "toggle",
	displayDependency?: (item: T) => boolean,
	fields?: FormField[],
}

interface ToggleUnit {
	name: string,
	endpointTemplate: string,
	fiedls?: FormField[],
}

interface ToggleButtonConf<T extends HasId> {
	dependency: (item: T) => boolean,
	unitOne: ToggleUnit,
	unitTwo: ToggleUnit,
}

interface HasId {
	_id: string;
}


type EntityInterfaceBuilder<T extends HasId> = () => {
	addButton: (props: ButtonConfig<T>) => any,
	addToggleDependency: (props: ToggleButtonConf<T>) => any,
	getButtons: (item: T, callBackBehaviourMap: BehaviouralMap) => JSX.Element[],
};

interface BehaviouralMap {
	[key: string]: {
		sucessBehaviour?: (item: any) => void,
		method?: "POST" | "DELETE"
	}
}

export type { ButtonConfig, ToggleUnit, ToggleButtonConf, EntityInterfaceBuilder, HasId, BehaviouralMap };