"use client";
import React, { useEffect, useRef, useState, Suspense } from "react";
import "@/public/layout.css";
import { Message } from "@/lib/DTO/AppData";
import { serverFetch } from "@/lib/fetch.util";
import { notFound } from "next/navigation";
import SpinnerLoader from "@/components/GeneralUI/Loader";

/*
    Generic client Entity list component
    
    Designed for dynamic lists modification:
        - editItemsCallback: callback function to set items
    
	And for interactive entity boxes:
		- entityInterface: interface for interactive entity boxes
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

export interface EntityBoxInterface {
	interactItemEntityCallbackEffects?: EntityButton[],
	removeItemEntityCallbackEffects?: EntityButton[],
	conditionalStyle?: Function,
}

interface UIClientListBoxProps {
    initialItems: any[] | string,
    BoxComponent: Function,
    ListStyle?: string,
    BoxStyle?: string,
    editItemsCallback?: Function
	entityInterface?: EntityBoxInterface,
}

const UIClientListBox: Function = ({ 
    initialItems,
    BoxComponent,
    ListStyle,
    BoxStyle,
    editItemsCallback,
	entityInterface,
}: UIClientListBoxProps ) => {

    const endOfListRef = useRef<HTMLDivElement | null>(null);
    const [Items, setItems] = useState<any[]>([]);

	useEffect(() => {
		if (typeof initialItems === "string") {
			serverFetch<any[]>(initialItems).then((data) => setItems(data));
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

    return (
		<div className={"List " + ListStyle}>
			<Suspense fallback={<SpinnerLoader />}>
			{Items && Items.map((item: any) => {
				return (
					<EntityBox
						key={item._id}
						item={item}
						style={BoxStyle}
						BoxComponent={BoxComponent}
						entityInterface={entityInterface}
						removeItemFromList={removeItemFromList}
						conditionalStyle={entityInterface?.conditionalStyle}
					/>
				);
			})}
			<div ref={endOfListRef} />
			</Suspense>
		</div>
    );
}

interface EntityBoxProps {
    item: any,
    BoxComponent: Function,
    style?: string,
	entityInterface?: EntityBoxInterface,
	removeItemFromList: Function,
	conditionalStyle?: Function,
}

const EntityBox: Function = ({
	item,
	BoxComponent,
	style,
	entityInterface,
	removeItemFromList,
	conditionalStyle,
}: EntityBoxProps) => {

	if (conditionalStyle) {
		style = conditionalStyle(item);
	}

	return (
		<div className={"Entity " + style}>
			<BoxComponent
				item={item}
				// style={style}
			/>
			{entityInterface?.interactItemEntityCallbackEffects?.map((button, index) => {
				if (!button.dependency || button.dependency(item)) {
					return <button key={index} onClick={() => button.onClick(item)}>{button.name}</button>
				}
				return null;
			})}
			{entityInterface?.removeItemEntityCallbackEffects?.map((button, index) => {
				if (!button.dependency || button.dependency(item)) {
					return <button 
								key={index}
								onClick={async () => {
									if (isAsync(button.onClick)) {
										await button.onClick(item);
									} else {
										button.onClick(item);
									}
									removeItemFromList(item);
								}}
							>{button.name}</button>
				}
				return null;
			})}
		</div>
	);
}

function isAsync(fn: Function) {
    return Object.prototype.toString.call(fn) === '[object AsyncFunction]';
}

/*
	A hellper class to build the entity interface

	Offers methods to add buttons to the entity interface
		and a build method to return a frozen copy of the object
		so to avoid encapsulation problems

*/
export class EntityInterfaceBuilder implements EntityBoxInterface {
    public removeItemEntityCallbackEffects: EntityButton[] = [];
    public interactItemEntityCallbackEffects: EntityButton[] = [];
	public conditionalStyle?: Function;

    addRemoveButton(name: string, onClick: Function, dependency?: (item: any) => boolean) {
        const button: EntityButton = {
            name,
            onClick,
            dependency
        }
        this.removeItemEntityCallbackEffects.push(button);
        return this;
    }

    addInteractButton(name: string, onClick: Function, dependency?: (item: any) => boolean) {
        const button: EntityButton = {
            name,
            onClick,
            dependency
        }
        this.interactItemEntityCallbackEffects.push(button);
        return this;
    }

	addConditionalStyle(conditionalStyle: Function) {
		this.conditionalStyle = conditionalStyle;
		return this;
	}

    build(): EntityBoxInterface {
        // return a "frozen" copy of the object
        return Object.freeze({
            removeItemEntityCallbackEffects: [...this.removeItemEntityCallbackEffects],
            interactItemEntityCallbackEffects: [...this.interactItemEntityCallbackEffects],
			conditionalStyle: this.conditionalStyle,
        });
    }
}

export default UIClientListBox;