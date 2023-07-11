# Start with a Node.js base image
FROM node:20

# Set /app as the working directory
WORKDIR /app


# Copy package.json and package-lock.json (if available)
COPY app/package*.json ./
COPY app/next.config.js ./
COPY app/tailwind.config.js ./
COPY app/tsconfig.json ./

# Install dependencies
RUN mkdir app/

# Copy tsconfig.json
COPY app/tsconfig.json ./


# RUN npm install js-cookie
# RUN npm install --save @types/js-cookie
# RUN npm install bufferutil
# utf-8-validate 
# bufferutil
RUN npm install bufferutil utf-8-validate --save-optional
RUN npm install socket.io-client 
RUN npm install @types/react @types/react-dom @types/node
# RUN npm i sharp

#GRAPHICS RELATED modules
	#functional
RUN npm install react-notifications-component
	#styling
RUN npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
	#File upload 
RUN npm install axios
# RUN npm install -D tailwindcss postcss autoprefixer

# Copy the rest of the application
COPY app/ ./

# Build the Next.js app
RUN npm run build


# Expose the port that the Next.js app will run on
EXPOSE 3030

# Start the Next.js app
CMD ["npm", "run", "dev"]

