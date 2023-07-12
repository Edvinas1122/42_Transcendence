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
# optimise images nextjs
RUN npm install sharp

COPY app/ ./

# Generate SSL certificate
# RUN mkdir -p /etc/ssl/certs && openssl req -x509 -newkey rsa:4096 -nodes -out /etc/ssl/certs/cert.pem -keyout /etc/ssl/certs/key.pem -days 365 -subj '/CN=localhost'


# Expose the port that the application will run on
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "start"]

