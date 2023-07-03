import "@/public/loading.css" 

const SpinnerLoader: Function = () => {

	return (
		<div className="loading">
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

export { SpinnerLoaderSmall };
export default SpinnerLoader;