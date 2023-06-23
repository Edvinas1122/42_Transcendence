"use client";
import React, { useEffect, useRef, useState } from "react";
import "@/public/layout.css";
import { Message } from "@/lib/DTO/AppData";

/*
    Generic client Entity list component
    
    Designed for dynamic lists modification:
        - setItemsCallback: callback function to set items
        - removeItemCallback: callback function to remove items
    
	And for interactive entity boxes:
		- entityInterface: interface for interactive entity boxes
		- interactItemEntityCallbackEffects: array of buttons to interact with the entity
		- removeItemEntityCallbackEffects: array of buttons to remove the entity

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
}

interface UIClientListBoxProps {
    initialItems: any[],
    BoxComponent: Function,
    ListStyle?: string,
    BoxStyle?: string,
    setItemsCallback?: Function
    removeItemCallback?: Function,
	entityInterface?: EntityBoxInterface,
}

const UIClientListBox: Function = ({ 
    initialItems,
    BoxComponent,
    ListStyle,
    BoxStyle,
    setItemsCallback,
    removeItemCallback,
	entityInterface,
}: UIClientListBoxProps ) => {

	console.log("LiveMessages", initialItems);
    const endOfListRef = useRef<HTMLDivElement | null>(null);
    const [Items, setItems] = useState<any[]>(initialItems);

    useEffect(() => {
        setItemsCallback && setItemsCallback(setItems);
    }, [setItemsCallback]);

    useEffect(() => {
        removeItemCallback && removeItemCallback(Items, setItems);
    }, [removeItemCallback, Items]);
    
    useEffect(() => {
        endOfListRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [Items]);

	const removeItemFromList = (itemToRemove: any) => {
		setItems((prevItems: any[]) => prevItems.filter(item => item._id !== itemToRemove._id));
	};

    return (
        <div className={"List " + ListStyle}>
            {Items && Items.map((item: any) => {
                return (
                    <EntityBox
						key={item._id}
						item={item}
						style={BoxStyle}
						BoxComponent={BoxComponent}
						entityInterface={entityInterface}
						removeItemFromList={removeItemFromList}
					/>
                );
            })}
            <div ref={endOfListRef} />
        </div>
    );
}

interface EntityBoxProps {
    item: any,
    BoxComponent: Function,
    style?: string,
	entityInterface?: EntityBoxInterface,
	removeItemFromList: Function,
}

const EntityBox: Function = ({
	item,
	BoxComponent,
	style,
	entityInterface,
	removeItemFromList,
}: EntityBoxProps) => {

	return (
		<div className={"EntityBox " + style}>
			<BoxComponent
				item={item}
				style={style}
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

export default UIClientListBox;