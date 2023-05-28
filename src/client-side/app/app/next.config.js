/** @type {import('next').NextConfig} */
const nextConfig = {
	serverRuntimeConfig: {
		// Will only be available on the server side
		backend_api_url: process.env.BACKEND_API_URL
	}
}

module.exports = nextConfig
