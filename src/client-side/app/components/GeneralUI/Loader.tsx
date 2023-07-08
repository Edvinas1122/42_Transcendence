import "@/public/loading.css" 

const SpinnerLoader: Function = () => {

	return (
		<div className="loading">
			<div className="spinner"></div>
		</div>
	)
}

const SpinnerLoader2: Function = () => {

	return (
		<div className="" style={
			{display: 'flex'}
		}>
			<div className="spinner"></div>
		</div>
	)
}

const SpinnerLoaderSmall: Function = () => {
	
	return (
		<>
			<div className="spinner-small"></div>
		</>
	)
}

export { SpinnerLoaderSmall, SpinnerLoader2 };
export default SpinnerLoader;