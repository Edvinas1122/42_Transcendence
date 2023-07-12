"use client";
import React, { useEffect, useRef, useState, Suspense } from "react";
import "@/public/layout.css";
import { serverFetch } from "@/lib/fetch.util";
import { notFound, usePathname, useRouter } from "next/navigation";
import SpinnerLoader from "@/components/GeneralUI/Loader";
import { EntityInterface } from "./InterfaceGenerics/InterfaceComposer";
import { HasId } from "./InterfaceGenerics/InterfaceComposer.lib";

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
	editItemsCallback?: Function,
	editLinkGate?: Function,
	interfaceBuilder?: any,
	categories?: CategoryDisisplay[],
	linkDefinition?: LinkDefinition,
	emptyListMessage?: string,
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
	linkDefinition,
	emptyListMessage,
}: UIClientListBoxProps ) => {

	const endOfListRef = useRef<HTMLDivElement | null>(null);
	const [Items, setItems] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [fetchError, setFetchError] = useState(false);

	useEffect(() => {
		if (fetchError) {
			notFound();
		}
	}, [fetchError]);

	useEffect(() => {
		if (typeof initialItems === "string") {
			setIsLoading(true);
			serverFetch<any[]>(initialItems).then(
				(data: any) => {
					if (data.error){
						notFound();
					}
					setItems(data)	
				}).catch((error) => {
					setFetchError(true);
					// throw new Error(error);
			});
			setIsLoading(false);
		} else if (Array.isArray(initialItems)) {
			setItems(initialItems);
		}
	}, [initialItems]);

	useEffect(() => {
		editItemsCallback && editItemsCallback(setItems);
	}, [editItemsCallback]);
	
	useEffect(() => {
		endOfListRef.current?.scrollIntoView( );
	}, [Items]);

	if (isLoading) {
		return <SpinnerLoader />; // causes spinnergendon
	}

	const removeItemFromList = (item: any): void => {
		setItems((prevItems: any[]) => 
			prevItems.filter(currentItem => currentItem._id !== item._id));
	};

	const renderGroup = (groupItems: any[], groupName: string) => {
		return (
		<div key={groupName}>
			{groupItems.length > 0 && groupName != "Rest" &&
				<h2 className="groupName">{groupName}</h2>}
			{groupItems.map((item: any) => (
			<EntityBox
				key={item._id}
				item={item}
				style={BoxStyle}
				BoxComponent={BoxComponent}
				removeItemFromList={removeItemFromList}
				interfaceBuilder={interfaceBuilder}
				conditionalStyle={conditionalStyle}
				linkDefinition={linkDefinition}
			/>
			))}
		</div>
		);
	};

	let restItems = Array.isArray(Items) ? [...Items] : [];
	const categorizedItems = categories?.map((category) => {
		const categoryItems = restItems.filter((item) => category.dependency(item));
		restItems = restItems.filter((item) => !categoryItems.includes(item)); // Now, this will not cause re-render
		return { name: category.name, items: categoryItems };
	});

	return (
		<div className={"List " + ListStyle}>
			{!Items.length ? (
				emptyListMessage &&<div class="emptyListMessage"><h2>{emptyListMessage}</h2></div>
			) : (
				<>
					{categorizedItems && categorizedItems.map((category, index) => 
						renderGroup(category.items, category.name)
					)}
					{restItems.length > 0 && renderGroup(restItems, 'Rest')}
				</>
			)}
			<div ref={endOfListRef} />
		</div>
	);
}

interface LinkDefinition {
	linktemplate: string,
	samePage?: boolean,
	toggleGateway?: boolean,
	dependency?: (item: any) => boolean,
	highlightOnly?: boolean,
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
	public linkDefinition?: LinkDefinition;
	public emptyListMessage?: string;

	public setInitialItems(initialItems: any[] | string) {
		this.initialItems = initialItems;
		return this;
	}

	public setBoxComponent(BoxComponent: Function) {
		this.BoxComponent = BoxComponent;
		return this;
	}

	public setLinkDefinition(linkDefinition: LinkDefinition) {
		this.linkDefinition = linkDefinition;
		this.linkDefinition.samePage = this.linkDefinition.samePage || false;
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

	public setEmptyListMessage(emptyListMessage: string) {
		this.emptyListMessage = emptyListMessage;
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
			linkDefinition: this.linkDefinition,
			emptyListMessage: this.emptyListMessage,
		});
	}
}

const LinkBox: React.FC<{
	item: any,
	childnode: React.ReactNode, 
	linkDef: LinkDefinition,
}> = ({
	item,
	childnode,
	linkDef,
}) => {
	const pathname = usePathname();
	const router = useRouter();
	const routedLink = linkDef.linktemplate.replace("[id]", item._id);
	const level = linkDef.linktemplate.split('/').indexOf('[id]');
	const openSpecifiedLink = () => {
			if (linkDef.samePage && pathname.split('/').length > level) {
				router.replace(routedLink);
			}
			else {
				router.push(routedLink);
			}
		}
	const isRouteActiveStyle = (item: HasId): string => {
		return item._id.toString() == pathname.split('/')[level] ? "Active" : "";
	}

	const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => { // to handle propagation issue
		if (!linkDef.highlightOnly) {
			openSpecifiedLink();
		}
	}

	const LinkStyle = linkDef.highlightOnly ? isRouteActiveStyle(item) : "Link " + isRouteActiveStyle(item);

	const style = !linkDef.highlightOnly ? { cursor: 'pointer' } : {};

	return (
		<div onClick={handleClick} className={LinkStyle} style={style}>
			{childnode}
		</div>
	);
}

interface EntityBoxProps {
	item: any,
	BoxComponent: Function,
	style?: string,
	removeItemFromList: (item: any) => void,
	conditionalStyle?: Function,
	interfaceBuilder?: any,
	linkDefinition?: LinkDefinition,
	
}

const EntityBox: Function = ({
	item,
	BoxComponent,
	style,
	removeItemFromList,
	conditionalStyle,
	interfaceBuilder,
	linkDefinition,
}: EntityBoxProps) => {

	const [linkActive, setLinkActiveStatus] = useState<boolean>(
		linkDefinition && typeof linkDefinition.dependency === 'function' ?
		linkDefinition.dependency(item) : true
	);
	const [entityState, setEntityState] = useState<any>(item);


	const setLinkStatus = (status: boolean): void => {
		setLinkActiveStatus(status);
	}

	const theStyle = conditionalStyle ? style + " " + conditionalStyle(item): style;

	const EntityInternals = () => (
		<div className={"Entity " + theStyle}>
			<BoxComponent
				item={entityState}
				childnode={interfaceBuilder && <EntityInterface
					item={entityState}
					interfaceBuilder={interfaceBuilder}
					removeItemFromList={removeItemFromList}
					setLinkActiveStatus={setLinkStatus}
					linkStatus={linkActive}
					setEntityState={setEntityState}
				/>}
			/>
		</div>
	);

	return linkDefinition && linkActive ? (
		<LinkBox
			item={entityState}
			childnode={<EntityInternals />}
			linkDef={linkDefinition}
			/>
	) : (
		<EntityInternals />
	);
}

// function isAsync(fn: Function) {
//     return Object.prototype.toString.call(fn) === '[object AsyncFunction]';
// }

export default UIClientListBox;