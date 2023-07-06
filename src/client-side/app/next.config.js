/** @type {import('next').NextConfig} */
const nextConfig = {
	// async rewrites() {
	// 	return [
	// 		{
	// 			source: '/avatar/',
	// 			destination: '/avatar/',
	// 		},
	// 		{
	// 			source: '/:any*',
	// 			destination: '/',
	// 		}
	// 	]
	// },
	images: {
		domains: ['localhost'],
	},
	experimental: {
		serverActions: true,
	},
	serverRuntimeConfig: {
		// Will only be available on the server side
		backend_api_url: process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL,
		sample: 'sample'
	}
}

module.exports = nextConfig
