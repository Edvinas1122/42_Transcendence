# Start with a Node.js base image
FROM node:20

# Set /app as the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY app/package*.json ./

# Install dependencies
RUN mkdir app/
RUN npm install

# Copy tsconfig.json
COPY app/tsconfig.json ./

# Copy the rest of the application
COPY app/ ./

# Build the Next.js app
RUN npm run build


# Expose the port that the Next.js app will run on
EXPOSE 3030

# Start the Next.js app
CMD ["npm", "run", "dev"]
# CMD ["npm", "run", "start"]
