/** @type {import('next').NextConfig} */
const nextConfig = {
	serverRuntimeConfig: {
		// Will only be available on the server side
		backend_api_url: process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL,
		frontend_api_url: process.env.NEXT_PUBLIC_FRONTEND_API_BASE_URL,
	}
}

module.exports = nextConfig
