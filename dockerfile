FROM node:18-alpine

WORKDIR / app
COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]


# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Install a simple HTTP server to serve static content
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "build"]