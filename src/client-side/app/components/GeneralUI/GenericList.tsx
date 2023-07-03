import "@/public/layout.css";

const UIListBox: Function = ({ Items, BoxComponent, ListStyle, BoxStyle }: { Items: any[], BoxComponent: Function, ListStyle?: string, BoxStyle?: string}) => {

	return (
		<div className={"List " + ListStyle}>
		{Items.map((item: any) => {
			return (
				<BoxComponent key={item._id} item={item} style={BoxStyle} />
			);
		})}
		</div>
	);
}

export default UIListBox;