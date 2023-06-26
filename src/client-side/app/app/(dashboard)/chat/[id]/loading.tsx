import "@/public/loading.css" 

const LoadingSkeleton = () => (
	<div className="loading">
		<div className="spinner"></div>
	</div>
)

export default function Loading() {
	// You can add any UI inside Loading, including a Skeleton.
	return <LoadingSkeleton />
}