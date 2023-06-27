"use client";
import React, { useEffect, useRef, useState, Suspense } from "react";
import "@/public/layout.css";
import { serverFetch } from "@/lib/fetch.util";
import { notFound } from "next/navigation";
import SpinnerLoader from "@/components/GeneralUI/Loader";
import { ButtonProps, FormProps, ToggleUnitProps, EntityInterfaceBuilder, Button, Form, ToggleUnit } from "@/components/GeneralUI/InterfaceGenerics/InterfaceComposer";

/*
	Generic client Entity list component
	
	Designed for dynamic lists modification:
		- editItemsCallback: callback function to set items
	
	And for interactive entity boxes:
		- interfaceBuilder: interface for interactive entity boxes
		- interactItemEntityCallbackEffects: array of buttons to interact with the entity
		- removeItemEntityCallbackEffects: array of buttons to remove the entity
		- conditionalStyle: function to apply to conditional style to the entity box based on the item

	Currently Context has to be hadled by the parent component
		so to avoid encapsulation problems
	
	Example:
		LiveMessages.tsx
*/

export interface EntityButton {
	name: string,
	onClick: Function,
	dependency?: (item: any) => boolean,
}

export interface EntityForm {
	name: string,
	onClick: Function,
	fields: any[],
	dependency?: (item: any) => boolean,
}

// export interface EntityBoxInterface {
// 	interactItemEntityCallbackEffects?: EntityButton[],
// 	removeItemEntityCallbackEffects?: EntityButton[],
// 	conditionalStyle?: Function,
// }

export interface CategoryDisisplay {
	name: string,
	dependency: (item: any) => boolean,
}

interface UIClientListBoxProps {
	initialItems: any[] | string,
	BoxComponent: Function,
	ListStyle?: string,
	BoxStyle?: string,
	editItemsCallback?: Function
	interfaceBuilder?: any,
	categories?: CategoryDisisplay[]
}

const UIClientListBox: Function = ({ 
	initialItems,
	BoxComponent,
	ListStyle,
	BoxStyle,
	editItemsCallback,
	interfaceBuilder,
	categories,
}: UIClientListBoxProps ) => {

	const endOfListRef = useRef<HTMLDivElement | null>(null);
	const [Items, setItems] = useState<any[]>([]);

	useEffect(() => {
		if (typeof initialItems === "string") {
			serverFetch<any[]>(initialItems).then((data) => setItems(data)); // not found error bug
		} else if (Array.isArray(initialItems)) {
			setItems(initialItems);
		}
	}, [initialItems]);

	useEffect(() => {
		editItemsCallback && editItemsCallback(setItems);
	}, [editItemsCallback]);
	
	useEffect(() => {
		endOfListRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [Items]);

	const removeItemFromList = (itemToRemove: any) => {
		setItems((prevItems: any[]) => prevItems.filter(item => item._id !== itemToRemove._id));
	};

	const renderGroup = (groupItems: any[], groupName: string) => {
		return (
		<div key={groupName}>
			{/* <h2>{groupName}</h2> */}
			{groupItems.map((item: any) => (
			<EntityBox
				key={item._id}
				item={item}
				style={BoxStyle}
				BoxComponent={BoxComponent}
				removeItemFromList={removeItemFromList}
				interfaceBuilder={interfaceBuilder}
			/>
			))}
		</div>
		);
	};

	let restItems = [...Items];
	const categorizedItems = categories?.map((category) => {
		const categoryItems = restItems.filter((item) => category.dependency(item));
		restItems = restItems.filter((item) => !categoryItems.includes(item)); // Now, this will not cause re-render
		return { name: category.name, items: categoryItems };
	});

	return (
		<div className={"List " + ListStyle}>
			<Suspense fallback={<SpinnerLoader />}>
			{categorizedItems && categorizedItems.map((category, index) => 
				renderGroup(category.items, category.name)
			)}
			{restItems.length > 0 && renderGroup(restItems, 'Rest')}
			<div ref={endOfListRef} />
			</Suspense>
		</div>
	);
}

export class UIClientListBoxClassBuilder implements UIClientListBoxProps {
	public initialItems: any[] | string = [];
	public BoxComponent: Function = () => null;
	public ListStyle: string = "";
	public BoxStyle: string = "";
	public editItemsCallback?: Function;
	public interfaceBuilder?: any
	public categories?: CategoryDisisplay[];

	public setInitialItems(initialItems: any[] | string) {
		this.initialItems = initialItems;
		return this;
	}

	public setBoxComponent(BoxComponent: Function) {
		this.BoxComponent = BoxComponent;
		return this;
	}

	public setListStyle(ListStyle: string) {
		this.ListStyle = ListStyle;
		return this;
	}

	public setBoxStyle(BoxStyle: string) {
		this.BoxStyle = BoxStyle;
		return this;
	}

	public setEditItemsCallback(editItemsCallback: Function) {
		this.editItemsCallback = editItemsCallback;
		return this;
	}

	public setEntityInterface(interfaceBuilder: any) {
		this.interfaceBuilder = interfaceBuilder;
		return this;
	}

	public setCategories(categories: CategoryDisisplay[]) {
		this.categories = categories;
		return this;
	}

	public addCategory(category: CategoryDisisplay) {
		this.categories = this.categories ? [...this.categories, category] : [category];
		return this;
	}

	public build() {
		return Object.freeze({
			initialItems: this.initialItems,
			BoxComponent: this.BoxComponent,
			ListStyle: this.ListStyle,
			BoxStyle: this.BoxStyle,
			editItemsCallback: this.editItemsCallback,
			interfaceBuilder: this.interfaceBuilder,
			categories: this.categories,
		});
	}
}

interface EntityBoxProps {
	item: any,
	BoxComponent: Function,
	style?: string,
	removeItemFromList: Function,
	conditionalStyle?: Function,
	interfaceBuilder?: any,
}

const EntityBox: Function = ({
	item,
	BoxComponent,
	style,
	removeItemFromList,
	conditionalStyle,
	interfaceBuilder,
}: EntityBoxProps) => {
	const [buttons, setButtons] = useState<ButtonProps[]>(interfaceBuilder?.buttons || []);
	const [forms, setForms] = useState<FormProps[]>(interfaceBuilder?.forms || []);
	const [toggleUnits, setToggleUnits] = useState<ToggleUnitProps[]>(interfaceBuilder?.toggleUnits || []);

	useEffect(() => {
		if (interfaceBuilder) {
			console.log("buttons", interfaceBuilder.buttons);
			setButtons(interfaceBuilder.buttons);
			setForms(interfaceBuilder.forms);
			setToggleUnits(interfaceBuilder.toggleUnits);
		}
	}, [interfaceBuilder]);

	if (conditionalStyle) {
		style = conditionalStyle(item);
	}

	return (
		<div className={"Entity " + style}>
			<BoxComponent
				item={item}
			/>
			<div className="Interface">
				{buttons && buttons.map((button, index) => (
					<Button key={index} {...button} onClick={() => button.onClick(item)} />
				))}
				{forms && forms.map((form, index) => <Form key={index} {...form} />)}
				{toggleUnits && toggleUnits.map((toggleUnit, index) => <ToggleUnit key={index} {...toggleUnit} />)}
			</div>
		</div>
	);
}

function isAsync(fn: Function) {
    return Object.prototype.toString.call(fn) === '[object AsyncFunction]';
}

// /*
// 	A hellper class to build the entity interface

// 	Offers methods to add buttons to the entity interface
// 		and a build method to return a frozen copy of the object
// 		so to avoid encapsulation problems

// */
// export class EntityInterfaceBuilder implements EntityBoxInterface {
//     public removeItemEntityCallbackEffects: EntityButton[] = [];
//     public interactItemEntityCallbackEffects: EntityButton[] = [];
// 	public interfaceUnit: any[] = [];
// 	public conditionalStyle?: Function;

//     addRemoveButton(name: string, onClick: Function, dependency?: (item: any) => boolean) {
//         const button: EntityButton = {
//             name,
//             onClick,
//             dependency
//         }
//         this.removeItemEntityCallbackEffects.push(button);
//         return this;
//     }

//     addInteractButton(name: string, onClick: Function, dependency?: (item: any) => boolean) {
//         const button: EntityButton = {
//             name,
//             onClick,
//             dependency
//         }
//         this.interactItemEntityCallbackEffects.push(button);
//         return this;
//     }

// 	addConditionalStyle(conditionalStyle: Function) {
// 		this.conditionalStyle = conditionalStyle;
// 		return this;
// 	}

//     build(): EntityBoxInterface {
//         // return a "frozen" copy of the object
//         return Object.freeze({
//             removeItemEntityCallbackEffects: [...this.removeItemEntityCallbackEffects],
//             interactItemEntityCallbackEffects: [...this.interactItemEntityCallbackEffects],
// 			conditionalStyle: this.conditionalStyle,
//         });
//     }
// }

export default UIClientListBox;