"use client";
import React, { useEffect, useRef, useState, Suspense } from "react";
import "@/public/layout.css";
import { serverFetch } from "@/lib/fetch.util";
import { notFound } from "next/navigation";
import SpinnerLoader from "@/components/GeneralUI/Loader";
import { EntityInterface } from "./InterfaceGenerics/InterfaceComposer";


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

export interface CategoryDisisplay {
	name: string,
	dependency: (item: any) => boolean,
}

interface UIClientListBoxProps {
	initialItems: any[] | string,
	BoxComponent: Function,
	ListStyle?: string,
	BoxStyle?: string,
	conditionalStyle?: Function,
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
	conditionalStyle,
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

	const removeItemFromList = (item: any): void => {
		setItems((prevItems: any[]) => prevItems.filter(item => item._id !== item._id));
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
				conditionalStyle={conditionalStyle}
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
	public conditionalStyle?: Function;
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

	public setConditionalStyle(conditionalStyle: Function) {
		this.conditionalStyle = conditionalStyle;
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
			conditionalStyle: this.conditionalStyle,
		});
	}
}

interface EntityBoxProps {
	item: any,
	BoxComponent: Function,
	style?: string,
	removeItemFromList: (item: any) => void,
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

	if (conditionalStyle) {
		style = conditionalStyle(item);
	}

	return (
		<div className={"Entity " + style}>
			<BoxComponent
				item={item}
				childnode={interfaceBuilder && <EntityInterface
					item={item}
					interfaceBuilder={interfaceBuilder}
					removeItemFromList={removeItemFromList}
				/>}
			/>
		</div>
	);
}

function isAsync(fn: Function) {
    return Object.prototype.toString.call(fn) === '[object AsyncFunction]';
}

export default UIClientListBox;