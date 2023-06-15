/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{
				source: '/avatar/',
				destination: '/avatar/',
			},
			{
				source: '/:any*',
				destination: '/',
			}
		]
	},
	serverRuntimeConfig: {
		// Will only be available on the server side
		// backend_api_url: process.env.BACKEND_API_URL,
		sample: 'sample'
	}
}

module.exports = nextConfig
