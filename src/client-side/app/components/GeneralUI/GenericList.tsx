import "@/public/layout.css";

const UIListBox: Function = ({ Items, BoxComponent, ListStyle, BoxStyle, emptyMessage }: { Items: any[], BoxComponent: Function, ListStyle?: string, BoxStyle?: string, emptyMessage?: string}) => {
	if (Items.length <= 0 && emptyMessage) {
		return (
			<p>{emptyMessage}</p>
		)
	} else {
		return (
			<div className={"List " + ListStyle}>
			{Items && Items.map((item: any) => {
				return (
					<BoxComponent key={item._id} item={item} style={BoxStyle} />
				);
			})}
			</div>
		);
	}
}

export default UIListBox;