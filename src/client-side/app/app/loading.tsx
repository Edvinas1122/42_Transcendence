const LoadingSkeleton = () => (
	<div className="loading-skeleton">
		<div className="loading-skeleton__avatar" />
		<div className="loading-skeleton__author" />
		<div className="loading-skeleton__details" />
	</div>
)

export default function Loading() {
	// You can add any UI inside Loading, including a Skeleton.
	return <LoadingSkeleton />
}