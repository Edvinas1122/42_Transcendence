# Start with a Node.js base image
FROM node:20

# Set /app as the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY app/package*.json ./

# Install dependencies
# RUN npm update
RUN npm install

# Copy tsconfig.json
COPY app/tsconfig.json ./


# Create /app/src directory
RUN mkdir src
RUN mkdir /uploads
RUN npm install --save-dev @types/node
RUN npm install --save bcryptjs && npm uninstall --save bcrypt
RUN npm i -D @types/bcrypt

# 2FA 
RUN npm install otplib
RUN npm install qrcode

# RUN npm install --save @nestjs/typeorm typeorm pg
# RUN npm install @nestjs/common@10
# RUN npm install @nestjs/passport passport passport-42

# RUN npm install @nestjs/platform-express
# RUN npm i --save @nestjs/websockets @nestjs/platform-socket.io

# RUN npm install passport-jwt @nestjs/jwt

# RUN npm install class-validator class-transformer

# file upload
# RUN npm install npm i -D @types/multer
# RUN npm install cookie-parser

COPY app/ ./

# Generate SSL certificate
# RUN mkdir -p /etc/ssl/certs && openssl req -x509 -newkey rsa:4096 -nodes -out /etc/ssl/certs/cert.pem -keyout /etc/ssl/certs/key.pem -days 365 -subj '/CN=localhost'


# Expose the port that the application will run on
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "start"]

