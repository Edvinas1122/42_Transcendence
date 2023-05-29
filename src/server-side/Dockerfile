# Start with a Node.js base image
FROM node:20

# Set /app as the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY app/package*.json ./

# Install dependencies
RUN npm install

# Copy tsconfig.json
COPY app/tsconfig.json ./

# Create /app/src directory
RUN mkdir src

# Copy the rest of the application
RUN npm install --save @nestjs/typeorm typeorm pg
RUN npm install @nestjs/passport passport passport-42
RUN npm install passport-jwt @nestjs/jwt
RUN npm install cookie-parser
COPY app/ ./


# Expose the port that the application will run on
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "start:dev"]
